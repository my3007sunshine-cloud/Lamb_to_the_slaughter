// =================================================================
// NIVEL 4 - LOGIC (Matching Smile Minigame) - CORRIGIDO FINAL
// =================================================================

let isNivel4GameInitialized = false;
let nivel4TargetFound = false;

const NUM_SMILES = 15;
let targetSmileIndex = -1;
let currentDisplayIndex = 0; 
let selectedSmileIndex = -1; 

const ARROW_SIZE = 50;
const CHOOSE_BUTTON_W = 180;
const CHOOSE_BUTTON_H = 60;

function setupNivel4() {
    console.log("Setup Nivel 4 - Matching Smile Carrossel");
    isNivel4GameInitialized = true;
    nivel4TargetFound = false;
    selectedSmileIndex = -1;
    currentDisplayIndex = 0; 

    // O sorriso correto é o ID 11 (índice 10)
    targetSmileIndex = 10; 

    // Se vier do menu, mostra intro. Se for retry, vai direto ao jogo.
    if (nivel4Phase !== 0) {
        nivel4Phase = 1;
    }
}

function drawNivel4() {

    // --- PHASE 0: INTRO ESTÁTICA ---
    if (nivel4Phase === 0) {
        background(0);
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(50); text("LEVEL 4", width/2, height/2 - 60);
        textSize(30); fill(200); text("THE SMILE CAROUSEL", width/2, height/2);
        textSize(20); fill(150);
        if (frameCount % 60 < 30) text("- Click to Start -", width/2, height/2 + 80);
        return;
    }

    // --- PHASE 2: CONCLUSÃO (VÍDEO) - PRIORITÁRIO ---
    // Coloquei isto ANTES da Phase 1 para garantir que o jogo não desenha por cima
    if (nivel4Phase === 2) {
       // Se o vídeo não estiver a tocar, manda tocar
       if (!isVideoPlaying) {
           console.log("Tentando iniciar vídeo do Nível 4...");
           // ATENÇÃO AO CAMINHO: Certifica-te que o ficheiro está na pasta 'imagens'
           startLevelVideo('imagens/Level4.mp4', 5); 
           
           if (nivelVideo) {
               nivelVideo.onended(() => {
                   console.log("Vídeo terminou.");
                   stopAndCleanVideo();
                   nivel4Phase = 4; // Vai para o ecrã final
               });
           }
       }
       // IMPORTANTE: Return para que nada mais seja desenhado (o sketch.js trata do vídeo)
       return; 
    }

    // --- PHASE 1: GAMEPLAY ---
    if (nivel4Phase === 1) {
        if (!isNivel4GameInitialized) setupNivel4();

        // Desenha Fundo
        let currentBG = smileBackgrounds[currentDisplayIndex];
        if (currentBG) image(currentBG, 0, 0, width, height); 
        else if (backgroundMiniGame1) image(backgroundMiniGame1, 0, 0, width, height); 
        else background(200); 
        
        const displayW = width * 0.6;
        const displayH = height * 0.7;
        const displayX = width / 2;
        const displayY = height / 2;

        // Caixa Branca
        push();
        rectMode(CENTER); imageMode(CENTER);
        fill(255, 255, 255, 220); stroke(0); strokeWeight(4);
        rect(displayX, displayY, displayW + 60, displayH + 60, 15);
        
        // Imagem do Sorriso
        let img = smileImages[currentDisplayIndex];
        if (img) image(img, displayX, displayY, displayW, displayH);
        else {
            fill(0); textSize(30); textAlign(CENTER, CENTER);
            text(`SMILE ${currentDisplayIndex + 1} (Missing)`, displayX, displayY);
        }
        pop();
        
        // Setas
        const arrowY = displayY;
        const arrowXOffset = (displayW / 2) + 80;
        if (currentDisplayIndex > 0) drawArrow(displayX - arrowXOffset, arrowY, ARROW_SIZE, -1);
        if (currentDisplayIndex < NUM_SMILES - 1) drawArrow(displayX + arrowXOffset, arrowY, ARROW_SIZE, 1);
        
        // Botão Select
        const btnX = displayX;
        const btnY = height - 80;
        push();
        rectMode(CENTER); fill(200, 0, 0); 
        rect(btnX, btnY, CHOOSE_BUTTON_W, CHOOSE_BUTTON_H, 10);
        fill(255); textSize(30); textAlign(CENTER, CENTER);
        text("SELECT", btnX, btnY);
        pop();
        
        drawObjectiveBox(`Select the Correct Smile (ID ${currentDisplayIndex + 1}/${NUM_SMILES})`, 0, 1);
    }

    // --- PHASE 3: FAIL ---
    if (nivel4Phase === 3) drawRetryScreen(currentErrorMessage);
    
    // --- PHASE 4: END SCREEN ---
    if (nivel4Phase === 4) {
        drawNextLevel("The Performance", "READY TO LIE.", "FACE POLICE");
    }
}

