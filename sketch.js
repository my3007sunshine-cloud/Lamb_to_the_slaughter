// =================================================================
// SKETCH.JS - ARQUIVO PRINCIPAL
// =================================================================

// Estados do Jogo
let gameState = 0;      // 0: Menu | 1: Seleção de Níveis | 2: Nível 1 | 3: Nível 2 | 4: Nível 3 | 5: Nível 4 | 6: Nível 5
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
let heldItem = null;        // Para o Nível 2
let nivel3DragItem = null;  // Para o Nível 3 (NOVO)
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

// Assets do Minigame Nível 3 (NOVO)
let backgroundMiniGame3;
let imgTacaAberta, imgTacaFechada;

// NÍVEL 4: Arrays para armazenar as 15 imagens de sorriso e seus fundos
let smileImages = []; 
let smileBackgrounds = []; 

function setup() {
  createCanvas(windowWidth, windowHeight);

  BTN_VOLTAR = { x: width - 80, y: 50, w: 100, h: 40 };
  
  // Carregamento de Imagens com tratamento de erro
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

    // Nivel 3 (NOVO)
    backgroundMiniGame3 = loadImage('imagens/miniGame3.png');
    imgTacaAberta = loadImage('imagens/taça aberta.png');
    imgTacaFechada = loadImage('imagens/taça fechada.png');
    // imgPernil já foi carregado no nível 2, reutilizamos ele.
    
    // NÍVEL 4: Carregamento dos 15 Sorrisos e Fundos
    for (let i = 1; i <= 15; i++) {
        let img = loadImage(`imagens/sorriso${i}.png`); 
        smileImages.push(img);
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
      checkNivel3Click(); // Nível 3
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
          if (typeof freezerItems !== 'undefined' && Array.isArray(freezerItems)) {
              let item = freezerItems.find(i => i.id === heldItem);
              if (item) {
                  item.x = mouseX - item.w / 2;
                  item.y = mouseY - item.h / 2;
              }
          }
      }
  }

  // --- LÓGICA DE ARRASTAR DO NÍVEL 3 (NOVO) ---
  if (gameState === 4 && nivel3DragItem) {
      // Atualiza a posição do objeto que está sendo arrastado (l3_pernil)
      nivel3DragItem.x = mouseX;
      nivel3DragItem.y = mouseY;
  }
}

function mouseReleased() {
  isDraggingVolume = false;
  
  // Soltar item no Nível 2
  if (gameState === 3) {
      heldItem = null;
  }

  // --- SOLTAR ITEM NO NÍVEL 3 (NOVO) ---
  if (gameState === 4 && typeof handleNivel3Drop === 'function') {
      handleNivel3Drop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  BTN_VOLTAR = { x: width - 80, y: 50, w: 100, h: 40 }; 
  
  if (nivelVideo) {
    nivelVideo.size(width, height);
  }
  
  // Reinicia posições se necessário
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
  // Reseta fases ao sair
  nivel1Phase = 0; 
  nivel2Phase = 0;
  nivel3Phase = 0;
  nivel4Phase = 0;
  nivel5Phase = 0;
  heldItem = null;
  nivel3DragItem = null; // Reseta arraste do nível 3
}

function handleVideoSkip() {
  // --- NÍVEL 1 (GameState 2) ---
  if (gameState === 2) {
    if (nivel1Phase === 0) {
      forceSkipVideo(() => { setupNivel1(); nivel1Phase = 1; }); 
    } else if (nivel1Phase === 2) {
      forceSkipVideo(() => { gameState = 2; nivel1Phase = 4; });
    }
  }

  // --- NÍVEL 2 (GameState 3) ---
  else if (gameState === 3) {
    if (nivel2Phase === 0) {
      // Pular Intro Vídeo -> Vai para o Gameplay
      forceSkipVideo(() => { setupNivel2(); nivel2Phase = 1; });
    } 
    else if (nivel2Phase === 2) {
      // Pular Outro Vídeo -> Vai para a tela de Next Level
      forceSkipVideo(() => { gameState = 3; nivel2Phase = 4; });
    }
  }
  
  // (Futuramente podes adicionar aqui os blocos para gameState 4, 5, etc.)
}

// Placeholders Genéricos
function drawLevelVideo() {
    // Implementação do seu vídeo player aqui
}
function forceSkipVideo(callback) {
    if(callback) callback();
    isVideoPlaying = false;
}
function drawVideoPlaceholder(titulo) {
    background(0);
    fill(255); textAlign(CENTER, CENTER); textSize(50);
    text(titulo, width/2, height/2 - 50);
    textSize(20); fill(150);
    text("(Video Missing)", width/2, height/2);
    // Botão Continuar Simulado
    fill(200, 0, 0); rect(width/2, height/2 + 100, 200, 60, 10);
    fill(255); textSize(25); text("CONTINUE >>", width/2, height/2 + 100);
}