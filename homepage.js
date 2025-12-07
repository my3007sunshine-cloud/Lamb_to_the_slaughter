function drawMenu() {
    fill(0);
    textAlign(CENTER, CENTER);

    // Título: "LAMB TO THE SLAUGHTER"
    fill(255, 0, 0);
    textSize(80);
    text("LAMB TO THE SLAUGHTER", width / 2, height / 2 - 120 + 60);

    // Subtítulo: "ROALD DAHL"
    fill(0);
    textSize(24);
    text("ROALD DAHL", width / 2, height / 2 - 50 + 60);

    // Desenho do Botão INICIAR
    const xButton = width / 2;
    const yButton = height / 2 + 100;
    const wButton = 150;
    const hButton = 50;

    // Botão preto
    fill(0);
    rect(xButton, yButton, wButton, hButton);

    // Texto e Ícone de Play (Branco)
    fill(255);
    textSize(30);

    // Desenha um triângulo de "Play" (iniciar)
    push();
    translate(xButton - 50, yButton);
    noStroke();
    triangle(-10, -10, -10, 10, 5, 0);
    pop();

    text("START", xButton + 20, yButton);
}

function checkMenuClick() {
    // Hitbox do botão INICIAR
    const xButton = width / 2;
    const yButton = height / 2 + 100;
    const wButton = 200;
    const hButton = 50;

    if (mouseX > xButton - wButton/2 && mouseX < xButton + wButton/2 &&
        mouseY > yButton - hButton/2 && mouseY < yButton + hButton/2) {
        gameState = 1;
    }
}