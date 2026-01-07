// --- 1. ГЛОБАЛЬНОЕ СОСТОЯНИЕ (ИНВЕНТАРЬ И ОЧКИ) ---
let state = {
    inventory: [],
    completedTasks: [],
    score: 0
};

// --- 2. УПРАВЛЕНИЕ ЗВУКОМ ---
const sound = {
    play: (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.currentTime = 0;
            // Клики и радио делаем погромче
            if (id === 'uiClick' || id === 'radioSound') el.volume = 1.0;
            if (id === 'bgMusic') el.volume = 0.3;
            el.play().catch(e => console.warn("Sound blocked:", id));
        }
    }
};

// --- 3. ПОЛНАЯ БАЗА СЦЕН (ВСЕ ВЕТКИ) ---
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
        media: '<img src="assets/gates.png" style="width:100%; border-radius:12px;">',
        choices: [
            { text: 'Search the Garden', next: 'scene_garden' },
            { text: 'Use Radio Hint', next: 'scene_radio', require: 'access_hint' },
            { text: 'Enter the Hall (Requires Key)', next: 'scene2_hall', require: 'silver_key' }
        ]
    },
    scene_radio: {
        title: 'Radio Message',
        text: 'Static noise... then a voice: "Detective, check the garden! There is a box hidden near the roses."',
        onEnter: () => sound.play('radioSound'),
        media: '<video src="assets/radio-scene.mp4" autoplay loop muted playsinline style="width:100%; border-radius:12px;"></video>',
        choices: [{ text: 'Go to the Garden', next: 'scene_garden' }]
    },
    scene_garden: {
        title: 'The Silent Garden',
        text: 'Among the withered roses, you see a <span class="vocab-word">concealed</span> wooden box.',
        english: '<b>Concealed</b> — скрытый, спрятанный.',
        media: '<img src="assets/garden.png" style="width:100%; border-radius:12px;">',
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
        media: '<img src="assets/box.png" style="width:100%; border-radius:12px;">',
        choices: [
            { text: 'Examine the note inside', next: 'scene_box_note', require: 'silver_key' },
            { text: 'Back to Gates', next: 'scene1' }
        ]
    },
    scene_box_note: {
        title: 'The Secret Note',
        text: 'The note says: "Do NOT trust the portraits. They are watching you."',
        media: '<img src="assets/box.png" style="width:100%; border-radius:12px;">',
        choices: [{ text: 'Go to Gates with Key', next: 'scene1' }]
    },
    scene2_hall: {
        title: 'The Grand Hall',
        text: 'The door creaks open. You are inside. A woman in a black dress stands by the stairs. She looks <span class="vocab-word">terrified</span>.',
        english: '<b>Terrified</b> — в ужасе.',
        media: '<video src="assets/hall-intro.mp4" autoplay loop muted playsinline style="width:100%; border-radius:12px;"></video>',
        choices: [{ text: 'Talk to the Housekeeper', next: 'scene_housekeeper' }]
    },
    scene_housekeeper: {
        title: 'The Housekeeper',
        text: '"You shouldn\'t be here! Sir Henry _____ (watch) everyone for years!"',
        task: {
            id: 'task_tense',
            question: 'Choose the correct tense (B2 level):',
            options: ['has been watching', 'is watching'],
            correct: 'has been watching',
            reward: 'housekeeper_trust'
        },
        media: '<img src="assets/housekeeper.png" style="width:100%; border-radius:12px;">',
        choices: [{ text: 'Ask about the Portraits', next: 'scene_portrait_secret', require: 'housekeeper_trust' }]
    },
    scene_portrait_secret: {
        title: 'The Hidden Keypad',
        text: 'Behind Sir Henry\'s portrait, you find a keypad. A label says: "Only the one who _____ (understand) the past can enter."',
        task: {
            id: 'task_modal',
            question: 'Which sentence is correct about the past?',
            options: ['He must have been rich.', 'He must be rich yesterday.'],
            correct: 'He must have been rich.',
            reward: 'secret_code'
        },
        media: '<img src="assets/sir-henry.jpg" style="width:100%; border-radius:12px;">',
        choices: [{ text: 'Open the Secret Study', next: 'scene_study', require: 'secret_code' }]
    },
    scene_study: {
        title: 'Sir Henry\'s Study',
        text: 'You enter a secret room. There is an old tape recorder and a massive mahogany desk.',
        media: '<img src="assets/study.png" style="width:100%; border-radius:12px;">',
        choices: [
            { text: 'Play the Diary Recording', next: 'scene_diary' },
            { text: 'Examine the Desk', next: 'scene_study_desk' }, // ВОТ ЭТОТ ПЕРЕХОД НУЖЕН
            { text: 'Return to the Hall', next: 'scene2_hall' }
        ]
    },
    scene_diary: {
        title: 'Elizabeth\'s Diary',
        text: 'Elizabeth\'s voice fills the room. She sounds scared, but determined.',
        task: {
            id: 'task_diary_fear',
            question: 'What is Elizabeth MOST afraid of?',
            options: ['That the house is watching her.', 'That the weather will get worse.'],
            correct: 'That the house is watching her.',
            reward: 'diary_clue'
        },
        english: '<b>Determined</b> — решительный.',
        media: '<img src="assets/diary-mystical.png" style="width:100%; border-radius:12px;">',
        onEnter: () => sound.play('diary-voice'),
        choices: [{ text: 'Back to the Study', next: 'scene_study' }]
    },
    scene_study_desk: {
        title: 'The Mahogany Desk',
        text: 'On the desk, you find a letter. It _____ (write) by Elizabeth many years ago.',
        task: {
            id: 'task_passive',
            question: 'Choose the correct Passive Voice form:',
            options: ['was written', 'was write'],
            correct: 'was written',
            reward: 'basement_map'
        },
        english: '<b>Mahogany</b> — красное дерево.',
        media: '<img src="assets/desk.png" style="width:100%; border-radius:12px;">',
        choices: [
            { text: 'Look for the trapdoor', next: 'scene_trapdoor', require: 'basement_map' },
            { text: 'Back to Study', next: 'scene_study' }
        ]
    },
    scene_trapdoor: {
        title: 'The Trapdoor',
        text: 'The map leads you to a rug. "If I _____ (be) you, I would leave now."',
        task: {
            id: 'task_if',
            question: 'Complete the Second Conditional:',
            options: ['were', 'am'],
            correct: 'were',
            reward: 'trapdoor_open'
        },
        english: '<b>Trapdoor</b> — люк.',
        media: '<img src="assets/trapdoor.png" style="width:100%; border-radius:12px;">',
        choices: [
            { text: 'Go into the Basement', next: 'scene_basement', require: 'trapdoor_open' }
        ]
    },
    scene_basement: {
        title: 'The Basement',
        text: 'It is pitch black. You find the old photo Elizabeth mentioned.',
        english: '<b>Pitch black</b> — полная темнота.',
        media: '<img src="assets/basement.png" style="width:100%; border-radius:12px;">',
        choices: [{ text: 'Take the photo and return to Gates', next: 'scene1', reward: 'old_photo' }]
    }
};

