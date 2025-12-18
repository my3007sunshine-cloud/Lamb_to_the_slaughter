// =================================================================
// NIVEL 5 - O INTERROGATÓRIO
// =================================================================

// Estrutura de dados: Cada cena tem um par de vídeos (Intro e Feedback)
const n5_cenas = [
    {
        titulo: "Cena 1: A Chegada da Polícia",
        videoIntro: "imagens/Nivel5_cena1.mp4", 
        pergunta: "Patrick está morto. Os polícias entraram. O que deve fazer para parecer genuína?",
        opcoes: [
            "A. Ficar calma e apontar para o telefone.",
            "B. Gritar que o odeia e que foi um assassinato.",
            "C. Cair nos braços de Jack Noonan, chorando histericamente.",
            "D. Correr para a cozinha e apagar o forno."
        ],
        correta: 2, // C
        videoFeedback: "imagens/Nivel5_cena1f.mp4" 
    },
    {
        titulo: "Cena 2: O Que Dizer sobre a Carne",
        videoIntro: "imagens/Nivel5_cena2.mp4", 
        pergunta: "Perguntam sobre o assado no forno. Como justificar o álibi?",
        opcoes: [
            "A. Dizer que se esqueceu dele quando saiu.",
            "B. Dizer que ia cozinhar, mas Patrick não quis.",
            "C. Dizer que o pôs a assar para o jantar e foi buscar legumes.",
            "D. Dizer que iam jantar fora, tornando o assado irrelevante."
        ],
        correta: 2, // C
        videoFeedback: null // <--- SEM VÍDEO DE CONCLUSÃO AQUI
    },
    {
        titulo: "Cena 3: A Busca Pela Arma",
        videoIntro: "imagens/Nivel5_cena3.mp4", 
        pergunta: "Procuram algo de metal pesado (Spanner). Como desviar a atenção?",
        opcoes: [
            "A. Mencionar a perna de borrego congelada.",
            "B. Sugerir que olhem no lixo da cozinha.",
            "C. Dizer que talvez haja um spanner na garagem.",
            "D. Dizer que o objeto foi levado pelo assassino."
        ],
        correta: 3, // D
        videoFeedback: "imagens/Nivel5_cena3f.mp4" 
    },
    {
        titulo: "Cena 4: A Quebra do Protocolo",
        videoIntro: "imagens/Nivel5_cena4.mp4", 
        pergunta: "Os polícias estão cansados. Como introduzir uma distração?",
        opcoes: [
            "A. Oferecer-se para ajudar na busca.",
            "B. Pedir um whisky para si e convidar Noonan a beber.",
            "C. Chorar incontrolavelmente para parar tudo.",
            "D. Perguntar sobre impressões digitais."
        ],
        correta: 1, // B
        videoFeedback: "imagens/Nivel5_cena4f.mp4" 
    },
    {
        titulo: "Cena 5: O Convite Fatal",
        videoIntro: "imagens/Nivel5_cena5.mp4", 
        pergunta: "Como persuadir os polícias a comerem a arma do crime?",
        opcoes: [
            "A. Exigir que comam para limpar o frigorífico.",
            "B. Dizer que a comida está contaminada.",
            "C. Apelar à amizade e insistir que seria um favor para ela.",
            "D. Dizer que é uma punição por Patrick não gostar."
        ],
        correta: 2, // C
        videoFeedback: "imagens/Nivel5_cena5f.mp4" 
    }
];

// Estados Internos
let n5_currentSceneIndex = 0; 
// 0: VIDEO INTRO | 1: QUIZ | 2: VIDEO FEEDBACK | 3: TELA DE PASSAGEM | 4: ERRO
let n5_subState = 0; 

function setupNivel5() {
    console.log("Iniciando Nivel 5...");
    n5_currentSceneIndex = 0;
    n5_subState = 0; 
    nivel5Phase = 1; 
}

