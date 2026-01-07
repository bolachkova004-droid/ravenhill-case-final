// --- 1. ИНИЦИАЛИЗАЦИЯ И СОСТОЯНИЕ ---
let inventory = new Set();
let score = 0;

// Красивые названия для инвентаря
const itemNames = {
    'access_hint': '📜 Radio Hint',
    'silver_key': '🗝️ Silver Key',
    'housekeeper_trust': '🤝 Housekeeper Trust',
    'secret_code': '🔢 Secret Code',
    'diary_clue': '📓 Elizabeth\'s Diary',
    'basement_map': '🗺️ Basement Map',
    'caretaker_key': '🔑 Cell Key'
};

function updateStatus() {
    const scoreDisplay = document.getElementById('score-display');
    const invDisplay = document.getElementById('inventory-display');
    
    if (scoreDisplay) scoreDisplay.innerText = `Score: ${score} points`;
    
    if (invDisplay) {
        // Превращаем Set в список красивых названий через запятую
        const displayItems = Array.from(inventory)
            .map(id => itemNames[id] || id)
            .join(', ');
        invDisplay.innerText = `Inventory: ${displayItems || 'empty'}`;
    }
}

// --- 2. ЛОГИКА СТАРТОВОГО ЭКРАНА ---
const startBtn = document.getElementById('start-btn');
if (startBtn) {
    startBtn.onclick = () => {
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('game-content').style.display = 'block';
        const music = document.getElementById('bgMusic');
        if (music) music.play().catch(e => console.log("Music play blocked by browser"));
        renderScene('scene1');
    };
}

// --- 3. ОБЪЕКТ СЦЕН ---
const scenes = {
    scene1: {
        title: 'Episode I · The Summons',
        text: 'You stand before the gates of Ravenhill. They are <span class="vocab-word">locked</span>. You need to <b>find out</b> how to enter.',
        task: {
            id: 'task_find_out',
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
        onEnter: () => document.getElementById('radioSound').play(),
        media: '<video src="assets/radio-scene.mp4" autoplay loop muted class="clue-img"></video>',
        choices: [{ text: 'Go to the Garden', next: 'scene_garden' }]
    },
    scene_garden: {
        title: 'The Silent Garden',
        text: 'Among the withered roses, you see a <span class="vocab-word">concealed</span> wooden box.',
        english: '<b>Concealed</b> — скрытый, спрятанный.',
        media: '<img src="assets/garden.png" class="clue-img">',
        choices: [
            { text: 'Open the box', next: 'scene_box_task' },
            { text: 'Back to Gates', next: 'scene1' }
        ]
    },
    scene_box_task: {
        title: 'The Mysterious Box',
        text: 'The box is locked. "The detective decided to _____ into the room."',
        task: {
            id: 'task_go_in',
            question: 'Which phrasal verb means "to enter"?',
            options: ['Go out', 'Go in'],
            correct: 'Go in',
            reward: 'silver_key'
        },
        media: '<img src="assets/box.png" class="clue-img">',
        choices: [{ text: 'Go to Gates with Key', next: 'scene1', require: 'silver_key' }]
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
            id: 'task_tense',
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
            id: 'task_modal',
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
        text: 'Elizabeth\'s voice fills the room. She sounds scared, but determined.',
        onEnter: () => document.getElementById('diary-voice').play(),
        media: '<img src="assets/diary-mystical.png" class="clue-img">',
        choices: [{ text: 'Back to the Study', next: 'scene_study' }]
    },
    scene_study_desk: {
        title: 'The Mahogany Desk',
        text: 'On the desk, you find a letter. It _____ (write) by Elizabeth.',
        task: {
            id: 'task_passive',
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
            id: 'task_if',
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
        text: 'Suddenly, the door slams shut! You find a photo of Sir Henry.',
        choices: [{ text: 'Who is there?', next: 'scene_caretaker' }]
    },
    scene_caretaker: {
        title: 'The Caretaker',
        text: '"I wish you hadn\'t found that photo," says the old man.',
        task: {
            id: 'task_wish',
            question: 'B2 Regrets:',
            options: ['hadn\'t found', 'didn\'t find'],
            correct: 'hadn\'t found',
            reward: 'caretaker_key'
        },
        media: '<img src="assets/caretaker.png" class="clue-img">',
        choices: [{ text: 'TO BE CONTINUED', next: 'scene_final', require: 'caretaker_key' }]
    },
    scene_final: {
        title: 'The Mystery Continues',
        text: 'You escaped the basement, but the truth is still hidden...',
        choices: [{ text: 'Start Episode 1 Again', next: 'scene1' }]
    }
};

// --- 4. ГЛАВНАЯ ФУНКЦИЯ ОТРИСОВКИ ---
function renderScene(sceneId) {
    const scene = scenes[sceneId];
    if (!scene) return;

    // Обновляем текст и медиа в ваших ID
    document.getElementById('scene-title').innerText = scene.title;
    document.getElementById('scene-text').innerHTML = scene.text;
    document.getElementById('clue-media').innerHTML = scene.media || '';
    document.getElementById('mini-english-content').innerHTML = scene.english || 'No new vocabulary here.';
    
    if (scene.onEnter) scene.onEnter();
    updateStatus();

    const choicesContainer = document.querySelector('.choices');
    choicesContainer.innerHTML = '';

    // Логика ЗАДАНИЙ
    if (scene.task && !inventory.has(scene.task.reward)) {
        renderTask(scene.task, choicesContainer, sceneId);
    } else {
        // Логика ОБЫЧНЫХ ВЫБОРОВ
        scene.choices.forEach(choice => {
            if (!choice.require || inventory.has(choice.require)) {
                const btn = document.createElement('button');
                btn.innerText = choice.text;
                btn.className = 'choice-btn';
                btn.onclick = () => {
                    document.getElementById('uiClick').play();
                    renderScene(choice.next);
                };
                choicesContainer.appendChild(btn);
            }
        });
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
                alert("Correct! +10 points.");
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
