// =================================================================
// NIVEL 4 - LOGIC (Matching Smile Minigame - Layout Carrossel)
// =================================================================

let isNivel4GameInitialized = false;
let nivel4TargetFound = false;

// Configurações do Minigame de Sorrisos
const NUM_SMILES = 15;
let targetSmileIndex = -1;
let currentDisplayIndex = 0; // Índice da imagem atualmente visível
let selectedSmileIndex = -1; 

// Dimensões dos botões
const ARROW_SIZE = 50;
const CHOOSE_BUTTON_W = 180;
const CHOOSE_BUTTON_H = 60;

function setupNivel4() {
    console.log("Setup Nivel 4 - Matching Smile Carrossel");
    isNivel4GameInitialized = true;
    nivel4TargetFound = false;
    selectedSmileIndex = -1;
    currentDisplayIndex = 0; // Começa sempre na primeira imagem

    // 1. Definir um alvo fixo (Sorriso 11 = índice 10)
    targetSmileIndex = 10; 
    console.log("Sorriso Alvo (ID):", targetSmileIndex);

    // Transição para Jogo
    if (nivel4Phase === 0) nivel4Phase = 1;
}

function drawNivel4() {

    // --- FASE 0: INTRO ---
    if (nivel4Phase === 0) {
        if (typeof drawVideoPlaceholder === 'function') drawVideoPlaceholder("LEVEL 4: THE SMILE CAROUSEL");
        else { setupNivel4(); nivel4Phase = 1; }
        return;
    }

    // --- FASE 1: JOGO (Carrossel de Sorrisos) ---
    if (nivel4Phase === 1) {
        if (!isNivel4GameInitialized) setupNivel4();

        // ----------------------------------------------------
        // 0. Desenhar o Fundo Dinâmico (Muda a cada navegação)
        // ----------------------------------------------------
        let currentBG = smileBackgrounds[currentDisplayIndex];

        if (currentBG) {
            image(currentBG, 0, 0, width, height); 
        } else if (backgroundMiniGame1) {
            // Fallback se o fundo específico não carregar
            image(backgroundMiniGame1, 0, 0, width, height); 
        } else { 
            background(200); 
        }
        
        // ----------------------------------------------------
        // 1. Desenhar a Imagem Central (O Sorriso)
        // ----------------------------------------------------
        
        let img = smileImages[currentDisplayIndex];
        const displayW = width * 0.5;
        const displayH = height * 0.6;
        const displayX = width / 2;
        const displayY = height / 2;

        push();
        rectMode(CENTER);
        imageMode(CENTER);
        
        // Fundo para a imagem (opcional)
        fill(255, 255, 255, 220);
        stroke(0);
        strokeWeight(4);
        rect(displayX, displayY, displayW + 20, displayH + 20, 10);
        
        if (img) {
            image(img, displayX, displayY, displayW, displayH);
        } else {
            // Placeholder/Fallback
            fill(0);
            textSize(30);
            textAlign(CENTER, CENTER);
            text(`SMILE ${currentDisplayIndex + 1} (Missing)`, displayX, displayY);
        }
        pop();
        
        // ----------------------------------------------------
        // 2. Desenhar Botões de Navegação (Setas)
        // ----------------------------------------------------
        
        const arrowY = displayY;
        const arrowXOffset = displayW / 2 + 50;
        
        // Seta Esquerda (Anterior)
        if (currentDisplayIndex > 0) {
            drawArrow(displayX - arrowXOffset, arrowY, ARROW_SIZE, -1);
        }

        // Seta Direita (Próximo)
        if (currentDisplayIndex < NUM_SMILES - 1) {
            drawArrow(displayX + arrowXOffset, arrowY, ARROW_SIZE, 1);
        }
        
        // ----------------------------------------------------
        // 3. Desenhar Botão "Escolher" (VERMELHO)
        // ----------------------------------------------------
        
        const btnX = displayX;
        const btnY = height - 100;
        
        push();
        rectMode(CENTER);
        
        // Cor VERMELHA
        fill(200, 0, 0); 
        
        rect(btnX, btnY, CHOOSE_BUTTON_W, CHOOSE_BUTTON_H, 10);
        
        fill(255);
        textSize(30);
        textAlign(CENTER, CENTER);
        text("ESCOLHER", btnX, btnY);
        pop();
        
        // ----------------------------------------------------
        // 4. Desenhar Objetivo e Status
        // ----------------------------------------------------

        drawObjectiveBox(`Escolha o Sorriso Certo (ID ${currentDisplayIndex + 1}/${NUM_SMILES})`, nivel4TargetFound ? 1 : 0, 1);
    }

    // --- FASE 2: CONCLUSÃO ---
    if (nivel4Phase === 2) {
        if (typeof drawVideoPlaceholder === 'function') drawVideoPlaceholder("NÍVEL 4 CONCLUÍDO!");
        else { nivel4Phase = 4; } 
        return;
    }

    // --- FASE 3: RETRY ---
    if (nivel4Phase === 3) {
        drawRetryScreen(currentErrorMessage);
    }

    // --- FASE 4: NEXT LEVEL ---
    if (nivel4Phase === 4) {
        drawNextLevel();
    }
}