function drawNivel5() {
    // --- FASE 0: SETUP ---
    if (nivel5Phase === 0) {
        setupNivel5();
        return;
    }

    // --- FASE 1: O JOGO ---
    if (nivel5Phase === 1) {
        
        // Fundo
        if (typeof backgroundMiniGame2 !== 'undefined' && backgroundMiniGame2) {
            image(backgroundMiniGame2, 0, 0, width, height);
        } else {
            background(20);
        }

        // -------------------------------------------------
        // ESTADO 0: VIDEO INTRO
        // -------------------------------------------------
        if (n5_subState === 0) {
            if (!isVideoPlaying) {
                let vIntro = n5_cenas[n5_currentSceneIndex].videoIntro;
                startLevelVideo(vIntro, 6);
                if (nivelVideo) {
                    nivelVideo.onended(() => {
                        stopAndCleanVideo();
                        n5_subState = 1; // Vai para Quiz
                    });
                }
            }
            return;
        } 
        
        // -------------------------------------------------
        // ESTADO 1: QUIZ
        // -------------------------------------------------
        else if (n5_subState === 1) {
            drawNivel5Quiz();
        } 
        
        // -------------------------------------------------
        // ESTADO 2: VIDEO FEEDBACK
        // -------------------------------------------------
        else if (n5_subState === 2) {
            if (!isVideoPlaying) {
                let vFeed = n5_cenas[n5_currentSceneIndex].videoFeedback;
                
                // Segurança extra: se não houver vídeo, salta logo
                if (!vFeed) {
                    n5_subState = 3;
                    return;
                }

                startLevelVideo(vFeed, 6);
                if (nivelVideo) {
                    nivelVideo.onended(() => {
                        stopAndCleanVideo();
                        n5_subState = 3; // Vai para Tela de Passagem
                    });
                }
            }
            return;
        }

        // -------------------------------------------------
        // ESTADO 3: TELA DE PASSAGEM
        // -------------------------------------------------
        else if (n5_subState === 3) {
            drawNivel5Transition();
        } 
        
        // -------------------------------------------------
        // ESTADO 4: ERRO
        // -------------------------------------------------
        else if (n5_subState === 4) {
            drawNivel5Error();
        }
        return;
    }

    // --- FASE 4: CONCLUSÃO ---
    if (nivel5Phase === 4) {
        drawNextLevel("Case Closed", "THE PERFECT CRIME.", "MAIN MENU"); 
    }
}

// --- DESENHOS ---

function drawNivel5Quiz() {
    let scene = n5_cenas[n5_currentSceneIndex];

    push();
    rectMode(CENTER);
    fill(0, 0, 0, 245); stroke(100); strokeWeight(2);
    rect(width/2, height/2, width * 0.9, height * 0.9, 20);

    noStroke(); fill(220, 20, 20); textSize(28); textStyle(BOLD); textAlign(CENTER, TOP);
    text(scene.titulo, width/2, height * 0.15);

    fill(255); textStyle(NORMAL); textSize(20); textLeading(25);
    text(scene.pergunta, width/2, height * 0.25, width * 0.8, 200);

    let startY = height * 0.45;
    let gap = 70;
    textSize(18); textAlign(LEFT, CENTER); rectMode(CENTER);

    for (let i = 0; i < scene.opcoes.length; i++) {
        let btnY = startY + i * gap;
        if (mouseX > width/2 - 300 && mouseX < width/2 + 300 && 
            mouseY > btnY - 25 && mouseY < btnY + 25) {
            fill(180, 0, 0, 200); stroke(255);
        } else {
            fill(30); stroke(100);
        }
        rect(width/2, btnY, 600, 50, 10);
        noStroke(); fill(255);
        text(scene.opcoes[i], width/2 - 280, btnY);
    }
    pop();
}

