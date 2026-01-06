// ПРОВЕРКА ЗАГРУЗКИ
console.log("Script.js загружен успешно!");

let state = {
    inventory: [],
    completedTasks: [],
    score: 0
};

// БЕЗОПАСНЫЙ ЗВУК
const sound = {
    play: (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.currentTime = 0;
            el.play().catch(() => console.warn("Звук заблокирован или не найден:", id));
        }
    }
};

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
            question: 'Which phrasal verb means "to enter"?',
            options: ['Go out', 'Go in'],
            correct: 'Go in',
            reward: 'silver_key'
        },
        media: '<img src="assets/box.png" style="width:100%; border-radius:12px;">',
        choices: [
            { text: 'Examine the note', next: 'scene_box_note', require: 'silver_key' },
            { text: 'Back to Gates', next: 'scene1' }
        ]
    },
    scene_box_note: {
        title: 'The Secret Note',
        text: 'The note says: "Do NOT trust the portraits. They are watching you."',
        media: '<img src="assets/box.png" style="width:100%; border-radius:12px;">',
        choices: [{ text: 'Back to Gates', next: 'scene1' }]
    },
    scene2_hall: {
        title: 'The Grand Hall',
        text: 'The door creaks open. You are inside.',
        media: '<video src="assets/hall-intro.mp4" autoplay loop muted playsinline style="width:100%; border-radius:12px;"></video>',
        choices: [{ text: 'Start over', next: 'scene1' }]
    }
};

function renderScene(id) {
    const data = scenes[id];
    if (!data) {
        console.error("Сцена не найдена:", id);
        return;
    }

    const gameArea = document.querySelector('.game');
    if (gameArea) gameArea.style.opacity = '0';

    setTimeout(() => {
        // Безопасное обновление элементов
        const titleEl = document.getElementById('scene-title');
        const textEl = document.getElementById('scene-text');
        const engEl = document.getElementById('mini-english-content');
        const scoreEl = document.getElementById('score-display');
        const invEl = document.getElementById('inventory-display');
        const mediaEl = document.getElementById('clue-media');

        if (titleEl) titleEl.innerText = data.title;
        if (textEl) textEl.innerHTML = data.text;
        if (engEl) engEl.innerHTML = data.english || '';
        if (scoreEl) scoreEl.innerText = `Score: ${state.score}`;
        
        if (invEl) {
            const itemNames = { 'silver_key': '🗝️ Key', 'access_hint': '📜 Radio Code' };
            const pretty = state.inventory.map(i => itemNames[i] || i);
            invEl.innerText = state.inventory.length ? 'Items: ' + pretty.join(', ') : 'Items: empty';
        }

        if (mediaEl) mediaEl.innerHTML = data.media || '';

        const choicesCont = document.querySelector('.choices');
        if (choicesCont) {
            choicesCont.innerHTML = '';
            if (data.task && !state.completedTasks.includes(data.task.id)) {
                renderTask(data.task, choicesCont, id);
            } else {
                renderChoices(data.choices, choicesCont);
            }
        }

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
            } else { alert('Try again!'); }
        };
        div.appendChild(b);
    });
    container.appendChild(div);
}

// ПРЯМАЯ ПРИВЯЗКА КНОПКИ (Без DOMContentLoaded для надежности)
window.onload = () => {
    const startBtn = document.getElementById('start-btn');
    console.log("Кнопка найдена:", !!startBtn);
    
    if (startBtn) {
        startBtn.onclick = () => {
            console.log("Клик по кнопке Старт сработал!");
            sound.play('uiClick');
            document.getElementById('start-screen').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('start-screen').style.display = 'none';
                document.getElementById('game-content').style.display = 'block';
                setTimeout(() => {
                    document.getElementById('game-content').style.opacity = '1';
                    sound.play('bgMusic');
                    renderScene('scene1');
                }, 50);
            }, 800);
        };
    }
};


