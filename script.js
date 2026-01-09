// --- 1. СОСТОЯНИЕ ИГРЫ ---
let inventory = new Set();
let score = 0;

const itemNames = {
    'access_hint': '📜 Radio Hint',
    'silver_key': '🗝️ Silver Key',
    'housekeeper_trust': '🤝 Housekeeper Trust',
    'secret_code': '🔢 Secret Code',
    'diary_clue': '📓 Elizabeth\'s Diary',
    'basement_map': '🗺️ Basement Map',
    'caretaker_key': '🔑 Cell Key',
    'trapdoor_open': '🔓 Trapdoor Unlocked'
};

function updateStatus() {
    const scoreDisplay = document.getElementById('score-display');
    const invDisplay = document.getElementById('inventory-display');
    if (scoreDisplay) scoreDisplay.innerText = `Score: ${score} points`;
    if (invDisplay) {
        const displayItems = Array.from(inventory).map(id => itemNames[id] || id).join(', ');
        invDisplay.innerText = `Inventory: ${displayItems || 'empty'}`;
    }
}

// --- 2. ФУНКЦИЯ СТАРТА ---
function startGame() {
    const startScreen = document.getElementById('start-screen');
    const gameContent = document.getElementById('game-container');
    
    // Прячем заставку
    if (startScreen) startScreen.style.display = 'none';
    // Показываем игру
    if (gameContent) gameContent.style.display = 'block';
    
    // Включаем музыку
    const music = document.getElementById('bgMusic');
    if (music) music.play().catch(e => console.log("Music blocked"));
    
    renderScene('scene1'); // Запускаем первую сцену
}

   
// Привязка кнопки старта
const startBtn = document.querySelector('.start-btn');
if (startBtn) { startBtn.onclick = startGame; }

// --- 3. ВСЕ СЦЕНЫ (Пути проверены по вашим скриншотам) ---
const scenes = {
    scene1: {
        title: 'Episode I · The Summons',
        text: 'You stand before the gates of Ravenhill. They are <span class="vocab-word">locked</span>. You need to <b>find out</b> how to enter.',
        task: {
            question: 'What does "find out" mean?',
            options: ['To discover information', 'To close the gate'],
            correct: 'To discover information',
            reward: 'access_hint'
        },
        english: '<b>Find out</b> — выяснить, разузнать.',
        media: '<img src="assets/gates.png" class="clue-img">',
        choices: [
            { text: 'Search the Garden', next: 'scene_garden' },
            { text: 'Use Radio Hint', next: 'scene_radio', require: 'access_hint' },
            { text: 'Enter the Hall', next: 'scene2_hall', require: 'silver_key' }
        ]
    },
    scene_radio: {
        title: 'Radio Message',
        text: 'Static noise... then a voice: "Detective, check the garden! There is a box hidden near the roses."',
        onEnter: () => { const s = document.getElementById('radioSound'); if(s) s.play(); },
        media: '<video src="assets/radio-scene.mp4" autoplay loop muted class="clue-img"></video>',
        choices: [{ text: 'Go to the Garden', next: 'scene_garden' }]
    },
    scene_garden: {
        title: 'The Silent Garden',
        text: 'Among the withered roses, you see a <span class="vocab-word">concealed</span> wooden box.',
        english: '<b>Concealed</b> — скрытый, спрятанный.',
        media: '<img src="assets/garden.png" class="clue-img">',
        choices: [
            { text: 'Open the box', next: 'scene_box_task' }
        ]
    },
    scene_box_task: {
        title: 'The Mysterious Box',
        text: 'The box is locked. "The detective decided to _____ into the room."',
        task: {
            question: 'Which phrasal verb means "to enter"?',
            options: ['Go out', 'Go in'],
            correct: 'Go in',
            reward: 'silver_key'
        },
        media: '<img src="assets/box.png" class="clue-img">',
        choices: [{ text: 'Go back to Gates with Key', next: 'scene1', require: 'silver_key' }]
    },
    scene2_hall: {
        title: 'The Grand Hall',
        text: 'The door creaks open. A woman in a black dress stands by the stairs. She looks <span class="vocab-word">terrified</span>.',
        english: '<b>Terrified</b> — в ужасе.',
        media: '<video src="assets/hall-intro.mp4" autoplay loop muted class="clue-img"></video>',
        choices: [{ text: 'Talk to the Housekeeper', next: 'scene_housekeeper' }]
    },
    scene_housekeeper: {
        title: 'The Housekeeper',
        text: '"You shouldn\'t be here! Sir Henry _____ (watch) everyone for years!"',
        task: {
            question: 'Choose the correct tense:',
            options: ['has been watching', 'is watching'],
            correct: 'has been watching',
            reward: 'housekeeper_trust'
        },
        media: '<img src="assets/housekeeper.png" class="clue-img">',
        choices: [{ text: 'Ask about the Portraits', next: 'scene_portrait_secret', require: 'housekeeper_trust' }]
    },
    scene_portrait_secret: {
        title: 'The Hidden Keypad',
        text: 'Behind the portrait, you find a keypad. "Only the one who understands the past can enter."',
        task: {
            question: 'Which sentence is correct?',
            options: ['He must have been rich.', 'He must be rich yesterday.'],
            correct: 'He must have been rich.',
            reward: 'secret_code'
        },
        media: '<img src="assets/sir-henry.jpg" class="clue-img">',
        choices: [{ text: 'Open the Secret Study', next: 'scene_study', require: 'secret_code' }]
    },
    scene_study: {
        title: 'Sir Henry\'s Study',
        text: 'You enter a secret room. There is an old tape recorder and a desk.',
        media: '<img src="assets/study.png" class="clue-img">',
        choices: [
            { text: 'Play the Diary Recording', next: 'scene_diary' },
            { text: 'Examine the Desk', next: 'scene_study_desk' }
        ]
    },
    scene_diary: {
        title: 'Elizabeth\'s Diary',
        text: 'Elizabeth\'s voice fills the room.',
        onEnter: () => { const s = document.getElementById('diary-voice'); if(s) s.play(); },
        media: '<img src="assets/diary-mystical.png" class="clue-img">',
        choices: [{ text: 'Back to the Study', next: 'scene_study' }]
    },
    scene_study_desk: {
        title: 'The Mahogany Desk',
        text: 'On the desk, you find a letter. It _____ (write) by Elizabeth.',
        task: {
            question: 'Choose Passive Voice:',
            options: ['was written', 'wrote'],
            correct: 'was written',
            reward: 'basement_map'
        },
        media: '<img src="assets/desk.png" class="clue-img">',
        choices: [{ text: 'Look for the trapdoor', next: 'scene_trapdoor', require: 'basement_map' }]
    },
    scene_trapdoor: {
        title: 'The Trapdoor',
        text: '"If I _____ (be) you, I would leave now."',
        task: {
            question: 'Conditionals:',
            options: ['were', 'am'],
            correct: 'were',
            reward: 'trapdoor_open'
        },
        media: '<img src="assets/trapdoor.png" class="clue-img">',
        choices: [{ text: 'Go into the Basement', next: 'scene_basement', require: 'trapdoor_open' }]
    },
    scene_basement: {
        title: 'The Basement',
        text: 'Suddenly, the door slams shut!',
        media: '<img src="assets/basement.png" class="clue-img">',
        choices: [{ text: 'Who is there?', next: 'scene_caretaker' }]
    },
    scene_caretaker: {
        title: 'The Caretaker',
        text: '"I wish you hadn\'t found that photo," says the old man.',
        task: {
            question: 'B2 Regrets:',
            options: ['hadn't found', 'didn't find'],
            correct: 'hadn't found',
            reward: 'caretaker_key'
        },
        media: '<img src="assets/caretaker.png" class="clue-img">',
        choices: [{ text: 'TO BE CONTINUED', next: 'scene_final', require: 'caretaker_key' }]
    },
    scene_final: {
        title: 'The Mystery Continues',
        text: 'You escaped, but the truth is still hidden...',
        choices: [{ text: 'Start Again', next: 'scene1' }]
    }
};

