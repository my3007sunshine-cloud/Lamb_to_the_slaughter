// nivel1.js

let minigameSuccess = false;

function drawNivel1() {
    // 1. INTRODUÇÃO (Vídeo)
    if (nivel1Phase === 0) {
        if (!isVideoPlaying) {
            startLevelVideo('imagens/nivel1.mp4', 2);

            // Sobrescreve o 'onended' para não sair do nível, mas ir para a fase 1
            if (nivelVideo) {
                nivelVideo.onended(() => {
                    stopAndCleanVideo();
                    nivel1Phase = 1;
                });
            }
        }
        return;
    }

    // 2. JOGO
    if (nivel1Phase === 1) {
        // Desenha o minigame
        drawNivelPlaceholder(1);

        fill(0);
        textSize(24);
        text("MINIGAME ATIVO", width/2, height/2 - 50);
        text("Clique para testar vitória/derrota", width/2, height/2 + 50);
    }

    // 3. CONCLUSÃO (Vídeo Sucesso)
    if (nivel1Phase === 2) {
        if (!isVideoPlaying) {
            // Ao terminar este vídeo, vai para o GameState 3 (Nível 2)
            startLevelVideo('imagens/nivel1_conclusao.mp4', 3);
        }
        return;
    }

    // 4. RETRY (Tela de Falha)
    if (nivel1Phase === 3) {
        drawRetryScreen();
    }
}

function checkNivel1Click() {
    // Retry Screen
    if (nivel1Phase === 3) {
        const xButton = width / 2;
        const yButton = height / 2 + 100;
        const wButton = 150;
        const hButton = 50;

        if (mouseX > xButton - wButton / 2 && mouseX < xButton + wButton / 2 &&
            mouseY > yButton - hButton / 2 && mouseY < yButton + hButton / 2) {
            nivel1Phase = 1; // Tenta de novo
            return true;
        }
    }

    // Simulação do Minigame (Clique para ganhar/perder)
    if (nivel1Phase === 1) {
        if (!minigameSuccess) {
            minigameSuccess = true;
            nivel1Phase = 2; // Vitória -> Vídeo Conclusão
        } else {
            minigameSuccess = false;
            nivel1Phase = 3; // Derrota -> Tela Retry
        }
        return true;
    }

    return false;
}

function drawRetryScreen() {
    background(0);
    if (inverseTexture) image(inverseTexture, 0, 0, width, height);

    fill(255, 0, 0);
    textSize(80);
    textAlign(CENTER, CENTER);
    text("TRY AGAIN", width / 2, height / 2 - 60);

    const xButton = width / 2;
    const yButton = height / 2 + 100;
    const wButton = 150;
    const hButton = 50;

    rectMode(CENTER);
    fill(0);
    rect(xButton, yButton, wButton, hButton);

    fill(255);
    textSize(30);

    // Ícone
    push();
    translate(xButton - 50, yButton);
    noStroke();
    triangle(-10, -10, -10, 10, 5, 0);
    pop();

    text("RETRY", xButton + 20, yButton);
}