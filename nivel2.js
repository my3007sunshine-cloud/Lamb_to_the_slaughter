// =================================================================
// NIVEL 2 - LOGIC (ARCA CONGELADORA)
// =================================================================

let isFreezerGameInitialized = false;
let freezerItems = []; 
let targetItem = {};   
let targetFound = false;

// Variáveis para o Timer
let gameTimer = 20; 
let timerStartTime; 
let timeLeft; 
let freezerArea = { x: 0, y: 0, w: 0, h: 0 };

function setupNivel2() {
    freezerArea.w = width * 0.6;  
    freezerArea.h = height * 0.55; 
    freezerArea.x = (width - freezerArea.w) * 0.4; 
    freezerArea.y = (height - freezerArea.h) * 0.4; 
    
    let targetW = 150;
    let targetH = 250;
    let xCenterTarget = freezerArea.x + freezerArea.w / 2 - targetW / 2;
    let yCenterTarget = freezerArea.y + freezerArea.h / 2 - targetH / 2;
    
    targetItem = {
        id: 'lamb',
        img: imgPernil, 
        x: random(xCenterTarget - 50, xCenterTarget + 50),
        y: random(yCenterTarget - 50, yCenterTarget + 50),
        w: targetW, h: targetH,
        isRevealed: false
    };

    freezerItems = []; 

    let xStartCenter = freezerArea.x + freezerArea.w * 0.25;
    let xEndCenter = freezerArea.x + freezerArea.w * 0.75; 
    let yStartCenter = freezerArea.y + freezerArea.h * 0.25;
    let yEndCenter = freezerArea.y + freezerArea.h * 0.75; 
    
    let xStartWide = freezerArea.x;
    let xEndWide = freezerArea.x + freezerArea.w;
    let yStartWide = freezerArea.y;
    let yEndWide = freezerArea.y + freezerArea.h;
    
    const totalIce = 20;
    const totalChicken = 4;
    const totalVeg = 4;
    
    for (let i = 0; i < floor(totalIce/2); i++) spawnItem('ice', imgGelo, 80, 80, xStartCenter, xEndCenter, yStartCenter, yEndCenter);
    for (let i = 0; i < ceil(totalIce/2); i++) spawnItem('ice', imgGelo, 80, 80, xStartWide, xEndWide, yStartWide, yEndWide);

    for (let i = 0; i < floor(totalChicken/2); i++) spawnItem('chicken', imgFrango, 140, 160, xStartCenter, xEndCenter, yStartCenter, yEndCenter);
    for (let i = 0; i < ceil(totalChicken/2); i++) spawnItem('chicken', imgFrango, 140, 160, xStartWide, xEndWide, yStartWide, yEndWide);

    for (let i = 0; i < floor(totalVeg/2); i++) spawnItem('veg', imgVegetables, 150, 130, xStartCenter, xEndCenter, yStartCenter, yEndCenter);
    for (let i = 0; i < ceil(totalVeg/2); i++) spawnItem('veg', imgVegetables, 150, 130, xStartWide, xEndWide, yStartWide, yEndWide);

    heldItem = null;
    isFreezerGameInitialized = true;
    targetFound = false;

    timerStartTime = millis(); 
    timeLeft = gameTimer; 

    if (nivel2Phase === 0) nivel2Phase = 1; 
}

function spawnItem(type, img, w, h, xMin, xMax, yMin, yMax) {
    let item = {
        id: type + '_' + floor(random(10000)), 
        img: img,
        x: random(xMin, xMax - w),
        y: random(yMin, yMax - h),
        w: w,
        h: h,
        isMovable: true,
        isBlocking: true 
    };
    freezerItems.push(item);
}

function checkLambRevealed() {
    const revealArea = { x: targetItem.x, y: targetItem.y, w: targetItem.w, h: targetItem.h };
    for (let item of freezerItems) {
        if (item.x < revealArea.x + revealArea.w && 
            item.x + item.w > revealArea.x &&
            item.y < revealArea.y + revealArea.h && 
            item.y + item.h > revealArea.y) {
            return false; 
        }
    }
    return true; 
}

