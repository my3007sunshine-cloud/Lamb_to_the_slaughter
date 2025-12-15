// =================================================================
// NIVEL 2 - LOGIC (ARCA CONGELADORA CHEIA) - Versão Mais Gelo
// CÓDIGO MODIFICADO: FREEZER AREA, targetItem, spawn de Itens (50/50) CENTRALIZADOS, 
// EXIGE REVELAÇÃO TOTAL DO PERNIL, E PERMITE CLIQUE SÓ NO PERNIL REVELADO PARA VENCER.
// =================================================================

let isFreezerGameInitialized = false;
let freezerItems = []; 
let targetItem = {};   
let targetFound = false;

// Variáveis para o Timer
let gameTimer = 20; // Duração inicial em segundos (exemplo: 60 segundos)
let timerStartTime; // Para armazenar o tempo de início do jogo (em milissegundos)
let timeLeft; // Tempo restante atual

// Definições da Área da Arca (O Retângulo)
let freezerArea = {
    x: 0, 
    y: 0, 
    w: 0, 
    h: 0
};

function setupNivel2() {
    // 1. Configurar a área da Arca (Ligeiramente Aumentada)
    freezerArea.w = width * 0.6;  // Aumentado ligeiramente para 60% da largura
    freezerArea.h = height * 0.55; // Aumentado ligeiramente para 55% da altura
    
    // POSICIONAMENTO CENTRALIZADO NA TELA:
    freezerArea.x = (width - freezerArea.w) / 2; // Centralizado horizontalmente
    freezerArea.y = (height - freezerArea.h) / 2; // AGORA CENTRADO VERTICALMENTE
    
    // 2. Definir o Alvo (Pernil) - Centralizado na Arca
    // Calcular a posição ideal (canto superior esquerdo) para centrar o objeto
    let targetW = 150;
    let targetH = 250;
    let xCenterTarget = freezerArea.x + freezerArea.w / 2 - targetW / 2;
    let yCenterTarget = freezerArea.y + freezerArea.h / 2 - targetH / 2;
    
    targetItem = {
        id: 'lamb',
        img: imgPernil, 
        // Posição aleatória num pequeno raio de 50px em torno do centro
        x: random(xCenterTarget - 50, xCenterTarget + 50),
        y: random(yCenterTarget - 50, yCenterTarget + 50),
        w: targetW, h: targetH,
        isRevealed: false
    };

    freezerItems = []; // Limpa lista anterior

    // 3. GERAR MUITOS ITENS (50% Centralizado, 50% Amplo)
    
    // Definir as áreas de spawn
    // Área Central (os 50% do meio)
    let xStartCenter = freezerArea.x + freezerArea.w * 0.25;
    let xEndCenter = freezerArea.x + freezerArea.w * 0.75; 
    let yStartCenter = freezerArea.y + freezerArea.h * 0.25;
    let yEndCenter = freezerArea.y + freezerArea.h * 0.75; 
    
    // Área Ampla (toda a arca)
    let xStartWide = freezerArea.x;
    let xEndWide = freezerArea.x + freezerArea.w;
    let yStartWide = freezerArea.y;
    let yEndWide = freezerArea.y + freezerArea.h;
    
    // Total de Itens:
    const totalIce = 20;
    const totalChicken = 4;
    const totalVeg = 4;
    
    // -> Adicionar Gelo (30 total = 15 Central + 15 Amplo)
    for (let i = 0; i < floor(totalIce/2); i++) { 
        // 50% Central
        spawnItem('ice', imgGelo, 80, 80, xStartCenter, xEndCenter, yStartCenter, yEndCenter);
    }
    for (let i = 0; i < ceil(totalIce/2); i++) { 
        // 50% Amplo
        spawnItem('ice', imgGelo, 80, 80, xStartWide, xEndWide, yStartWide, yEndWide);
    }

    // -> Adicionar Frangos (4 total = 2 Central + 2 Amplo)
    for (let i = 0; i < floor(totalChicken/2); i++) { 
        spawnItem('chicken', imgFrango, 140, 160, xStartCenter, xEndCenter, yStartCenter, yEndCenter);
    }
    for (let i = 0; i < ceil(totalChicken/2); i++) { 
        spawnItem('chicken', imgFrango, 140, 160, xStartWide, xEndWide, yStartWide, yEndWide);
    }

    // -> Adicionar Vegetais/Peas (4 total = 2 Central + 2 Amplo)
    for (let i = 0; i < floor(totalVeg/2); i++) { 
        spawnItem('veg', imgVegetables, 150, 130, xStartCenter, xEndCenter, yStartCenter, yEndCenter);
    }
    for (let i = 0; i < ceil(totalVeg/2); i++) { 
        spawnItem('veg', imgVegetables, 150, 130, xStartWide, xEndWide, yStartWide, yEndWide);
    }

    heldItem = null;
    isFreezerGameInitialized = true;
    targetFound = false;

    // --- LÓGICA DO TIMER ADICIONADA ---
    timerStartTime = millis(); // Guarda o tempo em que o nível começa
    timeLeft = gameTimer; // Reinicia o contador
    // ----------------------------------

    // Se estiver na fase 0 (Intro), passamos para 1 (Jogo) 
    // (A menos que estejas a usar o sistema de Intro que fizemos antes, 
    // nesse caso remove esta linha)
    if (nivel2Phase === 0) nivel2Phase = 1; 
}

