function drawNiveis() {
    fill(0);
    textAlign(CENTER, CENTER);

    // --- MOLDURA ---
    const frameW = width * 0.6;
    const frameH = height * 0.9;

    stroke(0);
    strokeWeight(2);
    fill(255, 255, 255, 180);
    rect(width / 2, height / 2, frameW, frameH);
    // --- FIM DA MOLDURA ---


    // Título NÍVEIS
    fill(255, 0, 0);
    textSize(70);
    text("LEVEL", width / 2, height * 0.15);


    // --- Desenho dos 6 Botões de Nível ---
    const x_start = width / 2;
    const y_start = height / 2 - 80;
    const w_btn = 160;
    const h_btn = 100;
    const x_gap = 190;
    const y_gap = 140;

    const niveisPos = [
        {x: x_start - x_gap, y: y_start, state: 2},
        {x: x_start, y: y_start, state: 3},
        {x: x_start + x_gap, y: y_start, state: 4},
        {x: x_start - x_gap, y: y_start + y_gap, state: 5},
        {x: x_start, y: y_start + y_gap, state: 6},
        {x: x_start + x_gap, y: y_start + y_gap, state: 7}
    ];

    stroke(0);
    strokeWeight(0.8);
    textSize(60);

    for (let i = 0; i < niveisPos.length; i++) {
        const p = niveisPos[i];
        fill(255);
        rect(p.x, p.y, w_btn, h_btn);
        fill(0);
        text(`[ ${i + 1} ]`, p.x, p.y);
    }

    // --- Desenho do Controle de Som (Slider) ---
    const soundX_Center = width / 2 + AF_CENTRO;
    const soundY = height - 100;

    // Texto SOUND e CONTROLS
    fill(0);
    textSize(24);
    text("SOUND", soundX_Center, soundY - 40);
    text("CONTROLS", width / 2 - AF_CENTRO, soundY - 40);

    // Texto MOUSE abaixo de CONTROLS
    textSize(16);
    text("MOUSE", width / 2 - AF_CENTRO, soundY - 15);


    // Linha de volume (Slider)
    stroke(255, 0, 0);
    strokeWeight(2);
    line(soundX_Center - SLIDER_LENGTH / 2, soundY, soundX_Center + SLIDER_LENGTH / 2, soundY);

    // Posição do círculo (handle) baseada no volume
    const volumeCircleX = map(soundVolume, 0, 1, soundX_Center - SLIDER_LENGTH / 2, soundX_Center + SLIDER_LENGTH / 2);

    fill(255, 0, 0);
    noStroke();
    ellipse(volumeCircleX, soundY, 12, 12);
}

function checkNiveisClick() {
    // Hitbox dos 6 botões
    const x_start = width / 2;
    const y_start = height / 2 - 80;
    const w_btn = 160;
    const h_btn = 100;
    const x_gap = 190;
    const y_gap = 140;

    const niveisMap = [
        {x: x_start - x_gap, y: y_start, state: 2},
        {x: x_start, y: y_start, state: 3},
        {x: x_start + x_gap, y: y_start, state: 4},
        {x: x_start - x_gap, y: y_start + y_gap, state: 5},
        {x: x_start, y: y_start + y_gap, state: 6},
        {x: x_start + x_gap, y: y_start + y_gap, state: 7}
    ];

    for (let i = 0; i < niveisMap.length; i++) {
        const btn = niveisMap[i];
        if (mouseX > btn.x - w_btn/2 && mouseX < btn.x + w_btn/2 &&
            mouseY > btn.y - h_btn/2 && mouseY < btn.y + h_btn/2) {
            gameState = btn.state;
            return true;
        }
    }
    return false;
}

function checkVolumeClick() {
    const soundX_Center = width / 2 + AF_CENTRO;
    const soundY = height - 100;
    const clickTolerance = 25;

    const soundAreaMinX = soundX_Center - SLIDER_LENGTH / 2 - clickTolerance;
    const soundAreaMaxX = soundX_Center + SLIDER_LENGTH / 2 + clickTolerance;
    const soundAreaMinY = soundY - clickTolerance;
    const soundAreaMaxY = soundY + clickTolerance;

    if (mouseX >= soundAreaMinX && mouseX <= soundAreaMaxX &&
        mouseY >= soundAreaMinY && mouseY <= soundAreaMaxY) {
        isDraggingVolume = true;
        updateVolume();
    }
}

function updateVolume() {
    const soundX_Center = width / 2 + AF_CENTRO;

    const soundAreaMinX = soundX_Center - SLIDER_LENGTH / 2;
    const soundAreaMaxX = soundX_Center + SLIDER_LENGTH / 2;

    soundVolume = map(mouseX, soundAreaMinX, soundAreaMaxX, 0, 1);
    soundVolume = constrain(soundVolume, 0, 1);
}