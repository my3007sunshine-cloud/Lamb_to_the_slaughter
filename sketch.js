// Estados do Jogo
let gameState = 0;      // 0: Menu | 1: Seleção de Níveis | 2: Nível 1 | 3: Nível 2 | 4,5,6: Outros
let nivel1Phase = 0;    // 0: Intro | 1: Jogo | 2: Conclusão | 3: Falha | 4: Próximo Nível
let nivel2Phase = 0;
let nivel3Phase = 0;
let nivel4Phase = 0;
let nivel5Phase = 0;

// Assets Globais
let minhaFonte;
let textureBackground;
let inverseTexture;

// Variável Global de Vídeo
let nivelVideo;

// Variáveis Globais de Interação
let heldItem = null;
let currentErrorMessage = "Try Again"; 

// Áudio
let soundVolume = 0.5;
let isDraggingVolume = false;

// Controle de Vídeo
let isVideoPlaying = false;

// Layout
const AF_CENTRO = 140;
const SLIDER_LENGTH = 100;
let BTN_VOLTAR;

// Assets do Minigame Nível 1
let backgroundMiniGame1;
let imgWhiskey, imgSoda, imgIceBag, imgIceCube, imgcopo;

// Assets do Minigame Nível 2
let backgroundMiniGame2; 
let imgPernil, imgFrango, imgVegetables, imgGelo;

// NÍVEL 4: Arrays para armazenar as 15 imagens de sorriso e seus fundos
let smileImages = []; 
let smileBackgrounds = []; 

function setup() {
  createCanvas(windowWidth, windowHeight);

  BTN_VOLTAR = { x: width - 80, y: 50, w: 100, h: 40 };
  
  // Carregamento de Imagens com tratamento de erro simples (fallback)
  try {
    textureBackground = loadImage('imagens/textura-de-papel-branco2.png');
    inverseTexture = loadImage('imagens/textura-de-papel-branco inverso.png');
    minhaFonte = loadFont('font/Pinkend.ttf');

    // Nivel 1
    backgroundMiniGame1= loadImage('imagens/minijogo.png');
    imgWhiskey = loadImage('imagens/whiskey.png');
    imgSoda = loadImage('imagens/soda.png');
    imgIceBag = loadImage('imagens/sacoGelo.png');
    imgIceCube = loadImage('imagens/gelo.png');
    imgcopo = loadImage('imagens/copo2.png');

    // Nivel 2
    backgroundMiniGame2 = loadImage('imagens/freezer.png');
    imgPernil = loadImage('imagens/lamb.png');       
    imgFrango = loadImage('imagens/frango.png');
    imgVegetables = loadImage('imagens/vegetables.png');
    imgGelo = loadImage('imagens/gelo.png'); 
    
    // NÍVEL 4: Carregamento dos 15 Sorrisos e Fundos
    for (let i = 1; i <= 15; i++) {
        // Assume que o nome é 'imagens/sorrisoX.png'
        let img = loadImage(`imagens/sorriso${i}.png`); 
        smileImages.push(img);
        
        // Assume que o nome é 'imagens/background_sorrisoX.png'
        let bg = loadImage(`imagens/background_sorriso${i}.png`);
        smileBackgrounds.push(bg);
    }
    
  } catch (e) {
    console.log("Erro ao carregar imagens:", e);
  }

  rectMode(CENTER);
  imageMode(CORNER);
  
  if(minhaFonte) textFont(minhaFonte);
}

function draw() {
  background(255);

  if (textureBackground) {
    image(textureBackground, 0, 0, width, height);
  }

  if (isVideoPlaying) {
    drawLevelVideo();
    return;
  }

  switch (gameState) {
    case 0:
      drawMenu();
      break;
    case 1:
      drawNiveis();
      break;
    case 2: // Nível 1
      drawNivel1();
      drawBtnVoltar();
      break;
    case 3: // Nível 2
      drawNivel2();
      drawBtnVoltar();
      break;
    case 4: // Nível 3
      drawNivel3(); 
      drawBtnVoltar();
      break;
    case 5: // Nível 4
      drawNivel4();
      drawBtnVoltar();
      break;
    case 6: // Nível 5
      drawNivel5();
      drawBtnVoltar();
      break;
    default:
      drawMenu();
      break;
  }
}

// --- CONTROLES E INPUTS ---

function mousePressed() {
  if (isVideoPlaying) {
    handleVideoSkip();
    return;
  }

  // Verifica clique no botão voltar (apenas se estiver dentro de um nível)
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
    case 3:
      checkNivel2Click();
      break;
    case 4:
      checkNivel3Click(); 
      break;
    case 5:
      checkNivel4Click(); 
      break;
    case 6:
      checkNivel5Click(); 
      break;
  }
}

