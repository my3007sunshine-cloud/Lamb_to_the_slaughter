// videoControl.js

/**
 * Inicia a reprodução de um vídeo de introdução/conclusão de nível.
 * @param {string} videoPath - Caminho para o arquivo de vídeo.
 * @param {number} finalGameState - O gameState para o qual o jogo deve transicionar após o vídeo.
 */
function startLevelVideo(videoPath, finalGameState) {
    // 1. Limpeza de Vídeo Anterior
    if (nivelVideo) {
        nivelVideo.remove();
    }

    // 2. Criação e Configuração
    nivelVideo = createVideo(videoPath);
    nivelVideo.hide(); // Oculta o elemento HTML padrão
    nivelVideo.size(width, height);
    nivelVideo.volume(0); // Mudo para tentar autoplay
    nivelVideo.loop(false);

    // 3. Listener de Conclusão (Transição para o próximo estado)
    nivelVideo.onended(() => {
        console.log("Vídeo concluído. Transição para gameState: " + finalGameState);
        nivelVideo.stop();
        isVideoPlaying = false;
        nivelVideo.remove();

        // Define o próximo gameState (Minigame ou Próximo Nível)
        gameState = finalGameState;

        // Se for para o próximo nível, reinicia a fase local para 0 (Vídeo Intro)
        if (gameState === 3) nivel2Phase = 0; // Exemplo para Nível 2
        // Se for para o minigame, a lógica em drawNivelX() irá avançar a fase
    });

    // 4. Inicia a reprodução
    nivelVideo.play().catch(error => {
        console.warn("Autoplay falhou. O usuário pode precisar interagir.");
    });

    isVideoPlaying = true;
}

/**
 * Desenha o frame atual do vídeo no canvas.
 */
function drawLevelVideo() {
    if (nivelVideo && isVideoPlaying) {
        // Desenha o vídeo ocupando todo o canvas
        image(nivelVideo, 0, 0, width, height);

        // Desenha o botão "PULAR"
        drawSkipButton();
    }
}

// --- Lógica do Botão PULAR ---

function drawSkipButton() {
    const x = width - 80;
    const y = 30;
    const w = 100;
    const h = 40;

    // Fundo do botão (Preto semi-transparente)
    fill(0, 0, 0, 150);
    rect(x, y, w, h, 5); // Retângulo arredondado

    // Texto (Branco)
    fill(255);
    textSize(18);
    textAlign(CENTER, CENTER);
    text("PULAR", x, y);
}

/**
 * Verifica se o clique foi no botão PULAR e realiza a transição.
 * @param {number} nextGameState - O gameState para o qual o jogo deve transicionar após o pulo.
 * @returns {boolean} True se o vídeo foi pulado.
 */
function checkVideoSkipClick(nextGameState) {
    const x = width - 80;
    const y = 30;
    const w = 100;
    const h = 40;

    if (isVideoPlaying && mouseX > x - w/2 && mouseX < x + w/2 &&
        mouseY > y - h/2 && mouseY < y + h/2) {

        // Pular o vídeo
        nivelVideo.stop();
        isVideoPlaying = false;
        nivelVideo.remove();
        gameState = nextGameState;
        console.log("Vídeo pulado. Transição para gameState: " + nextGameState);
        return true;
    }
    return false;
}