function drawRetryScreen(message) {
    background(0);

    push();
    imageMode(CORNER);

    if (inverseTexture) {
        image(inverseTexture, 0, 0, width, height);
    } else {
        fill(50);
        rectMode(CORNER);
        rect(0, 0, width, height);
    }
    pop();

    const scaleFactor = 2;

    fill(255);
    textSize(18 * scaleFactor);
    textAlign(CENTER, CENTER);
    text(message, width / 2, height / 2 - (100 * scaleFactor));

    fill(255, 0, 0);
    textSize(50 * scaleFactor);
    text("OOPS................", width / 2, height / 2 - (50 * scaleFactor));
    text("TRY AGAIN", width / 2, height / 2);

    const xButton = width / 2;
    const yButton = height / 2 + (100 * scaleFactor);
    const wButton = 150;
    const hButton = 50;

    rectMode(CENTER);

    fill(0);
    rect(xButton, yButton, wButton, hButton);

    fill(255);
    textSize(30);

    push();
    translate(xButton - 50, yButton);
    noStroke();
    triangle(-10, -10, -10, 10, 5, 0);
    pop();

    textAlign(LEFT, CENTER);
    text("RETRY", xButton - 20, yButton);
}

// addicionalScreen.js (CORRIGIDO - Seta Melhorada)

function drawNextLevel() {
    push();
    textAlign(CENTER, CENTER);
    fill(255, 0, 0);
    textSize(80);
    text("NIVEL SEGUINTE", width / 2, height / 2 - 80);
    pop();

    rectMode(CENTER);
    const btnX = width / 2;
    const btnY = height / 2 + 50;
    const btnW = 200;
    const btnH = 60;

    fill(0);
    noStroke();
    rect(btnX, btnY, btnW, btnH);

    fill(200);
    push();
    translate(btnX, btnY);
    triangle(-10, -10, -10, 10, 10, 0);
    pop();

    const iconY = height - 60;
    const homeX = 80;
    const retryX = 160;

    push();
    stroke(0);
    strokeWeight(3);
    strokeCap(ROUND);
    strokeJoin(ROUND);

    // Casa
    noFill();
    beginShape();
    vertex(homeX, iconY - 12);
    vertex(homeX + 12, iconY - 2);
    vertex(homeX - 12, iconY - 2);
    endShape(CLOSE);

    rectMode(CORNER);
    rect(homeX - 10, iconY - 2, 20, 16);
    rect(homeX - 3, iconY + 6, 6, 8);

    // Seta (Replay)
    noFill();
    stroke(0);
    strokeWeight(3);

    const radius = 12;
    const centerY = iconY + 5;
    const startAngle = PI / 4;
    const endAngle = TWO_PI - PI / 8;

    arc(retryX, centerY, radius * 2, radius * 2, startAngle, endAngle);

    push();
    const arrowTipX = retryX + cos(startAngle) * radius;
    const arrowTipY = centerY + sin(startAngle) * radius;

    translate(arrowTipX, arrowTipY);
    rotate(startAngle + PI / 2 + 0.35); // Ângulo ajustado

    noStroke();
    fill(0);
    // Triângulo movido ligeiramente para a esquerda (x: -2)
    triangle(0, 0, -7, -5, -7, 5);
    pop();

    pop();
}

function drawObjectiveBox(tarefaTexto, progressoAtual, totalNecessario) {
    push();

    // 1. Preparar texto e medir larguras
    let textoFinal = `${tarefaTexto}  ${progressoAtual}/${totalNecessario}`;

    textSize(20);
    let larguraDoConteudo = textWidth(textoFinal);

    textSize(26);
    textStyle(BOLD);
    let larguraDoTitulo = textWidth("OBJECTIVE");

    // 2. Calcular tamanho da caixa
    let padding = 40;
    let w = max(larguraDoTitulo, larguraDoConteudo) + padding;
    let h = 80;

    // Posição: Centro da tela (ajuste o Y se quiser mais para cima)
    let x = w/2 + 20;
    let y = h/2 + 20;

    // 3. Desenhar Caixa
    rectMode(CENTER);
    fill(255);
    stroke(0);
    strokeWeight(2);
    rect(x, y, w, h);

    // 4. Desenhar Título
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(26);
    textStyle(BOLD);
    text("OBJECTIVE", x, y - 20);

    // 5. Linha divisória
    stroke(0);
    strokeWeight(2);
    line(x - w/2, y - 5, x + w/2, y - 5);

    // 6. Texto do Objetivo e Bolinha
    noStroke();
    textSize(20);
    textStyle(NORMAL);

    let conteudoY = y + 20;


    // Texto
    textAlign(LEFT, CENTER);
    text(textoFinal, x - larguraDoConteudo/2, conteudoY);

    pop();

    // --- O SEGREDINHO QUE FALTAVA ---
    // Retorna a borda inferior (Y + metade da altura)
    return y + h/2;
}

function drawIngredientsList(listaDeItens, yInicial) {
    // Se yInicial não for passado (for undefined), usamos um valor padrão para não quebrar
    if (yInicial === undefined) {
        yInicial = 100;
    }

    push();

    // 1. Calcular largura necessária
    textSize(18);
    let maxLarguraTexto = textWidth("NEEDS");

    for (let item of listaDeItens) {
        let w = textWidth("- " + item);
        if (w > maxLarguraTexto) maxLarguraTexto = w;
    }

    let padding = 40;
    let w = maxLarguraTexto + padding;

    // Altura baseada no número de itens
    let linhaAltura = 25;
    let cabecalhoAltura = 35;
    let h = cabecalhoAltura + (listaDeItens.length * linhaAltura) + 10;

    // 2. Posicionamento
    let margem = 10; // Espaço entre as caixas

    // O X deve ser igual ao da caixa de cima (w/2 + 20 na outra função)
    // Mas como a largura W muda, vamos recalcular o centro baseada na largura desta caixa
    let x = w/2 + 20;

    // O Y é calculado a partir de onde a outra terminou
    let y = yInicial + margem + (h / 2);

    // 3. Desenhar Fundo
    rectMode(CENTER);
    fill(255);
    stroke(0);
    strokeWeight(2);
    rect(x, y, w, h);

    // 4. Título NEEDS
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(22);
    textStyle(BOLD);

    let topoY = y - h/2;
    text("NEEDS", x, topoY + 18);

    // Linha
    stroke(0);
    strokeWeight(2);
    line(x - w/2, topoY + 35, x + w/2, topoY + 35);

    // 5. Lista
    noStroke();
    textSize(18);
    textStyle(NORMAL);
    textAlign(LEFT, CENTER);

    let inicioTextoX = x - maxLarguraTexto/2;
    let itemY = topoY + 50;

    for (let i = 0; i < listaDeItens.length; i++) {
        text("- " + listaDeItens[i], inicioTextoX, itemY + (i * linhaAltura));
    }

    pop();
}