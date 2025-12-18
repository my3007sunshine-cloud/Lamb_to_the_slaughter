// =================================================================
// SKETCH.JS - MAIN FILE
// =================================================================

// Game States
let gameState = 0;      // 0: Menu | 1: Level Select | 2: Level 1 | 3: Level 2 | 4: Level 3 | 5: Level 4 | 6: Level 5
let nivel1Phase = 0;    // 0: Intro | 1: Game | 2: Conclusion | 3: Fail | 4: Next Level
let nivel2Phase = 0;
let nivel3Phase = 0;
let nivel4Phase = 0;
let nivel5Phase = 0;

// Global Assets
let minhaFonte;
let textureBackground;
let inverseTexture;

// Global Video Variable
let nivelVideo;

// Global Interaction Variables
let heldItem = null;        // For Level 2
let nivel3DragItem = null;  // For Level 3
let currentErrorMessage = "Try Again"; 

// Audio
let soundVolume = 0.5;
let isDraggingVolume = false;

// Video Control
let isVideoPlaying = false;

// Layout
const AF_CENTRO = 140;
const SLIDER_LENGTH = 100;
let BTN_VOLTAR;

// Assets Level 1
let backgroundMiniGame1;
let imgWhiskey, imgSoda, imgIceBag, imgIceCube, imgcopo;

// Assets Level 2
let backgroundMiniGame2; 
let imgPernil, imgFrango, imgVegetables, imgGelo;

// Assets Level 3
let backgroundMiniGame3;
let imgTacaAberta, imgTacaFechada;

// Level 4: Arrays for smiles
let smileImages = []; 
let smileBackgrounds = []; 

function setup() {
  createCanvas(windowWidth, windowHeight);

  BTN_VOLTAR = { x: width - 80, y: 50, w: 100, h: 40 };
  
  // Image Loading with error handling
  try {
    textureBackground = loadImage('imagens/textura-de-papel-branco2.png');
    inverseTexture = loadImage('imagens/textura-de-papel-branco inverso.png');
    minhaFonte = loadFont('font/Pinkend.ttf');

    // Level 1
    backgroundMiniGame1= loadImage('imagens/minijogo.png');
    imgWhiskey = loadImage('imagens/whiskey.png');
    imgSoda = loadImage('imagens/soda.png');
    imgIceBag = loadImage('imagens/sacoGelo.png');
    imgIceCube = loadImage('imagens/gelo.png');
    imgcopo = loadImage('imagens/copo2.png');

    // Level 2
    backgroundMiniGame2 = loadImage('imagens/freezer.png');
    imgPernil = loadImage('imagens/lamb.png');       
    imgFrango = loadImage('imagens/frango.png');
    imgVegetables = loadImage('imagens/vegetables.png');
    imgGelo = loadImage('imagens/gelo.png'); 

    // Level 3
    backgroundMiniGame3 = loadImage('imagens/miniGame3.png');
    imgTacaAberta = loadImage('imagens/taça aberta.png');
    imgTacaFechada = loadImage('imagens/taça fechada.png');
    
    // Level 4: Load 15 Smiles
    for (let i = 1; i <= 15; i++) {
        let img = loadImage(`imagens/sorriso${i}.png`); 
        smileImages.push(img);
        let bg = loadImage(`imagens/background_sorriso${i}.png`);
        smileBackgrounds.push(bg);
    }
    
  } catch (e) {
    console.log("Error loading images:", e);
  }

  rectMode(CENTER);
  imageMode(CORNER);
  
  if(minhaFonte) textFont(minhaFonte);
}