function drawNivel5Transition() {
    push();
    background(0);
    textAlign(CENTER, CENTER);
    
    fill(0, 255, 0); textSize(40);
    text("CENA CONCLUÍDA!", width/2, height/3);
    
    fill(200); textSize(18);
    text("A sua manipulação funcionou.", width/2, height/3 + 50);

    fill(200, 0, 0); rectMode(CENTER);
    rect(width/2, height/2 + 50, 250, 60, 10);
    
    fill(255); textSize(22);
    let btnText = (n5_currentSceneIndex < 4) ? "SEGUINTE >>" : "TERMINAR CASO >>";
    text(btnText, width/2, height/2 + 50);
    pop();
}

function drawNivel5Error() {
    push();
    background(50, 0, 0);
    textAlign(CENTER, CENTER);
    fill(255, 0, 0); textSize(40);
    text("FALHA NA HISTÓRIA", width/2, height/3);
    
    fill(255); textSize(20);
    text("A sua resposta levantou suspeitas.", width/2, height/3 + 50);

    fill(255); rectMode(CENTER);
    rect(width/2, height/2 + 50, 250, 60, 10);
    fill(0); textSize(22);
    text("TENTAR NOVAMENTE", width/2, height/2 + 50);
    pop();
}

// --- INTERAÇÃO ---

function checkNivel5Click() {
    if (nivel5Phase === 0) { setupNivel5(); return true; }
    
    if (nivel5Phase === 4) {
        const iconY = height - 60;
        if (dist(mouseX, mouseY, width/2 - 100, iconY) < 40) { gameState = 1; nivel5Phase = 0; return true; }
        if (dist(mouseX, mouseY, width/2 + 100, iconY) < 40) { setupNivel5(); return true; }
        if (dist(mouseX, mouseY, width/2, height/2 + 50) < 50) { gameState = 0; return true; }
        return false;
    }

    if (nivel5Phase === 1) {
        
        // 0. Pular Vídeo Intro
        if (n5_subState === 0) {
            n5_subState = 1; 
            if(nivelVideo) stopAndCleanVideo();
            return true;
        }

        // 1. Clicar no Quiz
        if (n5_subState === 1) {
            let startY = height * 0.45;
            let gap = 70;
            let scene = n5_cenas[n5_currentSceneIndex];
            for (let i = 0; i < scene.opcoes.length; i++) {
                let btnY = startY + i * gap;
                if (mouseX > width/2 - 300 && mouseX < width/2 + 300 && 
                    mouseY > btnY - 25 && mouseY < btnY + 25) {
                    
                    if (i === scene.correta) {
                        // LÓGICA ESPECIAL CENA 2:
                        // Se existir videoFeedback, vai para estado 2.
                        // Se for null, vai direto para estado 3 (Tela de Passagem).
                        if (scene.videoFeedback) {
                            n5_subState = 2;
                        } else {
                            n5_subState = 3;
                        }
                    } else {
                        n5_subState = 4; // Erro
                    }
                    return true;
                }
            }
        }

        // 2. Pular Vídeo Feedback
        if (n5_subState === 2) {
            n5_subState = 3; 
            if(nivelVideo) stopAndCleanVideo();
            return true;
        }

        // 3. Clicar "Próxima Cena"
        if (n5_subState === 3) {
             if (mouseX > width/2 - 125 && mouseX < width/2 + 125 && 
                 mouseY > height/2 + 20 && mouseY < height/2 + 80) {
                 
                 n5_currentSceneIndex++; 
                 
                 if (n5_currentSceneIndex >= n5_cenas.length) {
                     nivel5Phase = 4; // Fim
                 } else {
                     n5_subState = 0; // Próxima Cena
                 }
                 return true;
             }
        }

        // 4. Clicar Erro
        if (n5_subState === 4) {
             if (mouseX > width/2 - 125 && mouseX < width/2 + 125 && 
                 mouseY > height/2 + 20 && mouseY < height/2 + 80) {
                 n5_subState = 1; 
                 return true;
             }
        }
    }
    return false;
}