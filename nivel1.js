// 0: Vídeo Intro | 1: Minigame | 2: Vídeo Conclusão (Sucesso) | 3: Tela de Falha (Retry)
let nivel1Phase = 0;
let minigameSuccess = false;

// Variáveis para o alvo do Minigame
const targetX = 1000;
const targetY = 300;
const targetRadius = 40;

function drawNivel1() {
    // 1. FASE DE INTRODUÇÃO (Vídeo Inicial)
    if (nivel1Phase === 0) {
        if (!isVideoPlaying) {
            console.log("Iniciando Vídeo de Introdução do Nível 1.");
            // Certifica-te que este ficheiro existe
            startLevelVideo('imagens/nivel1.mp4', 2);

            // Quando o vídeo acabar:
            nivelVideo.onended(() => {
                nivelVideo.stop();
                isVideoPlaying = false;
                nivelVideo.remove();
                nivel1Phase = 1; // Vai para o Minigame
            });
        }
        return;
    }

 // 2. FASE DO MINIGAME
    if (nivel1Phase === 1) {
        // Desenha o minigame (Placeholder por enquanto)
        drawNivelPlaceholder(1);

        textSize(24);
        fill(255, 0, 0);
        text("Clique para Simular Fim do Jogo", width/2, height/2 + 100);
        // Nota: O clique é detetado em checkNivel1Click
    }

    // 3. FASE DE CONCLUSÃO (Vídeo de Transição - Sucesso)
    if (nivel1Phase === 2) {
        if (!isVideoPlaying) {
            console.log("Iniciando Vídeo de Conclusão do Nível 1.");

            // CORRIGIDO: Adicionado nome do ficheiro. Se não tiveres vídeo, deixa vazio mas muda o código para pular direto.
            // Se o ficheiro não existir, o ecrã ficará preto/bloqueado.
            startLevelVideo('imagens/nivel1_conclusao.mp4', 3);

        } else {
            // Se o vídeo falhar ou terminar sem evento, desenha o botão de next level
            drawNextLevelScreen();
        }
    }

    // 4. FASE DE FALHA (Retry Screen)
    if (nivel1Phase === 3) {
        drawRetryScreen();
    }
}

function checkNivel1Click() {
    // 1. Retry Screen
    if (nivel1Phase === 3) {
        const xButton = width / 2;
        const yButton = height / 2 + 100;
        const wButton = 150;
        const hButton = 50;

        if (mouseX > xButton - wButton / 2 && mouseX < xButton + wButton / 2 &&
            mouseY > yButton - hButton / 2 && mouseY < yButton + hButton / 2) {
            nivel1Phase = 1; // Reinicia Minigame
            return true;
        }
    }

    // 2. Next Level Screen (Caso o vídeo não tenha feito a transição automática)
    if (nivel1Phase === 2 && !isVideoPlaying) {
        const xButton = width / 2;
        const yButton = height / 2 + 100;
        const wButton = 150;
        const hButton = 50;

        if (mouseX > xButton - wButton / 2 && mouseX < xButton + wButton / 2 &&
            mouseY > yButton - hButton / 2 && mouseY < yButton + hButton / 2) {
            gameState = 3; // Vai para Nível 2
            return true;
        }
    }

    // 3. Simulação do Minigame (REMOVER DEPOIS)
    if (nivel1Phase === 1) {
        // Lógica temporária: Clique alterna entre ganhar e perder
        if (minigameSuccess) {
            nivel1Phase = 2; // Ganhou
            minigameSuccess = false;
        } else {
            nivel1Phase = 3; // Perdeu
            minigameSuccess = true;
        }
        return true;
    }

    return false;
}

// --- FUNÇÕES AUXILIARES DE DESENHO ---

function drawRetryScreen() {
    background(0);

    if (inverseTexture) {
        imageMode(CORNER);
        image(inverseTexture, 0, 0, width, height);
    }
    fill(0);
    textAlign(CENTER, CENTER);

    fill(255, 0, 0);
    textSize(80);
    text("OOPS........TRY AGAIN", width / 2, height / 2 - 120 + 60);

    const xButton = width / 2;
    const yButton = height / 2 + 100;
    const wButton = 150;
    const hButton = 50;

    fill(0);
    rect(xButton, yButton, wButton, hButton);

    fill(255);
    textSize(30);

    push();
    translate(xButton - 50, yButton);
    noStroke();
    triangle(-10, -10, -10, 10, 5, 0);
    pop();

    text("RETRY", xButton + 20, yButton);
}

function drawNextLevelScreen() {
    // Fundo simples caso o vídeo não carregue
    background(255);
    fill(0);
    textAlign(CENTER, CENTER);

    fill(255, 0, 0);
    textSize(80);
    text("NEXT LEVEL", width / 2, height / 2 - 120 + 60);

    const xButton = width / 2;
    const yButton = height / 2 + 100;
    const wButton = 150;
    const hButton = 50;

    fill(0);
    rect(xButton, yButton, wButton, hButton);

    fill(255);
    textSize(30);

    push();
    translate(xButton - 50, yButton);
    noStroke();
    triangle(-10, -10, -10, 10, 5, 0);
    pop();
    text("GO", xButton + 20, yButton);
}