// =================================================================
// TELA NÍVEL SEGUINTE - ESTILO NOIR (PRETO, BRANCO, VERMELHO)
// =================================================================

function drawNextLevel() {
    // 1. Fundo (Escuro para contraste)
    background(20); 

    push();
    translate(width / 2, height / 2);

    // 2. O Cartão / Papel
    rectMode(CENTER);
    noStroke();

    // Sombra dura (Preto puro)
    fill(0);
    rect(10, 10, 500, 400);

    // Papel (Branco Puro)
    fill(255); 
    stroke(0); 
    strokeWeight(2);
    rect(0, 0, 500, 400);

    // 3. Linhas Pautadas (Cinza para não distrair)
    stroke(200); 
    strokeWeight(1);
    let startY = -150;
    for (let i = 0; i < 8; i++) {
        line(-230, startY + (i * 40), 230, startY + (i * 40));
    }
    
    // Linha da margem (Vermelho - a única cor além de P&B)
    stroke(200, 0, 0, 150); 
    strokeWeight(1);
    line(-200, -195, -200, 195);

    // 4. Mancha (Vermelho sangue)
    noStroke();
    fill(200, 0, 0, 40); 
    ellipse(200, 130, 50, 45);
    
    // 5. Texto no Cartão
    fill(0); // Preto absoluto
    textAlign(CENTER, CENTER);
    
    // Título
    textSize(30);
    textStyle(ITALIC); 
    text("Dinner Preparations", 0, -160);
    
    // Subtítulo de sucesso (Vermelho para destaque)
    textSize(22);
    textStyle(BOLD);
    fill(200, 0, 0); 
    text("TASK COMPLETED.", 0, -80);
    
    // Checkmark (Vermelho)
    noFill();
    stroke(200, 0, 0);
    strokeWeight(4);
    beginShape();
    vertex(-20, -10);
    vertex(-5, 5);
    vertex(20, -20);
    endShape();
    
    pop();

    // =================================================================
    // UI ELEMENTS
    // =================================================================
    
    // --- BOTÃO CENTRAL (NEXT STEP) ---
    const btnX = width / 2;
    const btnY = height / 2 + 50;
    
    // Círculo Vermelho (Estilo marcador)
    noFill();
    stroke(200, 0, 0);
    strokeWeight(4);
    circle(btnX, btnY, 100);

    // Seta Vermelha
    fill(200, 0, 0);
    noStroke();
    triangle(btnX - 12, btnY - 18, btnX - 12, btnY + 18, btnX + 18, btnY);
    
    textAlign(CENTER);
    textSize(16);
    textStyle(BOLD);
    fill(0); // Texto preto para contraste no papel branco
    text("NEXT STEP", btnX, btnY + 75);

    // --- BOTÕES INFERIORES (MENU / REPLAY) ---
    const iconY = height - 60;
    const homeX = width / 2 - 100;
    const retryX = width / 2 + 100;

    textSize(14);
    textStyle(BOLD);
    
    // Menu (Branco sobre fundo preto)
    fill(255);
    noStroke();
    text("MENU", homeX, iconY + 35);
    
    stroke(255); strokeWeight(2); noFill();
    rectMode(CENTER);
    rect(homeX, iconY, 25, 25);
    line(homeX - 8, iconY, homeX + 8, iconY);
    line(homeX - 8, iconY - 6, homeX + 8, iconY - 6);
    line(homeX - 8, iconY + 6, homeX + 8, iconY + 6);

    // Replay (Branco sobre fundo preto)
    noStroke(); fill(255);
    text("REDO", retryX, iconY + 35);
    
    stroke(255); noFill();
    arc(retryX, iconY, 25, 25, -PI + 0.5, PI - 0.5);
    noStroke(); fill(255);
    triangle(retryX + 8, iconY - 4, retryX + 12, iconY + 4, retryX + 4, iconY + 4);
}

// =================================================================
// TELA DE FALHA (RETRY) - ALTO CONTRASTE
// =================================================================

