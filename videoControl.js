// videoControl.js

function startLevelVideo(videoPath, finalGameState) {
    // 1. Limpa vídeo anterior se existir
    if (nivelVideo) {
        nivelVideo.remove();
        nivelVideo = null;
    }

    console.log("Carregando vídeo: " + videoPath);

    // 2. Cria o vídeo
    nivelVideo = createVideo(videoPath, () => {
        console.log("Vídeo carregado.");

        // --- Volume ---
        let volumeParaAplicar = (typeof soundVolume !== 'undefined') ? soundVolume : 1.0;
        nivelVideo.volume(volumeParaAplicar);
        console.log("Volume definido para: " + volumeParaAplicar);
        
        // --- CORREÇÃO AQUI ---
        // Em vez de nivelVideo.loop(false), usamos a propriedade do elemento DOM
        // ou simplesmente não chamamos .loop(), pois o .play() toca apenas uma vez por defeito.
        if (nivelVideo.elt) {
            nivelVideo.elt.loop = false; 
        }
        
        nivelVideo.play();
    });

    nivelVideo.hide(); 

    // Define o comportamento padrão de fim (será sobrescrito no nivel1.js, o que é correto)
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