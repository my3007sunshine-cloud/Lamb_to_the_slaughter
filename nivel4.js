// =================================================================
// NIVEL 4 - LOGIC (Matching Smile Minigame)
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

    targetSmileIndex = 10; 
    console.log("Sorriso Alvo (ID):", targetSmileIndex);

    if (nivel4Phase === 0) nivel4Phase = 1;
}

function drawNivel4() {

    // --- FASE 0: INTRO ---
    if (nivel4Phase === 0) {
        if (typeof drawVideoPlaceholder === 'function') drawVideoPlaceholder("LEVEL 4: THE SMILE CAROUSEL");
        else { setupNivel4(); nivel4Phase = 1; }
        return;
    }

    // --- FASE 1: JOGO ---
    if (nivel4Phase === 1) {
        if (!isNivel4GameInitialized) setupNivel4();

        let currentBG = smileBackgrounds[currentDisplayIndex];
        if (currentBG) {
            image(currentBG, 0, 0, width, height); 
        } else if (backgroundMiniGame1) {
            image(backgroundMiniGame1, 0, 0, width, height); 
        } else { 
            background(200); 
        }
        
        const displayW = width * 0.6;
        const displayH = height * 0.7;
        const displayX = width / 2;
        const displayY = height / 2;

        push();
        rectMode(CENTER);
        imageMode(CENTER);
        
        fill(255, 255, 255, 220);
        stroke(0);
        strokeWeight(4);
        rect(displayX, displayY, displayW + 60, displayH + 60, 15);
        
        let img = smileImages[currentDisplayIndex];
        if (img) {
            image(img, displayX, displayY, displayW, displayH);
        } else {
            fill(0);
            textSize(30);
            textAlign(CENTER, CENTER);
            text(`SMILE ${currentDisplayIndex + 1} (Missing)`, displayX, displayY);
        }
        pop();
        
        const arrowY = displayY;
        const arrowXOffset = (displayW / 2) + 80;
        
        if (currentDisplayIndex > 0) {
            drawArrow(displayX - arrowXOffset, arrowY, ARROW_SIZE, -1);
        }
        if (currentDisplayIndex < NUM_SMILES - 1) {
            drawArrow(displayX + arrowXOffset, arrowY, ARROW_SIZE, 1);
        }
        
        const btnX = displayX;
        const btnY = height - 80;
        
        push();
        rectMode(CENTER);
        fill(200, 0, 0); 
        rect(btnX, btnY, CHOOSE_BUTTON_W, CHOOSE_BUTTON_H, 10);
        fill(255);
        textSize(30);
        textAlign(CENTER, CENTER);
        text("ESCOLHER", btnX, btnY);
        pop();
        
        drawObjectiveBox(`Escolha o Sorriso Certo (ID ${currentDisplayIndex + 1}/${NUM_SMILES})`, nivel4TargetFound ? 1 : 0, 1);
    }

    // --- CONCLUSÃO E RETRY ---
    if (nivel4Phase === 2) {
        if (typeof drawVideoPlaceholder === 'function') drawVideoPlaceholder("NÍVEL 4 CONCLUÍDO!");
        else { nivel4Phase = 4; } 
        return;
    }
    if (nivel4Phase === 3) drawRetryScreen(currentErrorMessage);
    if (nivel4Phase === 4) drawNextLevel();
}

function drawArrow(x, y, size, direction) {
    push();
    translate(x, y);
    fill(0);
    noStroke();
    if (direction < 0) {
        triangle(size / 2, -size / 2, size / 2, size / 2, -size / 2, 0);
    } else {
        triangle(-size / 2, -size / 2, -size / 2, size / 2, size / 2, 0);
    }
    noFill();
    stroke(0);
    strokeWeight(2);
    circle(0, 0, size * 1.5);
    pop();
}

function checkNivel4Click() {
    if (nivel4Phase === 0 || nivel4Phase === 2) {
        if (typeof checkPlaceholderClick === 'function' && checkPlaceholderClick()) {
            if (nivel4Phase === 0) { setupNivel4(); nivel4Phase = 1; }
            else if (nivel4Phase === 2) { nivel4Phase = 4; } 
            return true;
        }
        return false;
    }
    
    // --- FASE 4: NEXT LEVEL ---
    if (nivel4Phase === 4) {
        const iconY = height - 60;
        const homeX = width / 2 - 100;
        const retryX = width / 2 + 100;

        // MENU
        if (dist(mouseX, mouseY, homeX, iconY) < 40) { 
            gameState = 1; 
            nivel4Phase = 0; 
            return true; 
        }
        // REPLAY
        if (dist(mouseX, mouseY, retryX, iconY) < 40) { 
            setupNivel4(); 
            nivel4Phase = 1; 
            return true; 
        }
        // NEXT LEVEL (Nível 5)
        const btnX = width / 2; 
        const btnY = height / 2 + 50;
        if (dist(mouseX, mouseY, btnX, btnY) < 50) {
            gameState = 6; 
            return true;
        }
        return false;
    }

    if (nivel4Phase === 3) {
        const xButton = width / 2;
        const yButton = height / 2 + 200;
        if (mouseX > xButton - 75 && mouseX < xButton + 75 && mouseY > yButton - 25 && mouseY < yButton + 25) {
            setupNivel4(); nivel4Phase = 1; return true; 
        }
        return false;
    }

    if (nivel4Phase === 1) {
        const displayW = width * 0.6;
        const displayY = height / 2;
        const displayX = width / 2;
        const arrowXOffset = (displayW / 2) + 80;
        const arrowArea = ARROW_SIZE * 0.75;

        if (currentDisplayIndex > 0 && dist(mouseX, mouseY, displayX - arrowXOffset, displayY) < arrowArea) {
            currentDisplayIndex--;
            return true;
        }
        if (currentDisplayIndex < NUM_SMILES - 1 && dist(mouseX, mouseY, displayX + arrowXOffset, displayY) < arrowArea) {
            currentDisplayIndex++;
            return true;
        }
        
        const btnX = displayX;
        const btnY = height - 80;
        if (mouseX > btnX - CHOOSE_BUTTON_W/2 && mouseX < btnX + CHOOSE_BUTTON_W/2 && 
            mouseY > btnY - CHOOSE_BUTTON_H/2 && mouseY < btnY + CHOOSE_BUTTON_H/2) {
            
            selectedSmileIndex = currentDisplayIndex;
            if (selectedSmileIndex === targetSmileIndex) {
                nivel4TargetFound = true;
                nivel4Phase = 2;
            } else {
                currentErrorMessage = `Wrong Smile! You selected SMILE ${selectedSmileIndex + 1}. Try again.`;
                nivel4Phase = 3;
            }
            return true;
        }
    }
    return false;
}