function drawArrow(x, y, size, direction) {
    push();
    translate(x, y);
    fill(0); noStroke();
    if (direction < 0) triangle(size / 2, -size / 2, size / 2, size / 2, -size / 2, 0);
    else triangle(-size / 2, -size / 2, -size / 2, size / 2, size / 2, 0);
    noFill(); stroke(0); strokeWeight(2);
    circle(0, 0, size * 1.5);
    pop();
}

function checkNivel4Click() {
    
    // Intro -> Start
    if (nivel4Phase === 0) { setupNivel4(); nivel4Phase = 1; return true; }

    // End Screen -> Navigation
    if (nivel4Phase === 4) {
        const iconY = height - 60;
        if (dist(mouseX, mouseY, width/2 - 100, iconY) < 40) { gameState = 1; nivel4Phase = 0; return true; } // Menu
        if (dist(mouseX, mouseY, width/2 + 100, iconY) < 40) { setupNivel4(); nivel4Phase = 1; return true; } // Retry
        if (dist(mouseX, mouseY, width/2, height/2 + 50) < 50) { gameState = 6; return true; } // Next Level
        return false;
    }

    // Se estiver no vídeo (Phase 2), o clique é ignorado aqui (o sketch.js trata do skip)
    if (nivel4Phase === 2) return true;

    // Retry Screen
    if (nivel4Phase === 3) {
        if (dist(mouseX, mouseY, width/2, height/2 + 200) < 100) { setupNivel4(); nivel4Phase = 1; return true; }
        return false;
    }

    // Gameplay Clicks
    if (nivel4Phase === 1) {
        const displayW = width * 0.6;
        const displayY = height / 2;
        const displayX = width / 2;
        const arrowXOffset = (displayW / 2) + 80;

        // Setas Esquerda/Direita
        if (currentDisplayIndex > 0 && dist(mouseX, mouseY, displayX - arrowXOffset, displayY) < ARROW_SIZE) {
            currentDisplayIndex--; return true;
        }
        if (currentDisplayIndex < NUM_SMILES - 1 && dist(mouseX, mouseY, displayX + arrowXOffset, displayY) < ARROW_SIZE) {
            currentDisplayIndex++; return true;
        }
        
        // Botão Select
        const btnX = displayX;
        const btnY = height - 80;
        if (mouseX > btnX - CHOOSE_BUTTON_W/2 && mouseX < btnX + CHOOSE_BUTTON_W/2 && 
            mouseY > btnY - CHOOSE_BUTTON_H/2 && mouseY < btnY + CHOOSE_BUTTON_H/2) {
            
            selectedSmileIndex = currentDisplayIndex;
            
            if (selectedSmileIndex === targetSmileIndex) {
                // VITÓRIA: Apenas muda a fase. O drawNivel4 trata do vídeo.
                nivel4TargetFound = true;
                nivel4Phase = 2; 
            } else {
                currentErrorMessage = `Wrong Smile! You selected SMILE ${selectedSmileIndex + 1}.`;
                nivel4Phase = 3;
            }
            return true;
        }
    }
    return false;
}