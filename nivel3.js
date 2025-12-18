// =================================================================
// NIVEL 3 - THE OVEN (A Cozinha)
// =================================================================

// Estados internos do Nível 3
let l3_step = 0; // 0: Arrastar Carne para Taça | 1: Arrastar Taça para Forno
let l3_pernil = { x: 0, y: 0, w: 120, h: 200, visible: true };

// Adicionei originalX/Y para a taça voltar ao lugar se o jogador soltar no sítio errado
let l3_taca = { x: 0, y: 0, originalX: 0, originalY: 0, w: 250, h: 200 }; 

let ovenHitbox = { x: 0, y: 0, w: 320, h: 350 };

function setupNivel3() {
    console.log("Iniciando Nivel 3 - Drag Pot Logic");
    l3_step = 0; 
    
    // --- POSICIONAMENTO ---
    
    // 1. Pernil (Inventário à esquerda)
    l3_pernil.x = width * 0.15;
    l3_pernil.y = height - 150;
    l3_pernil.visible = true;

    // 2. Taça (No balcão - Esquerda)
    l3_taca.x = width * 0.30; 
    l3_taca.y = height * 0.65;
    // Guardamos a posição original para o "snap back"
    l3_taca.originalX = l3_taca.x;
    l3_taca.originalY = l3_taca.y;

    // 3. Forno (À direita)
    ovenHitbox.x = width * 0.78; 
    ovenHitbox.y = height * 0.55;
    
    if (nivel3Phase === 0) nivel3Phase = 1; 
}

function drawNivel3() {

    // --- FASE 0: INTRODUÇÃO ---
    if (nivel3Phase === 0) {
        drawVideoPlaceholder("LEVEL 3: DINNER TIME");
        return;
    }

    // --- FASE 1: GAMEPLAY ---
    if (nivel3Phase === 1) {
        
        // 1. Fundo
        if (backgroundMiniGame3) {
            image(backgroundMiniGame3, 0, 0, width, height);
        } else {
            background(20); 
        }

        // 2. Objetos Interativos
        imageMode(CENTER);

        // -- PASSO 0: Preparação (Carne -> Taça) --
        if (l3_step === 0) {
            // Desenha a taça parada no lugar original
            if (imgTacaAberta) image(imgTacaAberta, l3_taca.x, l3_taca.y, l3_taca.w, l3_taca.h);
            
            // Desenha o pernil
            if (l3_pernil.visible && imgPernil) {
                image(imgPernil, l3_pernil.x, l3_pernil.y, l3_pernil.w, l3_pernil.h);
            }
            
            drawObjectiveBox("PLACE MEAT IN POT", 0, 2);
        } 
        
        // -- PASSO 1: Cozinhar (Taça -> Forno) --
        else if (l3_step === 1) {
            // Desenha a taça FECHADA (que agora pode se mover)
            if (imgTacaFechada) image(imgTacaFechada, l3_taca.x, l3_taca.y, l3_taca.w, l3_taca.h);
            
            drawObjectiveBox("DRAG POT TO OVEN", 1, 2);
            
            // (Opcional) Destaque visual no forno para indicar o alvo
            /*
            noFill(); stroke(255, 0, 0, 100); strokeWeight(2);
            rect(ovenHitbox.x, ovenHitbox.y, ovenHitbox.w, ovenHitbox.h);
            */
        }
        imageMode(CORNER);
    }

    // --- FASE 2: CONCLUSÃO (Vídeo) ---
    if (nivel3Phase === 2) {
        drawVideoPlaceholder("COOKING COMPLETE...");
        return;
    }

    // --- FASE 3: DERROTA ---
    if (nivel3Phase === 3) {
        drawRetryScreen(currentErrorMessage);
        return;
    }

    // --- FASE 4: PRÓXIMO NÍVEL ---
    if (nivel3Phase === 4) {
        drawNextLevel();
    }
}

// =================================================================
// CONTROLES E LÓGICA
// =================================================================

