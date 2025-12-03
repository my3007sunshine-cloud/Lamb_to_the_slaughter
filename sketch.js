// Variáveis de Estado do Jogo
// 0: Menu Inicial
// 1: Tela de Níveis
// 2: Nível 1 (e assim por diante)
let gameState = 0; 

// Variáveis de Imagem e Tamanho
let menuImg;
let niveisImg;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

// Variáveis de Áudio
let gameSound; // Variável para o objeto de som
let soundVolume = 0.5; // Começa a 50%
let isDraggingVolume = false; // Flag para arrastar o controle de volume

// Variáveis do Nível 1 (Círculo Móvel)
let circleX, circleY;
const circleRadius = 25;

function preload() {
  // Carrega as imagens do menu e níveis
  menuImg = loadImage('Menu inicial.png');
  niveisImg = loadImage('NÍVEIS.png');
  
  // Exemplo de carregamento de um som (necessita de um arquivo de áudio, e.g., 'musica.mp3')
  // Descomente e substitua 'musica.mp3' se tiver um arquivo de som.
  // if (typeof loadSound === 'function') {
  //   gameSound = loadSound('musica.mp3', soundLoaded);
  // }
}

// function soundLoaded() {
//   // Se o som carregar, configure e comece a tocar
//   if (gameSound) {
//     gameSound.setVolume(soundVolume);
//     gameSound.loop(); 
//   }
// }

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  // Inicializa a posição do círculo no Nível 1 no centro
  circleX = CANVAS_WIDTH / 2;
  circleY = CANVAS_HEIGHT / 2;
}

function draw() {
  if (gameState === 0) {
    drawMenu();
  } else if (gameState === 1) {
    drawNiveis();
  } else if (gameState === 2) {
    drawNivel1(); // Exemplo de nível com um círculo que se move
  } else if (gameState >= 3 && gameState <= 7) {
    drawNivelPlaceholder(gameState - 1); // Outros níveis
  }
}

// --- FUNÇÕES DE DESENHO DAS TELAS ---

