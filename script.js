// 1. СОСТОЯНИЕ ИГРЫ
let state = {
    inventory: [],
    completedTasks: [],
    score: 0
};

const sound = {
    play: (id) => {
        const el = document.getElementById(id);
        if (el) { el.currentTime = 0; el.play().catch(() => {}); }
    }
};

// 2. СЮЖЕТ И ЗАДАНИЯ
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
        english: '<b>Find out</b> — выяснить, узнать.',
        media: '<img src="assets/gates.png" style="width:100%; border-radius:12px;">',
        choices: [
            { text: 'Search the Garden', next: 'scene_garden' },
            { text: 'Enter the Hall (Requires Hint)', next: 'scene2_hall', require: 'access_hint' }
        ]
    },
    scene_garden: {
        title: 'The Silent Garden',
        text: 'Among the withered roses, you see a <span class="vocab-word">concealed</span> wooden box.',
        english: '<b>Concealed</b> — скрытый.',
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
            question: 'Which one means "to enter"?',
            options: ['Go out', 'Go in'],
            correct: 'Go in',
            reward: 'silver_key'
        },
        media: '<img src="assets/box.png" style="width:100%; border-radius:12px;">',
        choices: [
            { text: 'Examine the note inside', next: 'scene_box_note', require: 'silver_key' },
            { text: 'Back to Garden', next: 'scene_garden' }
        ]
    },
    scene_box_note: {
        title: 'The Secret Note',
        text: 'The note says: "Do NOT trust the portraits. They are watching you."',
        english: '<b>Folded</b> — сложенный.',
        media: '<img src="assets/box.png" style="width:100%; border-radius:12px;">',
        choices: [{ text: 'Go back to Gates', next: 'scene1' }]
    },
    scene2_hall: {
        title: 'The Grand Hall',
        text: 'The door creaks open. You are inside. A woman in a black dress stands by the stairs.',
        media: '<video src="assets/hall-intro.mp4" autoplay loop muted playsinline style="width:100%; border-radius:12px;"></video>',
        choices: [{ text: 'Talk to the Woman', next: 'scene_housekeeper' }]
    },
    scene_housekeeper: {
        title: 'The Housekeeper',
        text: '"Sir Henry _____ everyone in this house for years!"',
        task: {
            id: 'task_tense',
            question: 'Choose the correct tense:',
            options: ['has been watching', 'is watching'],
            correct: 'has been watching',
            reward: 'housekeeper_trust'
        },
        media: '<img src="assets/housekeeper.png" style="width:100%; border-radius:12px;">',
        choices: [{ text: 'Examine the Portrait', next: 'scene_portrait', require: 'housekeeper_trust' }]
    },
    scene_portrait: {
        title: 'The Portrait',
        text: 'You find a hidden keypad behind the frame.',
        task: {
            id: 'task_modal',
            question: 'Only the one who _____ the past can enter.',
            options: ['must have known', 'must know'],
            correct: 'must have known',
            reward: 'secret_code'
        },
        media: '<img src="assets/sir-henry.jpg" style="width:100%; border-radius:12px;">',
        choices: [{ text: 'Enter the Secret Room', next: 'scene1', require: 'secret_code' }]
    }
};

// 3. ФУНКЦИЯ ОТРИСОВКИ
function renderScene(id) {
    const data = scenes[id];
    if (!data) return;

    const gameArea = document.querySelector('.game');
    gameArea.style.opacity = '0';

    setTimeout(() => {
        document.getElementById('scene-title').innerText = data.title;
        document.getElementById('scene-text').innerHTML = data.text;
        document.getElementById('mini-english-content').innerHTML = data.english || '';

        // ИНВЕНТАРЬ (Исправлено)
        const itemNames = {
            'silver_key': '🗝️ Silver Key',
            'access_hint': '📜 Radio Code',
            'housekeeper_trust': '🤝 Trust',
            'secret_code': '🔢 Code'
        };
        document.getElementById('score-display').innerText = `Score: ${state.score}`;
        const invEl = document.getElementById('inventory-display');
        if (invEl) {
            const pretty = state.inventory.map(i => itemNames[i] || i);
            invEl.innerText = state.inventory.length ? 'Items: ' + pretty.join(', ') : 'Items: empty';
        }

        document.getElementById('clue-media').innerHTML = data.media || '';
        const choicesCont = document.querySelector('.choices');
        choicesCont.innerHTML = '';

        if (data.task && !state.completedTasks.includes(data.task.id)) {
            renderTask(data.task, choicesCont, id);
        } else {
            renderChoices(data.choices, choicesCont);
        }

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
    div.innerHTML = `<p><b>Task:</b> ${task.question}</p>`;
    task.options.forEach(opt => {
        const b = document.createElement('button');
        b.className = 'choice-btn';
        b.innerText = opt;
        b.onclick = () => {
            if (opt === task.correct) {
                state.completedTasks.push(task.id);
                if (task.reward) state.inventory.push(task.reward);
                state.score += 50;
                sound.play('uiClick');
                renderScene(sceneId);
            } else { alert('Wrong!'); }
        };
        div.appendChild(b);
    });
    container.appendChild(div);
}

// 4. СТАРТ
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

