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

    // Configurações de layout (pode ajustar aqui para mudar em TODOS os níveis de uma vez)
    let w = 250;
    let h = 120;
    let x = w/2 +20;
    let y = h/2 +20;

    fill(255); stroke(0); strokeWeight(3);
    rect(x, y, w, h);
    line(x-w/2, y-30, x + w/2, y-30);

    // Título Fixo
    fill(0); noStroke(); textAlign(CENTER, CENTER);
    textSize(32); textStyle(BOLD); textFont('minhaFonte');
    text("OBJECTIVE", x, y);

    // Texto Variável (Aqui está a mágica)
    textAlign(LEFT, CENTER);
    textSize(24);
    textFont('minhaFonte');

    circle(x + 30, y + 85, 10); // Bullet point

    // Monta a string: "MAKE DRINK" + " " + "0" + "/" + "1"
    let textoFinal = `${tarefaTexto}  ${progressoAtual}/${totalNecessario}`;
    text(textoFinal, x, y + 85);

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
    let x = w/2+20;
    let y = h/2+20; // Altura fixa para o exemplo

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
}

function drawIngredientsList(listaDeItens) {
    push();

    // 1. Calcular largura necessária (baseada no item mais longo)
    textSize(18);
    let maxLarguraTexto = textWidth("NEEDS"); // Largura mínima

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

    // 2. Posicionamento (Automaticamente abaixo da caixa de Objetivo)
    // A caixa de cima está em Y=100 e tem altura 80. Logo, termina em 140.
    // Damos +10 de margem -> Começa em 150.
    // Como rect é CENTER, somamos metade da altura.
    let x = w/2+20;
    let y = h/2+120;

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

    let topoY = y - h/2; // Topo exato do retângulo
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

    let inicioTextoX = x - maxLarguraTexto/2; // Alinha à esquerda visualmente
    let itemY = topoY + 50;

    for (let i = 0; i < listaDeItens.length; i++) {
        text("- " + listaDeItens[i], inicioTextoX, itemY + (i * linhaAltura));
    }

    pop();
}