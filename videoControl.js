// videoControl.js

function startLevelVideo(videoPath, finalGameState) {
    // Limpa vídeo anterior
    if (nivelVideo) {
        nivelVideo.remove();
        nivelVideo = null;
    }

    console.log("Carregando vídeo: " + videoPath);

    // Cria o elemento de vídeo
    nivelVideo = createVideo(videoPath, () => {
        console.log("Vídeo carregado.");
        nivelVideo.volume(0);
        nivelVideo.loop(false);
        nivelVideo.play();
    });

    // Esconde o elemento HTML para desenhá-lo no Canvas
    nivelVideo.hide();

    // Define o callback padrão de fim
    nivelVideo.onended(() => {
        stopAndCleanVideo();
        gameState = finalGameState;
    });

    isVideoPlaying = true;
}

function stopAndCleanVideo() {
    if (nivelVideo) {
        nivelVideo.stop();
        nivelVideo.remove();
        nivelVideo = null;
    }
    isVideoPlaying = false;
}

function drawLevelVideo() {
    if (nivelVideo && isVideoPlaying) {
        // O SEGREDO: Desenha o vídeo esticado no tamanho total do canvas
        image(nivelVideo, 0, 0, width, height);

        drawSkipButton();
    }
}

function drawSkipButton() {
    const x = width - 80;
    const y = 30;
    const w = 100;
    const h = 40;

    fill(0, 0, 0, 150);
    rect(x, y, w, h, 5);

    fill(255);
    textSize(18);
    textAlign(CENTER, CENTER);
    text("PULAR", x, y);
}

function forceSkipVideo(callbackAction) {
    const x = width - 80;
    const y = 30;
    const w = 100;
    const h = 40;

    if (mouseX > x - w/2 && mouseX < x + w/2 &&
        mouseY > y - h/2 && mouseY < y + h/2) {

        stopAndCleanVideo();
        if (callbackAction) callbackAction();
    }
}