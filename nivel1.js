// =================================================================
// NIVEL 1 - LOGIC (CORRIGIDO FINAL)
// =================================================================

let glasses = [];
let ingredients = [];
let selectedGlassIndex = -1;
let heldItem = null;
let isGameInitialized = false;

// Variável para guardar a mensagem de erro atual
let currentErrorMessage = "Try Again";

function setupNivel1() {
    // 1. Definição dos Copos
    glasses = [
        {
            id: 'mary',
            label: "MARY",
            x: width * 0.40,
            y: height * 0.68,
            w: 120,
            h: 160,
            state: 0,
            whiskeyCount: 0,
            maxWhiskey: 1
        },
        {
            id: 'patrick',
            label: "PATRICK",
            x: width * 0.60,
            y: height * 0.68,
            w: 120,
            h: 160,
            state: 0,
            whiskeyCount: 0,
            maxWhiskey: 2
        }
    ];

    // 2. Definição dos Ingredientes
    ingredients = [
        { id: 'ice',     img: imgIceBag,  x: width * 0.20, y: height * 0.25, w: 130, h: 130 },
        { id: 'whiskey', img: imgWhiskey, x: width * 0.45, y: height * 0.20, w: 100, h: 200 },
        { id: 'soda',    img: imgSoda,    x: width * 0.75, y: height * 0.20, w: 100, h: 200 }
    ];

    heldItem = null;
    selectedGlassIndex = -1;
    isGameInitialized = true;
}

function drawNivel1() {
    // --- FASE 0: VÍDEO INTRO ---
    if (nivel1Phase === 0) {
        if (!isVideoPlaying) {
            startLevelVideo('imagens/nivel1.mp4', 2);
            // Callback para quando o vídeo terminar
            if (nivelVideo) {
                nivelVideo.onended(() => {
                    stopAndCleanVideo();
                    setupNivel1();
                    nivel1Phase = 1; // Vai para o jogo
                });
            }
        }
        return;
    }

    // --- FASE 1: JOGO ---
    if (nivel1Phase === 1) {
        if (!isGameInitialized) setupNivel1();

        // 1. Fundo
        if (backgroundMiniGame1) {
            image(backgroundMiniGame1, 0, 0, width, height);
        } else {
            background(200);
        }

        // 2. Ingredientes (Atrás)
        drawIngredients();

        // 3. Copos (Na frente)
        drawGlasses();

        // 4. UI (Objetivos)
        let drinksProntos = glasses.filter(g => g.state === 3).length;
        let yFimCaixa = drawObjectiveBox("PREPARE DRINKS", drinksProntos, 2);

        drawIngredientsList([
            "Select a Glass",
            "1. Add Ice",
            "2. Add Whiskey",
            "   (Mary: x1 | Patrick: x2)",
            "3. Add Soda"
        ], yFimCaixa);

        // 5. Cursor (Item na mão)
        if (heldItem) {
            drawHeldItemCursor();
        }

        // 6. Vitória
        if (drinksProntos === 2) {
            nivel1Phase = 2; // Vai para o vídeo final
        }
    }

    // --- FASE 2: CONCLUSAO (CORRIGIDO) ---
    if (nivel1Phase === 2) {
        if (!isVideoPlaying) {
            // Importante: Passamos '2' para manter o gameState aqui
            startLevelVideo('imagens/nivel1.mp4', 2);

            if (nivelVideo) {
                nivelVideo.onended(() => {
                    stopAndCleanVideo();
                    gameState = 2;   // Mantém no nivel 1
                    nivel1Phase = 4; // Mostra a tela "Next Level"
                });
            }
        }
        return;
    }

    // --- FASE 3: RETRY ---
    if (nivel1Phase === 3) {
        drawRetryScreen(currentErrorMessage);
    }

    // --- FASE 4: NEXT LEVEL SCREEN ---
    if (nivel1Phase === 4) {
        drawNextLevel();
    }
}

// =================================================================
// DESENHO (DRAW)
// =================================================================

function drawIngredients() {
    for (let item of ingredients) {
        let isHover = (mouseX > item.x && mouseX < item.x + item.w &&
            mouseY > item.y && mouseY < item.y + item.h);

        if (isHover) {
            tint(255, 220); // Brilho ao passar o mouse
        } else {
            noTint();
        }

        if (item.img) image(item.img, item.x, item.y, item.w, item.h);
        else { fill(150); rect(item.x + item.w/2, item.y + item.h/2, item.w, item.h); }

        noTint();
    }
}

