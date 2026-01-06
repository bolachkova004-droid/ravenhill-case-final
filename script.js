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

// 2. БАЗА ДАННЫХ СЦЕН
const scenes = {
    scene1: {
        title: 'Episode I · The Gates',
        text: 'You stand before the towering gates. They are <span class="vocab-word">locked</span>. You need to <b>find out</b> how to enter.',
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
            { text: 'Enter the Hall (Requires Hint)', next: 'scene2_hall', require: 'access_hint' }
        ]
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
        text: 'To open the box, choose the correct phrasal verb: "The detective decided to _____ the room."',
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
        english: '<b>Folded</b> — сложенный (о бумаге).',
        media: '<img src="assets/box.png" style="width:100%; border-radius:12px;">',
        choices: [{ text: 'Go back to Gates', next: 'scene1' }]
    },
    scene2_hall: {
        title: 'The Grand Hall',
        text: 'The door creaks open. You are inside Ravenhill Estate. The air is cold and heavy.',
        media: '<video src="assets/hall-intro.mp4" autoplay loop muted playsinline style="width:100%; border-radius:12px;"></video>',
        choices: [{ text: 'Examine the Portrait', next: 'scene_portrait' }]
    },
    scene_portrait: {
        title: 'Sir Henry\'s Portrait',
        text: 'A stern man looks at you from the frame. You remember the note from the garden...',
        media: '<img src="assets/sir-henry.jpg" style="width:100%; border-radius:12px;">',
        choices: [{ text: 'Search for a secret mechanism', next: 'scene1' }]
    }
};

// 3. ГЛАВНАЯ ФУНКЦИЯ ОТРИСОВКИ
function renderScene(id) {
    const data = scenes[id];
    if (!data) return;

    const gameArea = document.querySelector('.game');
    gameArea.style.opacity = '0';

    setTimeout(() => {
        document.getElementById('scene-title').innerText = data.title;
        document.getElementById('scene-text').innerHTML = data.text;
        document.getElementById('mini-english-content').innerHTML = data.english || '';
        
        // ОБНОВЛЕНИЕ СТАТУСА (Раздельно)
        document.getElementById('score-display').innerText = `Score: ${state.score} points`;
        const invEl = document.getElementById('inventory-display');
        if (invEl) invEl.innerText = state.inventory.length ? 'Inventory: ' + state.inventory.join(', ') : 'Inventory: empty';

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

// 4. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
function renderChoices(choices, container) {
    choices.forEach(ch => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        const isLocked = ch.require && !state.inventory.includes(ch.require);
        btn.innerText = isLocked ? `🔒 ${ch.text}` : ch.text;
        btn.disabled = isLocked;
        btn.onclick = () => { sound.play('uiClick'); renderScene(ch.next); };
        container.appendChild(btn);
    });
}

function renderTask(task, container, sceneId) {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task-panel';
    taskDiv.innerHTML = `<p style="margin-bottom:10px;"><b>Task:</b> ${task.question}</p>`;
    task.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.style.marginBottom = '8px';
        btn.innerText = opt;
        btn.onclick = () => {
            if (opt === task.correct) {
                state.completedTasks.push(task.id);
                if (task.reward) state.inventory.push(task.reward);
                state.score += 50;
                sound.play('uiClick');
                renderScene(sceneId);
            } else {
                alert('Wrong! Try again.');
            }
        };
        taskDiv.appendChild(btn);
    });
    container.appendChild(taskDiv);
}

// 5. СТАРТ
document.getElementById('start-btn').onclick = () => {
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
