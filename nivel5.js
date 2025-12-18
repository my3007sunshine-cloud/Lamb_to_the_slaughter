// =================================================================
// NIVEL 5 - THE INTERROGATION
// =================================================================

// Data Structure: Each scene has Intro Video and Feedback Video
const n5_cenas = [
    {
        titulo: "Scene 1: The Arrival",
        videoIntro: "imagens/Nivel5_cena1.mp4", 
        pergunta: "Patrick is dead. The police have entered. What must you do to appear genuine?",
        opcoes: [
            "A. Stay calm and point to the phone.",
            "B. Scream that you hate him and it was murder.",
            "C. Fall into Jack Noonan's arms, crying hysterically.",
            "D. Run to the kitchen and turn off the oven."
        ],
        correta: 2, // C
        videoFeedback: "imagens/Nivel5_cena1f.mp4" 
    },
    {
        titulo: "Scene 2: The Meat Story",
        videoIntro: "imagens/Nivel5_cena2.mp4", 
        pergunta: "They ask about the roast in the oven. How do you justify the alibi?",
        opcoes: [
            "A. Say you forgot about it when you went out.",
            "B. Say you were going to cook, but Patrick didn't want to.",
            "C. Say you put it in to roast for supper and went out for vegetables.",
            "D. Say you were going to dine out, making the roast irrelevant."
        ],
        correta: 2, // C
        videoFeedback: null // No conclusion video here
    },
    {
        titulo: "Scene 3: The Weapon Search",
        videoIntro: "imagens/Nivel5_cena3.mp4", 
        pergunta: "They are looking for a heavy metal object (Spanner). How do you divert attention?",
        opcoes: [
            "A. Mention the frozen leg of lamb.",
            "B. Suggest they look in the kitchen trash.",
            "C. Say there might be a spanner in the garage.",
            "D. Say the object was likely taken by the killer."
        ],
        correta: 3, // D
        videoFeedback: "imagens/Nivel5_cena3f.mp4" 
    },
    {
        titulo: "Scene 4: Breaking Protocol",
        videoIntro: "imagens/Nivel5_cena4.mp4", 
        pergunta: "The police are tired. How do you introduce a distraction?",
        opcoes: [
            "A. Offer to help with the search.",
            "B. Ask for a whiskey for yourself and invite Noonan to drink.",
            "C. Cry uncontrollably to stop everything.",
            "D. Ask about fingerprints."
        ],
        correta: 1, // B
        videoFeedback: "imagens/Nivel5_cena4f.mp4" 
    },
    {
        titulo: "Scene 5: The Fatal Invitation",
        videoIntro: "imagens/Nivel5_cena5.mp4", 
        pergunta: "How do you persuade the police to eat the murder weapon?",
        opcoes: [
            "A. Demand they eat to clean the fridge.",
            "B. Say the food is contaminated.",
            "C. Appeal to friendship and insist it would be a favor to her.",
            "D. Say it is a punishment because Patrick didn't like it."
        ],
        correta: 2, // C
        videoFeedback: "imagens/Nivel5_cena5f.mp4" 
    }
];

// Internal States
let n5_currentSceneIndex = 0; 
// 0: VIDEO INTRO | 1: QUIZ | 2: VIDEO FEEDBACK | 3: TRANSITION SCREEN | 4: ERROR
let n5_subState = 0; 

function setupNivel5() {
    console.log("Starting Level 5...");
    n5_currentSceneIndex = 0;
    n5_subState = 0; 
    nivel5Phase = 1; 
}