function drawNivel2() {
    // --- FASE 0: INTRO ---
    if (nivel2Phase === 0) { 
        if (!isVideoPlaying) {
            startLevelVideo('imagens/Nivel2_parte1.mp4', 2);
            if (nivelVideo) {
                nivelVideo.onended(() => {
                    stopAndCleanVideo();
                    setupNivel2();   // CORREÇÃO: Chama o setup do Nivel 2
                    nivel2Phase = 1; // CORREÇÃO: Atualiza a fase do Nivel 2
                });
            }
        }
        return;
    }

    // --- FASE 1: JOGO ---
    if (nivel2Phase === 1) {
        if (!isFreezerGameInitialized) setupNivel2();

        let elapsed = (millis() - timerStartTime) / 1000; 
        timeLeft = max(0, gameTimer - elapsed); 

        if (timeLeft <= 0) {
            currentErrorMessage = "TIME IS UP! The freezer is getting warm!";
            nivel2Phase = 3; 
            return; 
        }

        if (backgroundMiniGame2) image(backgroundMiniGame2, 0, 0, width, height); 
        else background(200); 

        push();
        fill(20, 50, 100, 150); 
        stroke(200);
        strokeWeight(5);
        rectMode(CORNER); 
        rect(freezerArea.x, freezerArea.y, freezerArea.w, freezerArea.h, 20);
        noStroke();
        fill(255);
        textAlign(CENTER);
        textSize(20);
        text("FREEZER COMPARTMENT", freezerArea.x + freezerArea.w/2, freezerArea.y - 15);
        pop();

        push();
        if (targetItem.isRevealed) tint(255, 255); 
        else tint(255, 100); 
        if(targetItem.img) image(targetItem.img, targetItem.x, targetItem.y, targetItem.w, targetItem.h);
        else { fill(255,0,0); rect(targetItem.x, targetItem.y, targetItem.w, targetItem.h); }
        pop();
        
        for (let item of freezerItems) {
            if(item.img) image(item.img, item.x, item.y, item.w, item.h);
            else { fill(200); rect(item.x, item.y, item.w, item.h); }
        }

        targetItem.isRevealed = checkLambRevealed();

        let status = targetFound ? 1 : 0;
        let yFimCaixa = drawObjectiveBox("FIND AND CLICK THE REVEALED LAMB", status, 1);
        
        drawIngredientsList(["Move objetcts"], yFimCaixa);

        push();
        textAlign(LEFT);
        textSize(32);
        if (timeLeft <= 10) fill(255, 0, 0); 
        else fill(255); 
        let seconds = ceil(timeLeft);
        let timeString = nf(seconds, 2, 0) + "s"; 
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
    
    // --- FASE 4: NEXT LEVEL ---
    if (nivel2Phase === 4) {
        const iconY = height - 60;
        const homeX = width / 2 - 100;
        const retryX = width / 2 + 100;

        // Menu (Case Files)
        if (dist(mouseX, mouseY, homeX, iconY) < 40) { 
            gameState = 1; 
            nivel2Phase = 0; 
            return true; 
        }
        
        // Replay (Nível 2)
        if (dist(mouseX, mouseY, retryX, iconY) < 40) { 
            setupNivel2(); 
            nivel2Phase = 1; 
            return true; 
        }
        
        // Next Level (Nível 3)
        const btnX = width / 2; 
        const btnY = height / 2 + 50;
        if (dist(mouseX, mouseY, btnX, btnY) < 50) {
            gameState = 4; 
            return true;
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
        // Tentar clicar no alvo
        if (targetItem.isRevealed &&
            mouseX > targetItem.x && mouseX < targetItem.x + targetItem.w &&
            mouseY > targetItem.y && mouseY < targetItem.y + targetItem.h) {
            
            targetFound = true;
            nivel2Phase = 2; 
            return true;
        }

        // Pegar Itens
        for (let i = freezerItems.length - 1; i >= 0; i--) {
            let item = freezerItems[i];
            if (mouseX > item.x && mouseX < item.x + item.w &&
                mouseY > item.y && mouseY < item.y + item.h) {
                
                freezerItems.splice(i, 1);
                freezerItems.push(item);
                heldItem = item.id;
                return true;
            }
        }
        heldItem = null;
    }
}