function drawRetryScreen(message) {
    // Fundo Preto Absoluto
    background(0); 

    textAlign(CENTER, CENTER);
    
    // "Don't panic..." em Vermelho
    fill(255, 0, 0); 
    textStyle(ITALIC); 
    textSize(50);
    text("Don't panic...", width / 2, height / 2 - 130);
    
    // Mensagem de Erro em Branco
    textStyle(NORMAL);
    textSize(28);
    fill(255); 
    text(message, width / 2, height / 2 - 50);
    
    // Subtexto em Cinza
    textSize(18);
    fill(150); 
    text("(They must not suspect anything)", width / 2, height / 2);

    // --- BOTÃO RETRY ---
    const btnX = width / 2;
    const btnY = height / 2 + 120;
    const btnW = 240;
    const btnH = 50;
    
    let isHover = (mouseX > btnX - btnW/2 && mouseX < btnX + btnW/2 && 
                   mouseY > btnY - btnH/2 && mouseY < btnY + btnH/2);

    rectMode(CENTER);
    
    if (isHover) {
        // Hover: Fundo Vermelho, Texto Branco
        fill(200, 0, 0);
        noStroke();
        rect(btnX, btnY, btnW, btnH); 
        fill(255); 
        textStyle(BOLD);
    } else {
        // Normal: Borda Branca, Texto Branco
        noFill();
        stroke(255);
        strokeWeight(2);
        rect(btnX, btnY, btnW, btnH);
        fill(255); 
        noStroke();
        textStyle(NORMAL);
    }
    
    textSize(20);
    text("COMPOSE YOURSELF", btnX, btnY); 
}

// =================================================================
// FUNÇÕES AUXILIARES DE UI (Estilo P/B/V)
// =================================================================

function drawObjectiveBox(tarefaTexto, progressoAtual, totalNecessario) {
    push();
    let textoFinal = `${tarefaTexto}  ${progressoAtual}/${totalNecessario}`;
    
    textSize(22); textStyle(BOLD);
    let larguraDoTitulo = textWidth("CURRENT TASK");
    textSize(18); textStyle(NORMAL);
    let larguraDoConteudo = textWidth(textoFinal);

    let padding = 40;
    let w = max(larguraDoTitulo, larguraDoConteudo) + padding;
    let h = 70;
    let x = w/2 + 20;
    let y = h/2 + 20;

    rectMode(CENTER);
    // Papel Branco
    fill(255); 
    stroke(0); // Borda Preta
    strokeWeight(3);
    rect(x, y, w, h);

    // Título Preto
    fill(0); noStroke(); textAlign(CENTER, CENTER);
    textSize(22); textStyle(BOLD);
    text("CURRENT TASK", x, y - 18);

    // Linha divisória Vermelha (para um pequeno detalhe)
    stroke(200, 0, 0); strokeWeight(2);
    line(x - w/2 + 10, y - 2, x + w/2 - 10, y - 2);

    noStroke(); textSize(18); textStyle(NORMAL);
    fill(0); // Texto Preto
    textAlign(LEFT, CENTER);
    text(textoFinal, x - larguraDoConteudo/2, y + 20);
    pop();
    return y + h/2;
}

function drawIngredientsList(listaDeItens, yInicial) {
    if (yInicial === undefined) yInicial = 100;
    push();
    textSize(16);
    let maxLarguraTexto = textWidth("SHOPPING LIST");
    for (let item of listaDeItens) {
        let w = textWidth("- " + item);
        if (w > maxLarguraTexto) maxLarguraTexto = w;
    }
    let padding = 40;
    let w = maxLarguraTexto + padding;
    let linhaAltura = 22;
    let cabecalhoAltura = 30;
    let h = cabecalhoAltura + (listaDeItens.length * linhaAltura) + 15;
    let x = w/2 + 20;
    let y = yInicial + 20 + (h / 2);

    rectMode(CENTER);
    // Papel Branco
    fill(255);
    stroke(0); strokeWeight(3);
    rect(x, y, w, h);

    fill(0); noStroke(); textAlign(CENTER, CENTER);
    textSize(20); textStyle(BOLD);
    let topoY = y - h/2;
    text("NEEDS", x, topoY + 18);

    stroke(200, 0, 0); strokeWeight(2);
    line(x - w/2 + 10, topoY + 32, x + w/2 - 10, topoY + 32);

    noStroke(); textSize(16); textStyle(NORMAL);
    textAlign(LEFT, CENTER);
    let inicioTextoX = x - maxLarguraTexto/2;
    let itemY = topoY + 48;
    for (let i = 0; i < listaDeItens.length; i++) {
        fill(0); // Texto Preto
        text("- " + listaDeItens[i], inicioTextoX, itemY + (i * linhaAltura));
        
        // Linhas pautadas cinzas
        stroke(200); strokeWeight(1);
        if(i < listaDeItens.length -1) line(x-w/2+5, itemY + (i * linhaAltura) + 11, x+w/2-5, itemY + (i * linhaAltura) + 11);
        noStroke();
    }
    pop();
}