function drawNivel5() {
    // --- PHASE 0: SETUP ---
    if (nivel5Phase === 0) {
        setupNivel5();
        return;
    }

    // --- PHASE 1: THE GAME ---
    if (nivel5Phase === 1) {
        
        // Background
        if (typeof backgroundMiniGame2 !== 'undefined' && backgroundMiniGame2) {
            image(backgroundMiniGame2, 0, 0, width, height);
        } else {
            background(20);
        }

        // -------------------------------------------------
        // STATE 0: VIDEO INTRO
        // -------------------------------------------------
        if (n5_subState === 0) {
            if (!isVideoPlaying) {
                let vIntro = n5_cenas[n5_currentSceneIndex].videoIntro;
                startLevelVideo(vIntro, 6);
                if (nivelVideo) {
                    nivelVideo.onended(() => {
                        stopAndCleanVideo();
                        n5_subState = 1; // Go to Quiz
                    });
                }
            }
            return;
        } 
        
        // -------------------------------------------------
        // STATE 1: QUIZ
        // -------------------------------------------------
        else if (n5_subState === 1) {
            drawNivel5Quiz();
        } 
        
        // -------------------------------------------------
        // STATE 2: VIDEO FEEDBACK
        // -------------------------------------------------
        else if (n5_subState === 2) {
            if (!isVideoPlaying) {
                let vFeed = n5_cenas[n5_currentSceneIndex].videoFeedback;
                
                if (!vFeed) {
                    n5_subState = 3;
                    return;
                }

                startLevelVideo(vFeed, 6);
                if (nivelVideo) {
                    nivelVideo.onended(() => {
                        stopAndCleanVideo();
                        n5_subState = 3; // Go to Transition
                    });
                }
            }
            return;
        }

        // -------------------------------------------------
        // STATE 3: TRANSITION SCREEN
        // -------------------------------------------------
        else if (n5_subState === 3) {
            drawNivel5Transition();
        } 
        
        // -------------------------------------------------
        // STATE 4: ERROR
        // -------------------------------------------------
        else if (n5_subState === 4) {
            drawNivel5Error();
        }
        return;
    }

    // --- PHASE 4: CONCLUSION ---
    if (nivel5Phase === 4) {
        drawNextLevel("Case Closed", "THE PERFECT CRIME.", "MAIN MENU"); 
    }
}

// --- DRAWING FUNCTIONS ---

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
    text("SCENE COMPLETE!", width/2, height/3);
    
    fill(200); textSize(18);
    text("Your manipulation worked.", width/2, height/3 + 50);

    fill(200, 0, 0); rectMode(CENTER);
    rect(width/2, height/2 + 50, 250, 60, 10);
    
    fill(255); textSize(22);
    let btnText = (n5_currentSceneIndex < 4) ? "NEXT >>" : "CLOSE CASE >>";
    text(btnText, width/2, height/2 + 50);
    pop();
}

function drawNivel5Error() {
    push();
    background(50, 0, 0);
    textAlign(CENTER, CENTER);
    fill(255, 0, 0); textSize(40);
    text("STORY FAILURE", width/2, height/3);
    
    fill(255); textSize(20);
    text("Your answer raised suspicions.", width/2, height/3 + 50);

    fill(255); rectMode(CENTER);
    rect(width/2, height/2 + 50, 250, 60, 10);
    fill(0); textSize(22);
    text("TRY AGAIN", width/2, height/2 + 50);
    pop();
}

// --- INTERACTION ---

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
        
        // 0. Skip Video Intro
        if (n5_subState === 0) {
            n5_subState = 1; 
            if(nivelVideo) stopAndCleanVideo();
            return true;
        }

        // 1. Click Quiz
        if (n5_subState === 1) {
            let startY = height * 0.45;
            let gap = 70;
            let scene = n5_cenas[n5_currentSceneIndex];
            for (let i = 0; i < scene.opcoes.length; i++) {
                let btnY = startY + i * gap;
                if (mouseX > width/2 - 300 && mouseX < width/2 + 300 && 
                    mouseY > btnY - 25 && mouseY < btnY + 25) {
                    
                    if (i === scene.correta) {
                        if (scene.videoFeedback) {
                            n5_subState = 2;
                        } else {
                            n5_subState = 3;
                        }
                    } else {
                        n5_subState = 4; // Error
                    }
                    return true;
                }
            }
        }

        // 2. Skip Video Feedback
        if (n5_subState === 2) {
            n5_subState = 3; 
            if(nivelVideo) stopAndCleanVideo();
            return true;
        }

        // 3. Click "Next Scene"
        if (n5_subState === 3) {
             if (mouseX > width/2 - 125 && mouseX < width/2 + 125 && 
                 mouseY > height/2 + 20 && mouseY < height/2 + 80) {
                 
                 n5_currentSceneIndex++; 
                 
                 if (n5_currentSceneIndex >= n5_cenas.length) {
                     nivel5Phase = 4; // End
                 } else {
                     n5_subState = 0; // Next Scene
                 }
                 return true;
             }
        }

        // 4. Click Error
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