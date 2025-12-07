// Estados do Jogo
let gameState = 0;      // 0: Menu | 1: Seleção de Níveis | 2: Nível 1 | 3-7: Outros
let nivel1Phase = 0;    // 0: Intro | 1: Jogo | 2: Conclusão

// Assets (Recursos)
let minhaFonte;
let textureBackground;
let inverseTexture;
let nivel1Video;         // Objeto de vídeo

// Áudio
let soundVolume = 0.5;
let isDraggingVolume = false;

// Controle de Vídeo
let isVideoPlaying = false;

// Layout e Constantes
const AF_CENTRO = 140;
const SLIDER_LENGTH = 100;
const BTN_VOLTAR = { x: 100, y: 60, w: 100, h: 40 };

// Variáveis Nível 1 (Exemplo)
let circleX, circleY;


function setup() {
  createCanvas(windowWidth, windowHeight);

  textureBackground = loadImage('imagens/textura-de-papel-branco2.png');
  inverseTexture = loadImage('textura-de-papel-branco-inverso.png');
  minhaFonte = loadFont('font/Pinkend.ttf');
  nivel1Video = createVideo(['imagens/nivel1.mp4'])

  // Configurações iniciais
  rectMode(CENTER);
  imageMode(CORNER); // Garante que o fundo desenha do canto 0,0
  textFont(minhaFonte);

  // Centralizar elementos iniciais
  circleX = width / 2;
  circleY = height / 2;
}



// --- 5. DRAW (O CÉREBRO DO JOGO) ---
function draw() {
  // A. Desenha o Fundo (Sempre)
  background(255);
  image(textureBackground, 0, 0, width, height);

  // B. Verifica se há Vídeo rodando (Prioridade Máxima)
  if (isVideoPlaying) {
    drawLevelVideo(); // Assume que esta função existe no teu código
    return; // Interrompe o draw aqui para não desenhar mais nada
  }

  switch (gameState) {
    case 0: // Menu Principal
      drawMenu();
      break;

    case 1: // Seleção de Níveis
      drawNiveis();
      break;

    case 2: // Nível 1 (Círculo)
      drawNivel1();
      drawBtnVoltar(); // Botão voltar desenhado automaticamente
      break;

    default: // Níveis 3 a 7 (Genéricos/Placeholders)
      if (gameState >= 3 && gameState <= 7) {
        drawNivelPlaceholder(gameState);
        drawBtnVoltar();
      }
      break;
  }
}

function mousePressed() {
  // A. Lógica de Pular Vídeo
  if (isVideoPlaying) {
    handleVideoSkip();
    return; // Se clicou no vídeo, não faz mais nada
  }

  if (gameState >= 2 && isMouseOverVoltar()) {
    goBackToMap();
    return;
  }

  switch (gameState) {
    case 0:
      checkMenuClick();
      break;
    case 1:
      // Se não clicou num nível, verifica o volume
      if (!checkNiveisClick()) {
        checkVolumeClick();
      }
      break;
    case 2:
      checkNivel1Click();
      break;
  }
}

function mouseDragged() {
  if (gameState === 1 && isDraggingVolume) {
    updateVolume();
  }
}

function mouseReleased() {
  isDraggingVolume = false;
}

function isMouseOverVoltar() {
  return (mouseX > BTN_VOLTAR.x - BTN_VOLTAR.w / 2 &&
      mouseX < BTN_VOLTAR.x + BTN_VOLTAR.w / 2 &&
      mouseY > BTN_VOLTAR.y - BTN_VOLTAR.h / 2 &&
      mouseY < BTN_VOLTAR.y + BTN_VOLTAR.h / 2);
}

// Desenha o botão voltar
function drawBtnVoltar() {
  fill(100);
  noStroke();
  rect(BTN_VOLTAR.x, BTN_VOLTAR.y, BTN_VOLTAR.w, BTN_VOLTAR.h);

  fill(255);
  textSize(16);
  textAlign(CENTER, CENTER);
  text("Voltar", BTN_VOLTAR.x, BTN_VOLTAR.y);
}

// Ação de Voltar
function goBackToMap() {
  gameState = 1;
  nivel1Phase = 0; // Reseta fases internas se necessário
}

// Lógica centralizada para pular vídeos
function handleVideoSkip() {
  // Exemplo: Nível 1 (GameState 2)
  if (gameState === 2) {
    if (nivel1Phase === 0) { // Intro
      if (checkVideoSkipClick(2)) { // Verifica botão pular da intro
        nivel1Phase = 1; // Vai para o jogo
        // Aqui deverias parar o vídeo da intro
      }
    } else if (nivel1Phase === 2) { // Conclusão
      if (checkVideoSkipClick(3)) { // Verifica botão pular da conclusão
        // Acaba o nível
      }
    }
  }
}

// Placeholder para níveis ainda não criados
function drawNivelPlaceholder(nivelNum) {
  // Fundo semi-transparente
  fill(255, 255, 255, 200);
  noStroke();
  rect(width / 2, height / 2, width - 100, height - 100);

  fill(0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text(`Nível ${nivelNum}`, width / 2, height / 2 - 20);

  textSize(20);
  text("Em construção...", width / 2, height / 2 + 20);
}