// Função auxiliar para criar itens em posições aleatórias DENTRO de uma área definida
function spawnItem(type, img, w, h, xMin, xMax, yMin, yMax) {
    let item = {
        id: type + '_' + floor(random(10000)), // ID único
        img: img,
        // Posição aleatória dentro do retângulo da arca
        x: random(xMin, xMax - w),
        y: random(yMin, yMax - h),
        w: w,
        h: h,
        isMovable: true,
        isBlocking: true // Todos bloqueiam a visão
    };
    freezerItems.push(item);
}

function checkLambRevealed() {
    // A área de revelação é agora o tamanho TOTAL do pernil
    const revealArea = {
        x: targetItem.x,
        y: targetItem.y,
        w: targetItem.w, 
        h: targetItem.h
    };

    for (let item of freezerItems) {
        // Verifica se algum item INTERSETA qualquer parte do pernil
        if (item.x < revealArea.x + revealArea.w && 
            item.x + item.w > revealArea.x &&
            item.y < revealArea.y + revealArea.h && 
            item.y + item.h > revealArea.y) {
            return false; // Ainda está tapado
        }
    }
    return true; // Livre
}

function drawNivel2() {
    
    // --- FASE 0: INTRO ---
    if (nivel2Phase === 0) {
        if (typeof drawVideoPlaceholder === 'function') drawVideoPlaceholder("LEVEL 2: THE FREEZER");
        else { setupNivel2(); nivel2Phase = 1; }
        return;
    }

    // --- FASE 1: JOGO ---
    if (nivel2Phase === 1) {
        if (!isFreezerGameInitialized) setupNivel2();

        // 1. Lógica do Timer
        let elapsed = (millis() - timerStartTime) / 1000; // Tempo decorrido em segundos
        timeLeft = max(0, gameTimer - elapsed); // Tempo restante

        if (timeLeft <= 0) {
            // Tempo esgotado! Game Over / Retry
            currentErrorMessage = "TIME IS UP! The freezer is getting warm!";
            nivel2Phase = 3; 
            return; // Interrompe o resto do desenho
        }
        // Fim da Lógica do Timer

        // 1. Fundo Geral
        if (backgroundMiniGame2) image(backgroundMiniGame2, 0, 0, width, height); 
        else background(200); 

        // 2. DESENHAR A CAIXA DA ARCA (O Retângulo)
        push();
        fill(20, 50, 100, 150); // Azul escuro semi-transparente
        stroke(200);
        strokeWeight(5);
        rectMode(CORNER); // Importante para usar as coordenadas corretas
        rect(freezerArea.x, freezerArea.y, freezerArea.w, freezerArea.h, 20);
        
        // Texto "FREEZER" no topo da caixa
        noStroke();
        fill(255);
        textAlign(CENTER);
        textSize(20);
        text("FREEZER COMPARTMENT", freezerArea.x + freezerArea.w/2, freezerArea.y - 15);
        pop();

        // 3. Alvo (Pernil) - Desenhado dentro da caixa, por baixo de tudo
        push();
        // A cor/opacidade do pernil reflete se está REVELADO
        if (targetItem.isRevealed) tint(255, 255); 
        else tint(255, 100); // Mais escuro quando escondido
        
        if(targetItem.img) image(targetItem.img, targetItem.x, targetItem.y, targetItem.w, targetItem.h);
        else { fill(255,0,0); rect(targetItem.x, targetItem.y, targetItem.w, targetItem.h); }
        pop();
        
        // 4. Itens (Gelo, Frango, etc) por cima
        for (let item of freezerItems) {
            if(item.img) image(item.img, item.x, item.y, item.w, item.h);
            else { fill(200); rect(item.x, item.y, item.w, item.h); }
        }

        // 5. Lógica de Revelação (Visual)
        targetItem.isRevealed = checkLambRevealed();

        // 6. UI
        let status = targetFound ? 1 : 0;
        let yFimCaixa = drawObjectiveBox("FIND AND CLICK THE REVEALED LAMB", status, 1);
        
        // Ajustei a lista para não ficar em cima da arca
        drawIngredientsList([
            "Move objetcts",
        ], yFimCaixa);

        // 7. DESENHAR O TIMER (Canto Inferior Esquerdo)
        push();
        textAlign(LEFT);
        textSize(32);
        
        // Alerta visual quando o tempo está a acabar
        if (timeLeft <= 10) {
            fill(255, 0, 0); // Vermelho
        } else {
            fill(255); // Branco
        }

        // Formato (Minutos:Segundos, mas como é curto, só Segundos)
        let seconds = ceil(timeLeft);
        let timeString = nf(seconds, 2, 0) + "s"; // Formato '00s'

        text("TIME: " + timeString, 20, height - 30); 
        pop();
    }

    // --- FASE 2: CONCLUSÃO ---
    if (nivel2Phase === 2) {
        if (typeof drawVideoPlaceholder === 'function') drawVideoPlaceholder("FOUND IT!");
        else { gameState = 3; nivel2Phase = 4; }
        return;
    }

    // --- FASE 3: RETRY ---
    if (nivel2Phase === 3) {
        drawRetryScreen(currentErrorMessage);
    }

    // --- FASE 4: NEXT LEVEL ---
    if (nivel2Phase === 4) {
        drawNextLevel(); 
    }
}

