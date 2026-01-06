// 1. СОСТОЯНИЕ ИГРЫ
let state = {
    inventory: [],
    completedTasks: [],
    score: 0
};

// 2. ЗВУКОВОЙ ДВИЖОК
const sound = {
    play: (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.currentTime = 0;
            // Установка громкости для кликов
            if (id === 'uiClick') el.volume = 1.0;
            el.play().catch(e => console.log("Sound blocked:", id));
        }
    }
};

// 3. СЮЖЕТ И ЗАДАНИЯ
const scenes = {
    scene1: {
        title: 'Episode I · The Summons',
        text: 'You stand before the towering gates of Ravenhill. They are <span class="vocab-word">locked</span>. You need to <b>find out</b> how to enter.',
        task: {
            id: 'task_find_out',
            question: 'What does "find out" mean?',
            options: ['To discover information', 'To close the gate'],
            correct: 'To discover information',
            reward: 'access_hint'
        },
        english: '<b>Find out</b> — выяснить, разузнать.',
        media: '<img src="assets/gates.png" style="width:100%; border-radius:12px; margin-top:20px;">',
        choices: [
            { text: 'Search the Garden', next: 'scene_garden' },
            { text: 'Enter the Hall (Requires Hint)', next: 'scene2_hall', require: 'access_hint' }
        ]
    },
    scene_garden: {
        title: 'The Silent Garden',
        text: 'Among the withered roses, you see a <span class="vocab-word">concealed</span> wooden box.',
        english: '<b>Concealed</b> — скрытый, спрятанный.',
        media: '<img src="assets/garden.png" style="width:100%; border-radius:12px; margin-top:20px;">',
        choices: [
            { text: 'Open the box', next: 'scene_box_task' },
            { text: 'Back to Gates', next: 'scene1' }
        ]
    },
    scene_box_task: {
        title: 'The Mysterious Box',
        text: 'The box is locked. To open it, choose the correct phrasal verb: "The detective decided to _____ into the room."',
        task: {
            id: 'task_go_in',
            question: 'Which one means "to enter"?',
            options: ['Go out', 'Go in'],
            correct: 'Go in',
            reward: 'silver_key'
        },
        media: '<img src="assets/box.png" style="width:100%; border-radius:12px; margin-top:20px;">',
        choices: [
            { text: 'Examine the note inside', next: 'scene_box_note', require: 'silver_key' },
            { text: 'Back to Garden', next: 'scene_garden' }
        ]
    },
    scene_box_note: {
        title: 'The Secret Note',
        text: 'Inside the box is a <span class="vocab-word">folded</span> note: "Do NOT trust the portraits. They are watching you."',
        english: '<b>Folded</b> — сложенный.',
        media: '<img src="assets/box.png" style="width:100%; border-radius:12px; margin-top:20px;">',
        choices: [{ text: 'Go back to Gates', next: 'scene1' }]
    },
    scene2_hall: {
        title: 'The Grand Hall',
        text: 'The door creaks open. You are inside Ravenhill Estate. A woman in a black dress stands by the stairs.',
        media: '<video src="assets/hall-intro.mp4" autoplay loop muted playsinline style="width:100%; border-radius:12px; margin-top:20px;"></video>',
        choices: [{ text: 'Talk to the Woman', next: 'scene_housekeeper' }]
    },
    scene_housekeeper: {
        title: 'The Housekeeper',
        text: 'The woman looks terrified. "Sir Henry _____ (watch) everyone in this house for years!"',
        task: {
            id: 'task_tense',
            question: 'Choose the correct tense:',
            options: ['has been watching', 'is watching'],
            correct: 'has been watching',
            reward: 'housekeeper_trust'
        },
        media: '<img src="assets/housekeeper.png" style="width:100%; border-radius:12px; margin-top:20px;">',
        choices: [{ text: 'Examine the Portrait', next: 'scene_portrait_secret', require: 'housekeeper_trust' }]
    },
    scene_portrait_secret: {
        title: 'The Portrait',
        text: 'You find a hidden keypad behind the frame.',
        task: {
            id: 'task_modal',
            question: 'Which sentence is correct about the past?',
            options: ['He must have been rich.', 'He must be rich yesterday.'],
            correct: 'He must have been rich.',
            reward: 'secret_code'
        },
        media: '<img src="assets/sir-henry.jpg" style="width:100%; border-radius:12px; margin-top:20px;">',
        choices: [{ text: 'Enter the Secret Room', next: 'scene1', require: 'secret_code' }]
    }
};

// 4. ГЛАВНАЯ ФУНКЦИЯ ОТРИСОВКИ
function renderScene(id) {
    const data = scenes[id];
    if (!data) return;

    const gameArea = document.querySelector('.game');
    gameArea.style.opacity = '0';

    setTimeout(() => {
        // Тексты
        document.getElementById('scene-title').innerText = data.title;
        document.getElementById('scene-text').innerHTML = data.text;
        document.getElementById('mini-english-content').innerHTML = data.english || '';

        // ИНВЕНТАРЬ (С красивыми именами)
        const itemNames = {
            'silver_key': '🗝️ Silver Key',
            'access_hint': '📜 Radio Code',
            'housekeeper_trust': '🤝 Trust',
            'secret_code': '🔢 Secret Code'
        };
        document.getElementById('score-display').innerText = `Score: ${state.score} points`;
        const invEl = document.getElementById('inventory-display');
        if (invEl) {
            const pretty = state.inventory.map(id => itemNames[id] || id);
            invEl.innerText = state.inventory.length ? 'Inventory: ' + pretty.join(', ') : 'Inventory: empty';
        }

        // Медиа
        document.getElementById('clue-media').innerHTML = data.media || '';

        // Кнопки и Задания
        const choicesCont = document.querySelector('.choices');
        choicesCont.innerHTML = '';

        if (data.task && !state.completedTasks.includes(data.task.id)) {
            renderTask(data.task, choicesCont, id);
        } else {
            renderChoices(data.choices, choicesCont);
        }

        if (data.onEnter) data.onEnter();
        gameArea.style.opacity = '1';
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
    div.innerHTML = `<p style="margin-bottom:15px;"><b>Grammar Task:</b> ${task.question}</p>`;
    task.options.forEach(opt => {
        const b = document.createElement('button');
        b.className = 'choice-btn';
        b.style.marginBottom = '10px';
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

// 5. СТАРТ
document.getElementById('start-btn').onclick = () => {
    sound.play('uiClick');
    document.getElementById('start-screen').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('start-screen').style.display = 'none';
        const game = document.getElementById('game-content');
        game.style.display = 'block';
        setTimeout(() => {
            game.style.opacity = '1';
            sound.play('bgMusic');
            renderScene('scene1');
        }, 50);
    }, 800);
};