function draw() {
  if (windowWidth < 1200) {
        background(0); // Black Background
        
        // Text Config
        fill(255); 
        noStroke();
        textAlign(CENTER, CENTER);
        
        // Main Message
        textSize(30);
        textStyle(BOLD);
        text("SCREEN TOO SMALL", width / 2, height / 2 - 40);
        
        // Instructions
        textSize(20);
        textStyle(NORMAL);
        text("This game was designed for PC.", width / 2, height / 2 + 10);
        text("Please maximize the window or use a larger monitor.", width / 2, height / 2 + 40);
        
        // Size Indicator
        fill(150);
        textSize(16);
        text(`Current Width: ${windowWidth}px (Min: 1200px)`, width / 2, height / 2 + 90);
        
        return; // Stops the game loop
    }
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
    case 2: // Level 1
      drawNivel1();
      drawBtnVoltar();
      break;
    case 3: // Level 2
      drawNivel2();
      drawBtnVoltar();
      break;
    case 4: // Level 3
      drawNivel3(); 
      drawBtnVoltar();
      break;
    case 5: // Level 4
      drawNivel4();
      drawBtnVoltar();
      break;
    case 6: // Level 5
      drawNivel5();
      drawBtnVoltar();
      break;
    default:
      drawMenu();
      break;
  }
}

// --- CONTROLS AND INPUTS ---

function mousePressed() {
  if (isVideoPlaying) {
    handleVideoSkip();
    return;
  }

  // Check Back Button
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
  // Menu Volume
  if (gameState === 1 && isDraggingVolume) {
    updateVolume();
  }

  // --- LEVEL 2 DRAG ---
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

  // --- LEVEL 3 DRAG ---
  if (gameState === 4 && nivel3DragItem) {
      nivel3DragItem.x = mouseX;
      nivel3DragItem.y = mouseY;
  }
}

function mouseReleased() {
  isDraggingVolume = false;
  
  // Level 2 Drop
  if (gameState === 3) {
      heldItem = null;
  }

  // Level 3 Drop
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
  
  // Reset positions if needed
  if (gameState === 2) setupNivel1();
  if (gameState === 3) setupNivel2();
  if (gameState === 4) setupNivel3();
  if (gameState === 5) setupNivel4(); 
  if (gameState === 6) setupNivel5();
}

// --- HELPER FUNCTIONS ---

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
  // Reset phases
  nivel1Phase = 0; 
  nivel2Phase = 0;
  nivel3Phase = 0;
  nivel4Phase = 0;
  nivel5Phase = 0;
  heldItem = null;
  nivel3DragItem = null; 
}

function handleVideoSkip() {
  // --- LEVEL 1 (GameState 2) ---
  if (gameState === 2) {
    if (nivel1Phase === 0) {
      forceSkipVideo(() => { setupNivel1(); nivel1Phase = 1; }); 
    } else if (nivel1Phase === 2) {
      forceSkipVideo(() => { gameState = 2; nivel1Phase = 4; });
    }
  }

  // --- LEVEL 2 (GameState 3) ---
  else if (gameState === 3) {
    if (nivel2Phase === 0) {
      forceSkipVideo(() => { setupNivel2(); nivel2Phase = 1; });
    } 
    else if (nivel2Phase === 2) {
      forceSkipVideo(() => { gameState = 3; nivel2Phase = 4; });
    }
  }
  
  // --- LEVEL 3 (GameState 4) ---
  else if (gameState === 4) {
    if (nivel3Phase === 0) {
        forceSkipVideo(() => { setupNivel3(); nivel3Phase = 1; });
    }
    else if (nivel3Phase === 2) {
        forceSkipVideo(() => { nivel3Phase = 4; });
    }
  }

// --- LEVEL 4 (GameState 5) ---
else if (gameState === 5) {
    // Fase 2 é o vídeo. Se clicar, salta para a Fase 4 (Next Level)
    if (nivel4Phase === 2) {
        forceSkipVideo(() => { 
            nivel4Phase = 4; 
        });
    }
  }

  // --- LEVEL 5 (GameState 6) ---
  else if (gameState === 6) {
      if (nivel5Phase === 0) {
          forceSkipVideo(() => { 
              setupNivel5(); 
              nivel5Phase = 1; 
          });
      }
      else if (nivel5Phase === 1) {
          if (n5_subState === 0) {
             forceSkipVideo(() => { n5_subState = 1; }); 
          } 
          else if (n5_subState === 2) {
             forceSkipVideo(() => { n5_subState = 3; }); 
          }
      }
  }
}

// Placeholders
function drawLevelVideo() {
    // Video player implementation
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
    fill(200, 0, 0); rect(width/2, height/2 + 100, 200, 60, 10);
    fill(255); textSize(25); text("CONTINUE >>", width/2, height/2 + 100);
}