function checkNivel3Click() {
    
    // Telas de Intro/Outro/Retry
    if (nivel3Phase === 0) { setupNivel3(); nivel3Phase = 1; return; }
    if (nivel3Phase === 2) { gameState = 5; nivel3Phase = 4; return; } 

    // Botão Retry (Game Over)
    if (nivel3Phase === 3) {
        const btnX = width / 2;
        const btnY = height / 2 + 120; // Coordenada do botão no addicionalScreen.js
        if (mouseX > btnX - 120 && mouseX < btnX + 120 &&
            mouseY > btnY - 25 && mouseY < btnY + 25) {
            setupNivel3(); 
            nivel3Phase = 1; 
        }
        return;
    }

    // Tela Next Level
    if (nivel3Phase === 4) {
        if (dist(mouseX, mouseY, width/2, height/2 + 50) < 50) { gameState = 5; return; } // Next
        if (dist(mouseX, mouseY, width/2 - 100, height - 60) < 30) { gameState = 1; nivel3Phase = 0; return; } // Menu
        if (dist(mouseX, mouseY, width/2 + 100, height - 60) < 30) { setupNivel3(); nivel3Phase = 1; return; } // Redo
        return;
    }

    // --- GAMEPLAY (FASE 1) ---
    if (nivel3Phase === 1) {
        
        // PASSO 0: Arrastar Carne
        if (l3_step === 0) {
            // Se clicar no pernil -> Arrasta
            if (dist(mouseX, mouseY, l3_pernil.x, l3_pernil.y) < l3_pernil.w) {
                nivel3DragItem = l3_pernil; 
            }
        }
        
        // PASSO 1: Arrastar Taça
        else if (l3_step === 1) {
            // Se clicar na taça -> Arrasta
            if (dist(mouseX, mouseY, l3_taca.x, l3_taca.y) < l3_taca.w/2) {
                nivel3DragItem = l3_taca;
            }
        }
    }
}

// Chamado automaticamente quando solta o mouse (pelo sketch.js)
function handleNivel3Drop() {
    
    // --- SOLTAR A CARNE (Passo 0) ---
    if (nivel3DragItem === l3_pernil) {
        
        // Se soltar na TAÇA (Sucesso)
        if (dist(l3_pernil.x, l3_pernil.y, l3_taca.x, l3_taca.y) < 100) { 
            l3_step = 1; // Avança para a fase da taça
            l3_pernil.visible = false; 
            nivel3DragItem = null;
        } 
        // Se soltar no FORNO (Derrota - Carne Crua)
        else if (isMouseOverOven(l3_pernil.x, l3_pernil.y)) {
            triggerNivel3Fail("RAW MEAT IS SUSPICIOUS.");
            nivel3DragItem = null;
        }
        // Se soltar no nada (Volta pro lugar)
        else {
            l3_pernil.x = width * 0.15;
            l3_pernil.y = height - 150;
            nivel3DragItem = null;
        }
    }

    // --- SOLTAR A TAÇA (Passo 1) ---
    else if (nivel3DragItem === l3_taca) {
        
        // Se soltar no FORNO (Vitória)
        if (isMouseOverOven(l3_taca.x, l3_taca.y)) {
            nivel3Phase = 2; // Toca vídeo final
            nivel3DragItem = null;
        } 
        // Se soltar fora (Volta para o balcão)
        else {
            l3_taca.x = l3_taca.originalX;
            l3_taca.y = l3_taca.originalY;
            nivel3DragItem = null;
        }
    }
}

// Verifica se as coordenadas (x,y) estão dentro do forno
// Se não passar argumentos, usa o mouseX/Y
function isMouseOverOven(targetX, targetY) {
    let checkX = targetX || mouseX;
    let checkY = targetY || mouseY;

    return (checkX > ovenHitbox.x - ovenHitbox.w/2 && 
            checkX < ovenHitbox.x + ovenHitbox.w/2 &&
            checkY > ovenHitbox.y - ovenHitbox.h/2 && 
            checkY < ovenHitbox.y + ovenHitbox.h/2);
}

function triggerNivel3Fail(msg) {
    currentErrorMessage = msg;
    nivel3Phase = 3; 
}