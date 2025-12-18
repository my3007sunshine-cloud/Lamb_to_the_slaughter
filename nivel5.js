// =================================================================
// NIVEL 5 - LOGIC (Placeholder)
// =================================================================

let isNivel5GameInitialized = false;
let nivel5TargetFound = false;

function setupNivel5() {
    console.log("Setup Nivel 5 - Placeholder");
    isNivel5GameInitialized = true;
    nivel5TargetFound = false;

    if (nivel5Phase === 0) nivel5Phase = 1;
}

function drawNivel5() {
    // --- FASE 0: INTRO ---
    if (nivel5Phase === 0) {
        if (typeof drawVideoPlaceholder === 'function') drawVideoPlaceholder("LEVEL 5: THE EVIDENCE");
        else { setupNivel5(); nivel5Phase = 1; }
        return;
    }

    // --- FASE 1: JOGO ---
    if (nivel5Phase === 1) {
        if (!isNivel5GameInitialized) setupNivel5();

        if (backgroundMiniGame2) image(backgroundMiniGame2, 0, 0, width, height); 
        else background(200); 

        push();
        fill(0, 0, 0, 180);
        rectMode(CENTER);
        rect(width / 2, height / 2, width * 0.7, height * 0.7);
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(40);
        text("MINIJOGO NÍVEL 5 (EM BREVE)", width / 2, height / 2);
        textSize(20);
        text("Clique para simular a conclusão.", width / 2, height / 2 + 50);
        pop();

        drawObjectiveBox("PLACEHOLDER: CONCLUIR O NÍVEL 5", nivel5TargetFound ? 1 : 0, 1);
    }

    // --- FASE 2: CONCLUSÃO ---
    if (nivel5Phase === 2) {
        if (typeof drawVideoPlaceholder === 'function') drawVideoPlaceholder("NÍVEL 5 CONCLUÍDO! FIM DO JOGO.");
        else { gameState = 5; nivel5Phase = 4; }
        return;
    }

    // --- FASE 3: RETRY ---
    if (nivel5Phase === 3) {
        drawRetryScreen(currentErrorMessage);
    }

    // --- FASE 4: NEXT LEVEL ---
    if (nivel5Phase === 4) {
        drawNextLevel();
    }
}

function checkNivel5Click() {
    if (nivel5Phase === 0 || nivel5Phase === 2) {
        if (typeof checkPlaceholderClick === 'function' && checkPlaceholderClick()) {
            if (nivel5Phase === 0) { setupNivel5(); nivel5Phase = 1; }
            else if (nivel5Phase === 2) { 
                gameState = 0; // Fim do Jogo
                nivel5Phase = 0;
            }
            return true;
        }
        return false;
    }

    // --- FASE 4: NEXT LEVEL ---
    if (nivel5Phase === 4) {
        const iconY = height - 60;
        const homeX = width / 2 - 100;
        const retryX = width / 2 + 100;
        
        // MENU
        if (dist(mouseX, mouseY, homeX, iconY) < 40) { 
            gameState = 1; 
            nivel5Phase = 0; 
            return true; 
        }
        
        // REPLAY
        if (dist(mouseX, mouseY, retryX, iconY) < 40) { 
            setupNivel5(); 
            nivel5Phase = 1; 
            return true; 
        }
        
        // FIM (Botão Central) -> Menu Principal
        const btnX = width / 2; 
        const btnY = height / 2 + 50;
        if (dist(mouseX, mouseY, btnX, btnY) < 50) {
            gameState = 0; 
            return true;
        }
        return false;
    }

    if (nivel5Phase === 3) {
        if (dist(mouseX, mouseY, width/2, height/2 + 200) < 100) {
            setupNivel5(); nivel5Phase = 1; return true; 
        }
        return false;
    }

    if (nivel5Phase === 1) {
        if (mouseIsPressed) {
            nivel5TargetFound = true;
            nivel5Phase = 2; 
            return true;
        }
    }
}