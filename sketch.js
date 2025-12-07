// Estados do Jogo
let gameState = 0;      // 0: Menu | 1: Seleção de Níveis | 2: Nível 1 | 3: Nível 2
let nivel1Phase = 0;    // 0: Intro | 1: Jogo | 2: Conclusão | 3: Falha

// Assets
let minhaFonte;
let textureBackground;
let inverseTexture;

// Variável Global de Vídeo
let nivelVideo;

// Áudio
let soundVolume = 0.5;
let isDraggingVolume = false;

// Controle de Vídeo
let isVideoPlaying = false;

// Layout
const AF_CENTRO = 140;
const SLIDER_LENGTH = 100;
let BTN_VOLTAR;

// Variáveis Nível 1
let circleX, circleY;

// Assets do Minigame Nível 1
let backgroundMiniGame1;
let imgWhiskey, imgSoda, imgIceBag, imgIceCube;

function setup() {
  // CRUCIAL: Cria o canvas do tamanho exato da janela
  createCanvas(windowWidth, windowHeight);

  BTN_VOLTAR = { x: width - 80, y: 50, w: 100, h: 40 };
  textureBackground = loadImage('imagens/textura-de-papel-branco2.png');
  inverseTexture = loadImage('textura-de-papel-branco-inverso.png');
  minhaFonte = loadFont('font/Pinkend.ttf');

  //nivel1
  backgroundMiniGame1= loadImage('imagens/minijogo.png');
  imgWhiskey = loadImage('imagens/whiskey.png');
  imgSoda = loadImage('imagens/soda.png');
  imgIceBag = loadImage('imagens/sacoGelo.png');
  imgIceCube = loadImage('imagens/gelo.png');

  rectMode(CENTER);
  imageMode(CORNER);
  textFont(minhaFonte);

  circleX = width / 2;
  circleY = height / 2;
}

function draw() {
  background(255);

  // Desenha o fundo esticado para cobrir toda a janela
  if (textureBackground) {
    image(textureBackground, 0, 0, width, height);
  }

  // Prioridade para o Vídeo (desenha por cima de tudo)
  if (isVideoPlaying) {
    drawLevelVideo();
    return;
  }

  // Gerenciador de Telas
  switch (gameState) {
    case 0:
      drawMenu();
      break;
    case 1:
      drawNiveis();
      break;
    case 2: //nivel1
      drawNivel1();
      drawBtnVoltar();
      break;
    default:
      if (gameState >= 3) {
        drawNivelPlaceholder(gameState);
        drawBtnVoltar();
      }
      break;
  }
}

// --- CONTROLES E INPUTS ---

function mousePressed() {
  if (isVideoPlaying) {
    handleVideoSkip();
    return;
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
      if (!checkNiveisClick()) checkVolumeClick();
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

// Redimensiona o canvas se o usuário mudar o tamanho da janela
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Se houver vídeo, ajusta o tamanho dele também
  if (nivelVideo) {
    nivelVideo.size(width, height);
  }
}

// --- FUNÇÕES AUXILIARES ---

function isMouseOverVoltar() {
  return (mouseX > BTN_VOLTAR.x - BTN_VOLTAR.w / 2 &&
      mouseX < BTN_VOLTAR.x + BTN_VOLTAR.w / 2 &&
      mouseY > BTN_VOLTAR.y - BTN_VOLTAR.h / 2 &&
      mouseY < BTN_VOLTAR.y + BTN_VOLTAR.h / 2);
}

function drawBtnVoltar() {
  fill(100);
  noStroke();
  rect(BTN_VOLTAR.x, BTN_VOLTAR.y, BTN_VOLTAR.w, BTN_VOLTAR.h);

  fill(255);
  textSize(16);
  textAlign(CENTER, CENTER);
  text("Voltar", BTN_VOLTAR.x, BTN_VOLTAR.y);
}

function goBackToMap() {
  if (nivelVideo) {
    nivelVideo.stop();
    nivelVideo.remove();
    nivelVideo = null;
    isVideoPlaying = false;
  }
  gameState = 1;
  nivel1Phase = 0;
}

function handleVideoSkip() {
  // Lógica de Pular específica do Nível 1
  if (gameState === 2) {
    if (nivel1Phase === 0) {
      forceSkipVideo(() => { nivel1Phase = 1; }); // Pula Intro -> Jogo
    } else if (nivel1Phase === 2) {
      forceSkipVideo(() => { gameState = 3; });   // Pula Conclusão -> Nível 2
    }
  }
}

function drawNivelPlaceholder(nivelNum, imagemDeFundo) {

  image(imagemDeFundo, 0, 0, width, height);


  // --- TEXTO ---
  fill(0); // Cor do texto (Preto)
  noStroke();
  textAlign(CENTER, CENTER);

  // Dica: Se a imagem for escura, mude o fill para 255 (branco)
  textSize(32);
  text(`level ${nivelNum}`, width / 2, height / 10);

}