// --- 4. ДВИЖОК ОТРИСОВКИ ---
function renderScene(sceneId) {
    const scene = scenes[sceneId];
    if (!scene) return;

    // Обновляем текст и медиа
    const titleEl = document.getElementById('scene-title');
    const textEl = document.getElementById('scene-text');
    const mediaBox = document.getElementById('media-container');
    const dictBox = document.getElementById('dictionary-display');

    if (titleEl) titleEl.innerText = scene.title;
    if (textEl) textEl.innerHTML = scene.text;
    if (mediaBox) mediaBox.innerHTML = scene.media || '';
    if (dictBox) dictBox.innerHTML = scene.english || 'No new vocabulary here.';
    
    if (scene.onEnter) scene.onEnter();
    updateStatus();

    const choicesContainer = document.getElementById('choices-container');
    if (choicesContainer) {
        choicesContainer.innerHTML = '';

        if (scene.task && !inventory.has(scene.task.reward)) {
            renderTask(scene.task, choicesContainer, sceneId);
        } else {
            scene.choices.forEach(choice => {
                if (!choice.require || inventory.has(choice.require)) {
                    const btn = document.createElement('button');
                    btn.innerText = choice.text;
                    btn.className = 'choice-btn';
                    btn.onclick = () => {
                        const s = document.getElementById('uiClick');
                        if(s) s.play();
                        renderScene(choice.next);
                    };
                    choicesContainer.appendChild(btn);
                }
            });
        }
    }
}

function renderTask(task, container, sceneId) {
    const qText = document.createElement('p');
    qText.className = 'task-question';
    qText.innerHTML = `<b>TASK:</b> ${task.question}`;
    container.appendChild(qText);

    task.options.forEach(option => {
        const btn = document.createElement('button');
        btn.innerText = option;
        btn.className = 'choice-btn task-btn';
        btn.onclick = () => {
            if (option === task.correct) {
                alert("Correct!");
                score += 10;
                inventory.add(task.reward);
                renderScene(sceneId);
            } else {
                alert("Wrong. Try again!");
            }
        };
        container.appendChild(btn);
    });
}
