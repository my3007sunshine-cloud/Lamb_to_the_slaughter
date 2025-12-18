// =================================================================
// TELA DE ESCOLHA DE NÍVEIS - ESTILO NOIR TIMELINE
// =================================================================

function drawNiveis() {
    // 1. Fundo Escuro
    background(15); 

    // Título (Estilo Datilografado)
    textAlign(CENTER, CENTER);
    fill(255); 
    textSize(60);
    textStyle(BOLD);
    text("THE TIMELINE", width / 2, height * 0.12);
    
    // Subtítulo
    textSize(20);
    textStyle(ITALIC);
    fill(150);
    text("- The events of this evening -", width / 2, height * 0.18);
    textStyle(NORMAL); // Reset

    // --- POSIÇÕES DOS NÍVEIS ---
    // Mantive as posições originais para o fluxo funcionar bem
    const niveisPos = [
        { id: 1, x: width * 0.20, y: height * 0.50, state: 2, label: "DRINKS" }, 
        { id: 2, x: width * 0.35, y: height * 0.35, state: 3, label: "FREEZER" }, 
        { id: 3, x: width * 0.50, y: height * 0.50, state: 4, label: "OVEN" }, 
        { id: 4, x: width * 0.65, y: height * 0.65, state: 5, label: "SMILE" }, 
        { id: 5, x: width * 0.80, y: height * 0.50, state: 6, label: "POLICE" }  
    ];

    // --- 2. A LINHA VERMELHA (O Fio da Meada) ---
    // Linha simples e direta conectando os passos
    stroke(200, 0, 0); 
    strokeWeight(3);
    noFill();
    
    beginShape();
    for (let p of niveisPos) {
        vertex(p.x, p.y);
    }
    endShape();

    // --- 3. OS CARTÕES (Polaroids Noir) ---
    rectMode(CENTER);

    for (let i = 0; i < niveisPos.length; i++) {
        const p = niveisPos[i];
        
        // Verifica hover
        let isHover = dist(mouseX, mouseY, p.x, p.y) < 60;
        
        // Configuração Visual
        let cardW = isHover ? 130 : 110;
        let cardH = isHover ? 150 : 130;
        
        push();
        translate(p.x, p.y);
        
        // Efeito de Hover: Rotação suave para endireitar
        // Se não houver hover, fica ligeiramente torto (estilo natural)
        let rot = isHover ? 0 : (i % 2 === 0 ? 0.05 : -0.05);
        rotate(rot);

        // A MOLDURA (Polaroid)
        if (isHover) {
            stroke(200, 0, 0); // Borda Vermelha se selecionado
            strokeWeight(4);
            fill(255);         // Branco puro
        } else {
            noStroke();
            fill(220);         // Branco sujo se inativo
        }
        
        // Desenha a moldura da foto
        rect(0, 0, cardW, cardH, 2);

        // A "FOTO" (Retângulo Preto)
        fill(10); 
        noStroke();
        rect(0, -15, cardW * 0.85, cardH * 0.60);

        // Número do Nível (Branco sobre o fundo preto)
        fill(255);
        textSize(isHover ? 40 : 30);
        textStyle(BOLD);
        text(p.id, 0, -15);

        // Texto/Etiqueta em baixo
        fill(0); // Texto preto na parte branca da polaroid
        textSize(14);
        textStyle(BOLD);
        text(p.label, 0, cardH/2 - 15);
        
        // Pionese/Alfinete (Vermelho)
        fill(200, 0, 0);
        noStroke();
        ellipse(0, -cardH/2 + 8, 8, 8);
        
        pop();
    }

    drawSoundControls();
}

function drawSoundControls() {
    const soundX_Center = width / 2;
    const soundY = height - 50;
    
    textAlign(CENTER, CENTER);
    fill(255); // Branco para contrastar com o fundo preto
    noStroke();
    textSize(16);
    textStyle(BOLD);
    text("AUDIO LEVEL", soundX_Center, soundY - 25);

    // Slider (Linha Branca)
    stroke(255);
    strokeWeight(2);
    const sliderWidth = 200;
    line(soundX_Center - sliderWidth/2, soundY, soundX_Center + sliderWidth/2, soundY);

    // Marcador (Retângulo Vermelho)
    const volumeX = map(soundVolume, 0, 1, soundX_Center - sliderWidth/2, soundX_Center + sliderWidth/2);
    
    fill(200, 0, 0);
    noStroke();
    rectMode(CENTER);
    rect(volumeX, soundY, 12, 24); 
}

// --- FUNÇÕES DE CLIQUE (MANTIDAS IGUAIS PARA FUNCIONAR) ---

function checkNiveisClick() {
    const niveisPos = [
        { id: 1, x: width * 0.20, y: height * 0.50, state: 2 },
        { id: 2, x: width * 0.35, y: height * 0.35, state: 3 },
        { id: 3, x: width * 0.50, y: height * 0.50, state: 4 },
        { id: 4, x: width * 0.65, y: height * 0.65, state: 5 },
        { id: 5, x: width * 0.80, y: height * 0.50, state: 6 }
    ];

    const wClick = 130; // Ajustado para o novo tamanho
    const hClick = 150;

    for (let p of niveisPos) {
        if (mouseX > p.x - wClick/2 && mouseX < p.x + wClick/2 &&
            mouseY > p.y - hClick/2 && mouseY < p.y + hClick/2) {
            gameState = p.state;
            return true;
        }
    }
    return false;
}

function checkVolumeClick() {
    const soundX_Center = width / 2;
    const soundY = height - 50;
    const sliderWidth = 200;
    
    if (mouseX > soundX_Center - sliderWidth/2 - 20 && 
        mouseX < soundX_Center + sliderWidth/2 + 20 &&
        mouseY > soundY - 20 && mouseY < soundY + 20) {
        isDraggingVolume = true;
        updateVolume();
    }
}

function updateVolume() {
    const soundX_Center = width / 2;
    const sliderWidth = 200;
    soundVolume = map(mouseX, soundX_Center - sliderWidth/2, soundX_Center + sliderWidth/2, 0, 1);
    soundVolume = constrain(soundVolume, 0, 1);
}