function drawMenu() {
  image(menuImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawNiveis() {
  image(niveisImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  
  // --- Desenho do Círculo de Volume ---
  const soundX_Center = CANVAS_WIDTH - 200; // Centro horizontal da linha
  const soundY = CANVAS_HEIGHT - 100;
  const slider_Length = 100;
  
  // Linha de volume (Slider)
  stroke(0);
  strokeWeight(2);
  line(soundX_Center - slider_Length / 2, soundY, soundX_Center + slider_Length / 2, soundY);
  
  // Posição do círculo (handle) baseada no volume
  const volumeCircleX = map(soundVolume, 0, 1, soundX_Center - slider_Length / 2, soundX_Center + slider_Length / 2);
  
  fill(255, 0, 0); // Cor vermelha para o controle
  noStroke();
  ellipse(volumeCircleX, soundY, 20, 20);
}

function drawNivel1() {
  background(240, 240, 240);
  
  // Título e Botão Voltar
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(0);
  text("Nível 1 - Mova o Círculo", CANVAS_WIDTH / 2, 50);
  
  // Botão Voltar (na área do canto superior esquerdo)
  fill(100);
  rect(50, 40, 100, 40);
  fill(255);
  textSize(16);
  text("Voltar", 100, 60);

  // Círculo móvel
  fill(0, 150, 255);
  noStroke();
  ellipse(circleX, circleY, circleRadius * 2, circleRadius * 2);

  // Lógica de movimento do círculo (segue o mouse)
  if (mouseIsPressed && !isVoltarClick(mouseX, mouseY)) {
    circleX = mouseX;
    circleY = mouseY;
    // Limita o movimento à área de jogo
    circleX = constrain(circleX, circleRadius, CANVAS_WIDTH - circleRadius);
    circleY = constrain(circleY, circleRadius, CANVAS_HEIGHT - circleRadius);
  }
}

function drawNivelPlaceholder(nivelNum) {
  background(200, 255, 200);
  
  // Botão Voltar (Mesma posição que o Nível 1)
  fill(100);
  rect(50, 40, 100, 40);
  fill(255);
  textSize(16);
  textAlign(CENTER, CENTER);
  text("Voltar", 100, 60);

  // Conteúdo do Nível
  textSize(32);
  fill(0);
  text(`Você está no Nível ${nivelNum}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
}

// --- FUNÇÕES DE INTERAÇÃO DO MOUSE ---

function mousePressed() {
  if (gameState === 0) {
    checkMenuClick();
  } else if (gameState === 1) {
    if (!checkNiveisClick()) {
        // Se não clicou nos botões de nível, verifica o volume
        checkVolumeClick();
    }
  } else if (gameState >= 2 && gameState <= 7) {
    checkNivelVoltarClick();
  }
}

function mouseDragged() {
  if (gameState === 1 && isDraggingVolume) {
    updateVolume();
  }
}

function mouseReleased() {
  isDraggingVolume = false; // Para de arrastar o volume
}

function checkMenuClick() {
  // Hitbox do botão INICIAR (Estimado na imagem 'Menu inicial.png')
  const xButton = CANVAS_WIDTH / 2 - 100;
  const yButton = CANVAS_HEIGHT / 2 + 150;
  const wButton = 200;
  const hButton = 50;
  
  if (mouseX > xButton && mouseX < xButton + wButton &&
      mouseY > yButton && mouseY < yButton + hButton) {
    gameState = 1; // Muda para a tela de Níveis
  }
}

function checkNiveisClick() {
  // Coordenadas base dos botões na imagem 'NÍVEIS.png' (Estimativas)
  const x_start = CANVAS_WIDTH / 2 - 180;
  const y_start = CANVAS_HEIGHT / 2 - 120;
  const w_btn = 120;
  const h_btn = 60;
  const x_gap = 150;
  const y_gap = 100;
  
  // Mapeamento dos botões para o novo gameState (2=Nível 1, 3=Nível 2, etc.)
  const niveisMap = [
    {x: x_start, y: y_start, state: 2},           // [1]
    {x: x_start + x_gap, y: y_start, state: 3},   // [2]
    {x: x_start + x_gap * 2, y: y_start, state: 4}, // [3]
    {x: x_start, y: y_start + y_gap, state: 5},   // [4]
    {x: x_start + x_gap, y: y_start + y_gap, state: 6}, // [5]
    {x: x_start + x_gap * 2, y: y_start + y_gap, state: 7}  // [6]
  ];
  
  for (let i = 0; i < niveisMap.length; i++) {
    const btn = niveisMap[i];
    if (mouseX > btn.x && mouseX < btn.x + w_btn &&
        mouseY > btn.y && mouseY < btn.y + h_btn) {
      gameState = btn.state;
      return true; // Retorna verdadeiro se um nível foi clicado
    }
  }
  
  return false; // Retorna falso se nenhum nível foi clicado
}

function checkVolumeClick() {
  const soundX_Center = CANVAS_WIDTH - 200; 
  const soundY = CANVAS_HEIGHT - 100;
  const slider_Length = 100;
  const clickTolerance = 25; // Aumenta a área de clique para o círculo

  const soundAreaMinX = soundX_Center - slider_Length / 2 - clickTolerance;
  const soundAreaMaxX = soundX_Center + slider_Length / 2 + clickTolerance;
  const soundAreaMinY = soundY - clickTolerance;
  const soundAreaMaxY = soundY + clickTolerance;

  // Verifica se o clique está na área do slider de volume
  if (mouseX >= soundAreaMinX && mouseX <= soundAreaMaxX &&
      mouseY >= soundAreaMinY && mouseY <= soundAreaMaxY) {
    isDraggingVolume = true;
    updateVolume(); // Atualiza o volume imediatamente no clique
  }
}

function updateVolume() {
  const soundX_Center = CANVAS_WIDTH - 200; 
  const soundY = CANVAS_HEIGHT - 100;
  const slider_Length = 100;
  
  const soundAreaMinX = soundX_Center - slider_Length / 2;
  const soundAreaMaxX = soundX_Center + slider_Length / 2;

  // Calcula o novo volume baseado na posição X do mouse, limitado ao slider
  soundVolume = map(mouseX, soundAreaMinX, soundAreaMaxX, 0, 1);
  soundVolume = constrain(soundVolume, 0, 1); // Garante que esteja entre 0 e 1
  
  // Define o volume do som (se carregado)
  // if (gameSound && gameSound.isLoaded()) {
  //   gameSound.setVolume(soundVolume);
  // }
}

function isVoltarClick(x, y) {
    // Hitbox do botão Voltar
    return (x > 50 && x < 150 && y > 40 && y < 80);
}

function checkNivelVoltarClick() {
  if (isVoltarClick(mouseX, mouseY)) {
    gameState = 1; // Volta para a tela de Níveis
    // Reseta a posição do círculo ao sair do nível 1
    if (gameState === 2) {
      circleX = CANVAS_WIDTH / 2;
      circleY = CANVAS_HEIGHT / 2;
    }
  }
}