function drawNiveis() {
    fill(0);
    textAlign(CENTER, CENTER);

    // Título NÍVEIS
    fill(255, 0, 0);
    textSize(70);
    text("LEVEL", width / 2, height * 0.15);

    // --- Desenho dos 5 Botões de Nível ---
    const x_start = width / 2;
    const y_start = height / 2 - 80;
    const w_btn = 160;
    const h_btn = 90;
    
    // Espaçamento
    const x_gap = 190;
    const y_gap = 180;

    // Configuração para 5 Níveis (3 em cima, 2 em baixo centrados)
    const niveisPos = [
        // Linha 1: 3 botões
        {x: x_start - x_gap, y: y_start, state: 2}, // Nível 1
        {x: x_start, y: y_start, state: 3},         // Nível 2
        {x: x_start + x_gap, y: y_start, state: 4}, // Nível 3
        
        // Linha 2: 2 botões (centrados)
        {x: x_start - (x_gap / 2), y: y_start + y_gap, state: 5}, // Nível 4
        {x: x_start + (x_gap / 2), y: y_start + y_gap, state: 6}  // Nível 5
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
    const soundY = height-40;

    fill(0);
    textSize(24);
    text("SOUND", soundX_Center, soundY - 40);
    text("CONTROLS", width / 2 - AF_CENTRO, soundY - 40);

    textSize(16);
    text("MOUSE", width / 2 - AF_CENTRO, soundY - 15);

    // Slider Volume
    stroke(255, 0, 0);
    strokeWeight(2);
    line(soundX_Center - SLIDER_LENGTH / 2, soundY, soundX_Center + SLIDER_LENGTH / 2, soundY);

    const volumeCircleX = map(soundVolume, 0, 1, soundX_Center - SLIDER_LENGTH / 2, soundX_Center + SLIDER_LENGTH / 2);

    fill(255, 0, 0);
    noStroke();
    ellipse(volumeCircleX, soundY, 12, 12);
}

function checkNiveisClick() {
    const x_start = width / 2;
    const y_start = height / 2 - 80;
    const w_btn = 160;
    const h_btn = 100;
    const x_gap = 190;
    const y_gap = 140; // Usei o mesmo valor lógico do draw, ajustado ligeiramente se necessário

    // Mesma lógica de posições do draw
    const niveisMap = [
        {x: x_start - x_gap, y: y_start, state: 2},
        {x: x_start, y: y_start, state: 3},
        {x: x_start + x_gap, y: y_start, state: 4},
        {x: x_start - (x_gap / 2), y: y_start + 180, state: 5}, // Usei 180 fixo para igualar o draw
        {x: x_start + (x_gap / 2), y: y_start + 180, state: 6}
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
    const soundY = height - 100; // Ajustado para corresponder à área visual se necessário, ou manter height-40
    // Nota: No código original estava height-100 para o click e height-40 para o desenho. 
    // Vou ajustar para a área do slider (height-40)
    
    const clickY = height - 40;
    const clickTolerance = 25;

    const soundAreaMinX = soundX_Center - SLIDER_LENGTH / 2 - clickTolerance;
    const soundAreaMaxX = soundX_Center + SLIDER_LENGTH / 2 + clickTolerance;
    const soundAreaMinY = clickY - clickTolerance;
    const soundAreaMaxY = clickY + clickTolerance;

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