function drawGlasses() {
    for (let i = 0; i < glasses.length; i++) {
        let g = glasses[i];

        push();
        imageMode(CENTER);
        rectMode(CENTER);

        // --- 1. LÍQUIDO ---
        let liquidHeight = 0;
        let liquidColor = color(200);

        if (g.state >= 2) { // Tem Whiskey
            liquidColor = color(204, 102, 0, 200); // Âmbar
            let percentage = g.whiskeyCount / g.maxWhiskey;
            liquidHeight = (g.h * 0.35) * percentage;

            if (g.state === 3) { // Tem Soda
                liquidHeight = g.h * 0.85; // Quase cheio
                liquidColor = color(230, 180, 100, 220);
            }
        }

        if (liquidHeight > 0) {
            let margin = 12;
            fill(liquidColor);
            noStroke();
            rectMode(CORNER);

            let lX = g.x - (g.w / 2) + margin;
            let lY = (g.y + g.h / 2) - liquidHeight - 5;
            let lW = g.w - (margin * 2);

            rect(lX, lY, lW, liquidHeight, 0, 0, 15, 15);
            rectMode(CENTER);
        }

        // --- 2. GELO ---
        if (g.state >= 1) {
            if(imgIceCube) {
                image(imgIceCube, g.x, g.y + (g.h/4), 50, 50);
            } else {
                fill(200, 230, 255);
                rect(g.x, g.y + (g.h/4), 40, 40);
            }
        }

        // --- 3. IMAGEM DO COPO ---
        if (i === selectedGlassIndex) {
            noFill();
            stroke(255, 0, 0);
            strokeWeight(3);
            rect(g.x, g.y, g.w + 12, g.h + 12, 12);
        }

        if (typeof imgcopo !== 'undefined' && imgcopo) {
            image(imgcopo, g.x, g.y, g.w, g.h);
        } else {
            stroke(200); fill(255, 255, 255, 50);
            rect(g.x, g.y, g.w, g.h);
        }

        // --- 4. RÓTULO ---
        fill(0);
        noStroke();
        textAlign(CENTER);
        textSize(20);
        text(g.label, g.x, g.y + (g.h/2) + 30);

        pop();
    }
}

function drawHeldItemCursor() {
    push();
    translate(mouseX, mouseY);
    imageMode(CENTER);

    if (heldItem === 'ice') {
        if (imgIceCube) image(imgIceCube, 0, 0, 50, 50);
        else { fill(0, 0, 255); rect(0, 0, 40, 40); }
    }
    else if (heldItem === 'whiskey' && imgWhiskey) image(imgWhiskey, 0, 0, 60, 120);
    else if (heldItem === 'soda' && imgSoda) image(imgSoda, 0, 0, 60, 120);

    pop();
    imageMode(CORNER);
}

// nivel1.js

function checkNivel1Click() {

    // --- CLIQUE NA TELA DE NEXT LEVEL (PHASE 4) ---
    if (nivel1Phase === 4) {

        // 1. Botão Central (Ir para Nível 2)
        const btnX = width / 2;
        const btnY = height / 2 + 50;
        const btnW = 200;
        const btnH = 60;

        if (mouseX > btnX - btnW/2 && mouseX < btnX + btnW/2 &&
            mouseY > btnY - btnH/2 && mouseY < btnY + btnH/2) {

            gameState = 3; // Vai para o Nível 2
            return true;
        }

        // --- NOVOS ÍCONES ---
        const iconY = height - 60;
        const homeX = 80;
        const retryX = 160;
        const raioClick = 30; // Tamanho da área de clique

        // 2. Clique na CASA (Voltar ao Menu)
        if (dist(mouseX, mouseY, homeX, iconY) < raioClick) {
            gameState = 0; // Menu Principal
            nivel1Phase = 0; // Reseta fase do nível 1
            return true;
        }

        // 3. Clique na SETA (Reiniciar Nível 1)
        if (dist(mouseX, mouseY, retryX, iconY) < raioClick) {
            setupNivel1();   // Reseta variáveis do jogo
            nivel1Phase = 1; // Vai direto para a fase de jogar (pula vídeo intro)
            return true;
        }

        return false;
    }

    // --- CLIQUE NA TELA DE RETRY (PHASE 3 - Game Over) ---
    if (nivel1Phase === 3) {
        const xButton = width / 2;
        const yButton = height / 2 + 100;
        if (dist(mouseX, mouseY, xButton, yButton) < 100) {
            setupNivel1();
            nivel1Phase = 1;
            return true;
        }
        return false;
    }

    // --- CLIQUE DURANTE O JOGO (PHASE 1) ---
    if (nivel1Phase === 1) {
        // Pegar ingrediente
        for (let item of ingredients) {
            if (mouseX > item.x && mouseX < item.x + item.w &&
                mouseY > item.y && mouseY < item.y + item.h) {
                heldItem = item.id;
                return true;
            }
        }

        // Usar no copo
        for (let i = 0; i < glasses.length; i++) {
            let g = glasses[i];
            let left = g.x - (g.w / 2);
            let right = g.x + (g.w / 2);
            let top = g.y - (g.h / 2);
            let bottom = g.y + (g.h / 2);

            if (mouseX > left && mouseX < right &&
                mouseY > top && mouseY < bottom) {

                if (heldItem === null) {
                    selectedGlassIndex = i;
                } else {
                    selectedGlassIndex = i;
                    applyIngredientToGlass(g, heldItem);
                    heldItem = null;
                }
                return true;
            }
        }
        heldItem = null;
    }
}

function triggerFail(message) {
    currentErrorMessage = message;
    nivel1Phase = 3;
}

function applyIngredientToGlass(g, item) {
    if (g.state === 3) return;

    if (item === 'ice') {
        if (g.state === 0) g.state = 1;
    }
    else if (item === 'whiskey') {
        if (g.state === 1 || (g.state === 2 && g.whiskeyCount < g.maxWhiskey)) {
            g.whiskeyCount++;
            g.state = 2;
        } else if (g.state === 0) {
            triggerFail("Need Ice first!");
        }
    }
    else if (item === 'soda') {
        if (g.state === 2) {
            if (g.whiskeyCount < g.maxWhiskey) {
                triggerFail("Too weak for " + g.label);
            } else {
                g.state = 3;
            }
        } else {
            triggerFail("Add Whiskey first!");
        }
    }
}