// Função auxiliar para desenhar uma seta (triângulo)
function drawArrow(x, y, size, direction) {
    push();
    translate(x, y);
    fill(0);
    noStroke();
    
    // direction = -1 (esquerda), direction = 1 (direita)
    if (direction < 0) {
        // Seta para a esquerda
        triangle(
            size / 2, -size / 2, 
            size / 2, size / 2, 
            -size / 2, 0
        );
    } else {
        // Seta para a direita
        triangle(
            -size / 2, -size / 2, 
            -size / 2, size / 2, 
            size / 2, 0
        );
    }
    
    // Adiciona um círculo ao redor da seta para área de clique
    noFill();
    stroke(0);
    strokeWeight(2);
    circle(0, 0, size * 1.5);
    
    pop();
}

// =================================================================
// INPUTS NIVEL 4
// =================================================================

function checkNivel4Click() {
    // Fases de Transição (Lógica mantida dos ficheiros adicionais)
    if (nivel4Phase === 0 || nivel4Phase === 2) {
        if (typeof checkPlaceholderClick === 'function' && checkPlaceholderClick()) {
            if (nivel4Phase === 0) { setupNivel4(); nivel4Phase = 1; }
            else if (nivel4Phase === 2) { nivel4Phase = 4; } 
            return true;
        }
        return false;
    }
    if (nivel4Phase === 4) {
        const iconY = height - 60;
        // HOME
        if (dist(mouseX, mouseY, 80, iconY) < 30) { gameState = 0; nivel4Phase = 0; return true; }
        // RETRY
        if (dist(mouseX, mouseY, 160, iconY) < 30) { setupNivel4(); nivel4Phase = 1; return true; }
        // NEXT LEVEL (Botão Central)
        const btnX = width / 2; const btnY = height / 2 + 50;
        if (mouseX > btnX - 100 && mouseX < btnX + 100 && mouseY > btnY - 30 && mouseY < btnY + 30) {
            gameState = 6; return true;
        }
        return false;
    }
    if (nivel4Phase === 3) {
        // Lógica de Retry
        const scaleFactor = 2;
        const xButton = width / 2;
        const yButton = height / 2 + (100 * scaleFactor);
        const wButton = 150;
        const hButton = 50;
        
        if (mouseX > xButton - wButton/2 && mouseX < xButton + wButton/2 &&
            mouseY > yButton - hButton/2 && mouseY < yButton + hButton/2) {
            setupNivel4(); nivel4Phase = 1; return true; 
        }
        return false;
    }

    // JOGO (FASE 1) - LÓGICA DE CARROSSEL
    if (nivel4Phase === 1) {
        
        const displayW = width * 0.5;
        const displayY = height / 2;
        const displayX = width / 2;
        const arrowXOffset = displayW / 2 + 50;
        const arrowArea = ARROW_SIZE * 0.75; // Raio da área de clique 

        // 1. Clique na Seta Esquerda
        if (currentDisplayIndex > 0 && dist(mouseX, mouseY, displayX - arrowXOffset, displayY) < arrowArea) {
            currentDisplayIndex--;
            return true;
        }

        // 2. Clique na Seta Direita
        if (currentDisplayIndex < NUM_SMILES - 1 && dist(mouseX, mouseY, displayX + arrowXOffset, displayY) < arrowArea) {
            currentDisplayIndex++;
            return true;
        }
        
        // 3. Clique no Botão "Escolher"
        const btnX = displayX;
        const btnY = height - 100;

        if (mouseX > btnX - CHOOSE_BUTTON_W/2 && mouseX < btnX + CHOOSE_BUTTON_W/2 && 
            mouseY > btnY - CHOOSE_BUTTON_H/2 && mouseY < btnY + CHOOSE_BUTTON_H/2) {
            
            selectedSmileIndex = currentDisplayIndex;

            if (selectedSmileIndex === targetSmileIndex) {
                // ACERTOU!
                nivel4TargetFound = true;
                nivel4Phase = 2; // Passa para a fase de conclusão
                return true;
            } else {
                // ERROU!
                currentErrorMessage = `Wrong Smile! You selected SMILE ${selectedSmileIndex + 1}. The correct one was SMILE ${targetSmileIndex + 1}. Try again.`;
                nivel4Phase = 3; // Vai para a tela de Retry
                return true;
            }
        }
    }
    
    return false;
}