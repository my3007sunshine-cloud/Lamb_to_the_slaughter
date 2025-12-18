// =================================================================
// QUIZ CONTROL - SISTEMA GLOBAL DE PERGUNTAS (FUNDO PRETO)
// =================================================================

let globalQuiz = {
    active: false,
    questions: [],     // Array de perguntas
    currentIdx: 0,     // Índice atual
    callback: null,    // Ação ao terminar o quiz (iniciar o minigame)
    feedbackMsg: ""    // Mensagem de erro temporária
};

// Configurações Visuais (Estilo Noir)
const QUIZ_BTN_W = 700;
const QUIZ_BTN_H = 65;
const QUIZ_START_Y = 320;
const QUIZ_SPACING = 90;

/**
 * Inicia o Quiz
 * @param {Array} questionsArray - Lista de objetos {title, query, options, correct}
 * @param {Function} onCompleteAction - Função para rodar quando o quiz acabar
 */
function startQuiz(questionsArray, onCompleteAction) {
    globalQuiz.questions = questionsArray;
    globalQuiz.currentIdx = 0;
    globalQuiz.callback = onCompleteAction;
    globalQuiz.active = true;
    globalQuiz.feedbackMsg = "";
    console.log("Quiz Iniciado com " + questionsArray.length + " perguntas.");
}

function drawActiveQuiz() {
    if (!globalQuiz.active) return;

    // 1. Fundo Preto Absoluto
    background(0);

    let q = globalQuiz.questions[globalQuiz.currentIdx];

    // 2. Título da Cena (Vermelho)
    textAlign(CENTER, CENTER);
    if (q.title) {
        fill(200, 0, 0); 
        textSize(24);
        textStyle(BOLD);
        text(q.title.toUpperCase(), width / 2, 80);
    }

    // 3. Pergunta (Branco)
    fill(255);
    noStroke();
    textSize(28);
    textStyle(NORMAL);
    // Quebra de linha automática se o texto for muito longo
    text(q.query, width / 2, 160);

    // 4. Feedback de Erro (Se houver)
    if (globalQuiz.feedbackMsg !== "") {
        fill(200, 0, 0);
        textSize(18);
        textStyle(ITALIC);
        text(globalQuiz.feedbackMsg, width / 2, 240);
    }

    // 5. Botões de Resposta
    textSize(20);
    textStyle(BOLD);
    rectMode(CENTER);

    for (let i = 0; i < q.options.length; i++) {
        let btnX = width / 2;
        let btnY = QUIZ_START_Y + (i * QUIZ_SPACING);

        // Verifica Hover (Mouse em cima)
        let isHover = (mouseX > btnX - QUIZ_BTN_W / 2 && mouseX < btnX + QUIZ_BTN_W / 2 &&
                       mouseY > btnY - QUIZ_BTN_H / 2 && mouseY < btnY + QUIZ_BTN_H / 2);

        if (isHover) {
            fill(180, 0, 0); // Vermelho Sangue no Hover
            stroke(255);
            strokeWeight(2);
        } else {
            fill(30);        // Cinza muito escuro
            stroke(100);
            strokeWeight(1);
        }
        
        rect(btnX, btnY, QUIZ_BTN_W, QUIZ_BTN_H, 10);

        // Texto da Opção
        fill(255);
        noStroke();
        text(q.options[i], btnX, btnY);
    }
    
    // Indicador de Progresso
    fill(100);
    textSize(14);
    text(`QUESTION ${globalQuiz.currentIdx + 1} OF ${globalQuiz.questions.length}`, width/2, height - 30);
}

function checkActiveQuizClick() {
    if (!globalQuiz.active) return false;

    let q = globalQuiz.questions[globalQuiz.currentIdx];

    for (let i = 0; i < q.options.length; i++) {
        let btnX = width / 2;
        let btnY = QUIZ_START_Y + (i * QUIZ_SPACING);

        if (mouseX > btnX - QUIZ_BTN_W / 2 && mouseX < btnX + QUIZ_BTN_W / 2 &&
            mouseY > btnY - QUIZ_BTN_H / 2 && mouseY < btnY + QUIZ_BTN_H / 2) {
            
            // Verifica se acertou
            if (i === q.correct) {
                // ACERTOU
                globalQuiz.currentIdx++;
                globalQuiz.feedbackMsg = "";
                
                // Se acabaram as perguntas, finaliza
                if (globalQuiz.currentIdx >= globalQuiz.questions.length) {
                    endQuiz();
                }
            } else {
                // ERROU
                globalQuiz.feedbackMsg = "Incorrect choice. Try again.";
            }
            return true; // Clique consumido pelo quiz
        }
    }
    return false;
}

function endQuiz() {
    globalQuiz.active = false;
    if (globalQuiz.callback) {
        globalQuiz.callback();
    }
}