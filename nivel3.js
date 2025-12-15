// =================================================================
// NIVEL 3 - LOGIC (Placeholder)
// =================================================================

let isNivel3GameInitialized = false;
let nivel3TargetFound = false;

function setupNivel3() {
    console.log("Setup Nivel 3 - Placeholder");
    // Lógica de inicialização do minijogo do Nível 3 (Placeholder)
    isNivel3GameInitialized = true;
    nivel3TargetFound = false;

    // Se estiver na fase 0 (Intro), passamos para 1 (Jogo)
    if (nivel3Phase === 0) nivel3Phase = 1;
}

function drawNivel3() {

    // --- FASE 0: INTRO ---
    if (nivel3Phase === 0) {
        if (typeof drawVideoPlaceholder === 'function') drawVideoPlaceholder("LEVEL 3: THE FREEZER");
        else { setupNivel3(); nivel3Phase = 1; }
        return;
    }

    // --- FASE 1: JOGO ---
    if (nivel3Phase === 1) {
        if (!isNivel3GameInitialized) setupNivel3();

        // 1. Fundo Geral (Placeholder)
        if (backgroundMiniGame2) image(backgroundMiniGame2, 0, 0, width, height); 
        else background(200); 

        // 2. Placeholder Visual do Jogo
        push();
        fill(0, 0, 0, 180);
        rectMode(CENTER);
        rect(width / 2, height / 2, width * 0.7, height * 0.7);
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(40);
        text("MINIJOGO NÍVEL 3 (EM BREVE)", width / 2, height / 2);
        textSize(20);
        text("Clique para simular a conclusão.", width / 2, height / 2 + 50);
        pop();

        // 3. UI (Placeholder de Objetivo)
        drawObjectiveBox("PLACEHOLDER: CONCLUIR O NÍVEL 3", nivel3TargetFound ? 1 : 0, 1);
    }

    // --- FASE 2: CONCLUSÃO ---
    if (nivel3Phase === 2) {
        if (typeof drawVideoPlaceholder === 'function') drawVideoPlaceholder("NÍVEL 3 CONCLUÍDO!");
        else { gameState = 4; nivel3Phase = 4; }
        return;
    }

    // --- FASE 3: RETRY ---
    if (nivel3Phase === 3) {
        // Usa a variável global de erro do sketch.js
        drawRetryScreen(currentErrorMessage);
    }

    // --- FASE 4: NEXT LEVEL ---
    if (nivel3Phase === 4) {
        drawNextLevel();
    }
}

// =================================================================
// INPUTS NIVEL 3
// =================================================================

function checkNivel3Click() {
    // Fase 0 e 2: Intro/Conclusão (Usam o checkPlaceholderClick)
    if (nivel3Phase === 0 || nivel3Phase === 2) {
        if (typeof checkPlaceholderClick === 'function' && checkPlaceholderClick()) {
            if (nivel3Phase === 0) { setupNivel3(); nivel3Phase = 1; }
            else if (nivel3Phase === 2) { gameState = 5; nivel3Phase = 4; } // Próximo é o Nível 4 (gameState=5)
            return true;
        }
        return false;
    }

    // Fase 4: Next Level Menu
    if (nivel3Phase === 4) {
        const iconY = height - 60;
        // HOME
        if (dist(mouseX, mouseY, 80, iconY) < 30) { gameState = 0; nivel3Phase = 0; return true; }
        // RETRY
        if (dist(mouseX, mouseY, 160, iconY) < 30) { setupNivel3(); nivel3Phase = 1; return true; }
        // NEXT LEVEL (Botão Central)
        const btnX = width / 2; const btnY = height / 2 + 50;
        if (mouseX > btnX - 100 && mouseX < btnX + 100 && mouseY > btnY - 30 && mouseY < btnY + 30) {
            gameState = 5; // Vai para Nível 4
            return true;
        }
        return false;
    }

    // Phase 3: Retry
    if (nivel3Phase === 3) {
        if (dist(mouseX, mouseY, width/2, height/2 + 200) < 100) { // Ajuste para a nova posição do botão
            setupNivel3(); nivel3Phase = 1; return true; 
        }
        return false;
    }

    // JOGO (FASE 1)
    if (nivel3Phase === 1) {
        // Lógica de clique de jogo do Nível 3
        
        // Clica em qualquer lugar para concluir (Placeholder)
        if (mouseIsPressed) {
            nivel3TargetFound = true;
            nivel3Phase = 2; // Passa para a fase de conclusão
            return true;
        }
    }
}