// --- 4. ФУНКЦИИ ОТРИСОВКИ ---
function renderScene(id) {
    const data = scenes[id];
    if (!data) return;

    const gameArea = document.querySelector('.game');
    if (gameArea) gameArea.style.opacity = '0';

    setTimeout(() => {
        // Тексты
        const titleEl = document.getElementById('scene-title');
        const textEl = document.getElementById('scene-text');
        const engEl = document.getElementById('mini-english-content');
        if (titleEl) titleEl.innerText = data.title;
        if (textEl) textEl.innerHTML = data.text;
        if (engEl) engEl.innerHTML = data.english || '';

        // ИНВЕНТАРЬ
        const itemNames = {
    'silver_key': '🗝️ Silver Key',
    'access_hint': '📜 Radio Code',
    'housekeeper_trust': '🤝 Trust',
    'secret_code': '🔢 Code',
    'diary_clue': '📓 Diary Clue',
    'basement_map': '🗺️ Basement Map', // Новое
    'old_photo': '🖼️ Elizabeth\'s Photo' // Новое
};

        const scoreEl = document.getElementById('score-display');
        const invEl = document.getElementById('inventory-display');
        if (scoreEl) scoreEl.innerText = `Score: ${state.score} points`;
        if (invEl) {
            const pretty = state.inventory.map(i => itemNames[i] || i);
            invEl.innerText = state.inventory.length ? 'Inventory: ' + pretty.join(', ') : 'Inventory: empty';
        }

        // Медиа
        const mediaEl = document.getElementById('clue-media');
        if (mediaEl) mediaEl.innerHTML = data.media || '';

        // Кнопки
        const choicesCont = document.querySelector('.choices');
        if (choicesCont) {
            choicesCont.innerHTML = '';
            if (data.task && !state.completedTasks.includes(data.task.id)) {
                renderTask(data.task, choicesCont, id);
            } else {
                renderChoices(data.choices, choicesCont);
            }
        }

        if (data.onEnter) data.onEnter();
        if (gameArea) gameArea.style.opacity = '1';
        sound.play('stepSound');
    }, 400);
}

function renderChoices(choices, container) {
    choices.forEach(ch => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        const locked = ch.require && !state.inventory.includes(ch.require);
        btn.innerText = locked ? `🔒 ${ch.text}` : ch.text;
        btn.disabled = locked;
        btn.onclick = () => { sound.play('uiClick'); renderScene(ch.next); };
        container.appendChild(btn);
    });
}

function renderTask(task, container, sceneId) {
    const div = document.createElement('div');
    div.className = 'task-panel';
    div.innerHTML = `<p style="margin-bottom:10px;"><b>Task:</b> ${task.question}</p>`;
    task.options.forEach(opt => {
        const b = document.createElement('button');
        b.className = 'choice-btn';
        b.style.marginBottom = '8px';
        b.innerText = opt;
        b.onclick = () => {
            if (opt === task.correct) {
                state.completedTasks.push(task.id);
                if (task.reward) state.inventory.push(task.reward);
                state.score += 50;
                sound.play('uiClick');
                renderScene(sceneId);
            } else { alert('Wrong! Try again.'); }
        };
        div.appendChild(b);
    });
    container.appendChild(div);
}

// --- 5. ЗАПУСК ИГРЫ (МЕХАНИКА START) ---
window.onload = () => {
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.onclick = () => {
            sound.play('uiClick');
            const startScreen = document.getElementById('start-screen');
            if (startScreen) startScreen.style.opacity = '0';
            
            setTimeout(() => {
                if (startScreen) startScreen.style.display = 'none';
                const gameContent = document.getElementById('game-content');
                if (gameContent) {
                    gameContent.style.display = 'block';
                    setTimeout(() => {
                        gameContent.style.opacity = '1';
                        sound.play('bgMusic');
                        renderScene('scene1');
                    }, 50);
                }
            }, 800);
        };
    }
};