function mouseDragged() {
  // Volume no Menu
  if (gameState === 1 && isDraggingVolume) {
    updateVolume();
  }

  // --- LÓGICA DE ARRASTAR DO NÍVEL 2 ---
  if (gameState === 3) {
      if (heldItem) {
          // Verifica se freezerItems existe e foi definido no nivel2.js
          if (typeof freezerItems !== 'undefined' && Array.isArray(freezerItems)) {
              let item = freezerItems.find(i => i.id === heldItem);
              if (item) {
                  item.x = mouseX - item.w / 2;
                  item.y = mouseY - item.h / 2;
              }
          }
      }
  }
}

function mouseReleased() {
  isDraggingVolume = false;
  
  // Soltar item no Nível 2 (Drag and Drop)
  if (gameState === 3) {
      heldItem = null;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  BTN_VOLTAR = { x: width - 80, y: 50, w: 100, h: 40 }; 
  
  if (nivelVideo) {
    nivelVideo.size(width, height);
  }
  
  // Reinicia posições se necessário (opcional)
  if (gameState === 2) setupNivel1();
  if (gameState === 3) setupNivel2();
  if (gameState === 4) setupNivel3();
  if (gameState === 5) setupNivel4(); 
  if (gameState === 6) setupNivel5();
}

// --- FUNÇÕES AUXILIARES ---

function isMouseOverVoltar() {
  return (mouseX > BTN_VOLTAR.x - BTN_VOLTAR.w / 2 &&
      mouseX < BTN_VOLTAR.x + BTN_VOLTAR.w / 2 &&
      mouseY > BTN_VOLTAR.y - BTN_VOLTAR.h / 2 &&
      mouseY < BTN_VOLTAR.y + BTN_VOLTAR.h / 2);
}

function drawBtnVoltar() {
  push();
  fill(0, 0, 0, 150);
  noStroke();
  rectMode(CENTER);
  rect(BTN_VOLTAR.x, BTN_VOLTAR.y, BTN_VOLTAR.w, BTN_VOLTAR.h, 5);

  fill(255);
  textSize(16);
  textAlign(CENTER, CENTER);
  text("BACK", BTN_VOLTAR.x, BTN_VOLTAR.y); 
  pop();
}

function goBackToMap() {
  if (nivelVideo) {
    stopAndCleanVideo();
  }
  gameState = 1;
  // Reseta fases dos níveis ao sair
  nivel1Phase = 0; 
  nivel2Phase = 0;
  nivel3Phase = 0;
  nivel4Phase = 0;
  nivel5Phase = 0;
  heldItem = null;
}

function handleVideoSkip() {
  // Lógica de Pular específica do Nível 1
  if (gameState === 2) {
    if (nivel1Phase === 0) {
      forceSkipVideo(() => { nivel1Phase = 1; }); // Pula Intro -> Jogo
    } else if (nivel1Phase === 2) {
      // Pula Conclusão -> Tela de Próximo Nível (Phase 4)
      forceSkipVideo(() => {
        gameState = 2; 
        nivel1Phase = 4;
      });
    }
  }
}

function drawNivelPlaceholder(nivelNum, imagemDeFundo) {
  if (imagemDeFundo) image(imagemDeFundo, 0, 0, width, height);

  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(32);
  text(`LEVEL ${nivelNum} - COMING SOON`, width / 2, height / 2);
}

function drawVideoPlaceholder(titulo) {
    // 1. Fundo Preto
    background(0);

    // 2. Texto do Título
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(50);
    text(titulo, width / 2, height / 2 - 50);
    
    textSize(20);
    fill(150);
    text("(Video Scene Missing)", width / 2, height / 2);

    // 3. Botão Continuar
    const btnX = width / 2;
    const btnY = height / 2 + 100;
    const btnW = 200;
    const btnH = 60;

    rectMode(CENTER);
    fill(200, 0, 0); // Vermelho
    rect(btnX, btnY, btnW, btnH, 10);

    fill(255); // Texto Branco
    textSize(25);
    text("CONTINUE >>", btnX, btnY);
}

function checkPlaceholderClick() {
    const btnX = width / 2;
    const btnY = height / 2 + 100;
    const btnW = 200;
    const btnH = 60;

    if (mouseX > btnX - btnW/2 && mouseX < btnX + btnW/2 &&
        mouseY > btnY - btnH/2 && mouseY < btnY + btnH/2) {
        return true;
    }
    return false;
}