// =================================================================
// INPUTS NIVEL 2
// =================================================================

function checkNivel2Click() {
    // Phase 0: Intro
    if (nivel2Phase === 0) {
        if (typeof checkPlaceholderClick === 'function' && checkPlaceholderClick()) {
            setupNivel2(); nivel2Phase = 1; return true;
        }
        return false;
    }
    // Phase 2: Fim
    if (nivel2Phase === 2) {
        if (typeof checkPlaceholderClick === 'function' && checkPlaceholderClick()) {
            gameState = 3; nivel2Phase = 4; return true;
        }
        return false;
    }
    // Phase 4: Next Level Menu
    if (nivel2Phase === 4) {
        const iconY = height - 60;
        if (dist(mouseX, mouseY, 80, iconY) < 30) { gameState = 0; nivel2Phase = 0; return true; }
        if (dist(mouseX, mouseY, 160, iconY) < 30) { setupNivel2(); nivel2Phase = 1; return true; }
        const btnX = width / 2; const btnY = height / 2 + 50;
        if (mouseX > btnX - 100 && mouseX < btnX + 100 && mouseY > btnY - 30 && mouseY < btnY + 30) {
            gameState = 4; return true;
        }
        return false;
    }
    // Phase 3: Retry
    if (nivel2Phase === 3) {
        if (dist(mouseX, mouseY, width/2, height/2 + 100) < 100) { 
            setupNivel2(); nivel2Phase = 1; return true; 
        }
        return false;
    }

    // JOGO (FASE 1)
    if (nivel2Phase === 1) {
        
        // 1. TENTAR CLICAR NO ALVO PARA GANHAR (só funciona se estiver REVELADO)
        if (targetItem.isRevealed &&
            mouseX > targetItem.x && mouseX < targetItem.x + targetItem.w &&
            mouseY > targetItem.y && mouseY < targetItem.y + targetItem.h) {
            
            targetFound = true;
            nivel2Phase = 2; // Passa para a fase de conclusão
            return true;
        }

        // 2. Pegar Itens (Lógica existente)
        // Percorrer de trás para a frente para pegar o item que está "por cima" visualmente
        for (let i = freezerItems.length - 1; i >= 0; i--) {
            let item = freezerItems[i];
            if (mouseX > item.x && mouseX < item.x + item.w &&
                mouseY > item.y && mouseY < item.y + item.h) {
                
                // Remove da posição atual e põe no fim (topo da pilha)
                freezerItems.splice(i, 1);
                freezerItems.push(item);
                
                heldItem = item.id;
                return true;
            }
        }
        heldItem = null;
    }
}