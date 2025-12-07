function drawRetryScreen() {
    background(0);
    fill(255, 0, 0);
    textSize(50);
    textAlign(CENTER);
    text("FALHOU", width/2, height/2 - 50);

    fill(255);
    rect(width/2, height/2 + 100, 200, 50);
    fill(0);
    textSize(30);
    text("TENTAR DE NOVO", width/2, height/2 + 100);
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

    // Bolinha
    circle(x - larguraDoConteudo/2 - 12, conteudoY, 6);

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