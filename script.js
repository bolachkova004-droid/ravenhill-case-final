let state = {
    inventory: [],
    completedTasks: [],
    score: 0
};

const sound = {
    play: (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.currentTime = 0;
            if (id === 'uiClick') el.volume = 1.0;
            el.play().catch(() => {});
        }
    }
};

const scenes = {
    scene1: {
        title: 'Episode I · The Summons',
        text: 'You stand before the gates of Ravenhill. Your radio starts buzzing. You need to <b>find out</b> what is happening.',
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
            { text: 'Use Radio Hint', next: 'scene_radio', require: 'access_hint' },
            { text: 'Enter Hall (Requires Key)', next: 'scene2_hall', require: 'silver_key' }
        ]
    },
    scene_radio: {
        title: 'Radio Message',
        text: 'Static noise... then a voice: "Detective, check the garden! There is a box hidden near the roses."',
        onEnter: () => sound.play('radioSound'),
        media: '<video src="assets/radio-scene.mp4" autoplay loop muted playsinline style="width:100%; border-radius:12px;"></video>',
        choices: [{ text: 'Go to Garden', next: 'scene_garden' }]
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
            { text: 'Go to Gates with Key', next: 'scene1' }
        ]
    },
    scene_box_note: {
        title: 'The Secret Note',
        text: 'The note says: "Do NOT trust the portraits. They are watching you."',
        english: '<b>Folded</b> — сложенный.',
        media: '<img src="assets/box.png" style="width:100%; border-radius:12px;">',
        choices: [{ text: 'Go to Gates', next: 'scene1' }]
    },
    scene2_hall: {
        title: 'The Grand Hall',
        text: 'The door creaks open. A woman in a black dress stands by the stairs. She looks <span class="vocab-word">terrified</span>.',
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
            question: 'Which is correct about the past?',
            options: ['He must have been rich.', 'He must be rich yesterday.'],
            correct: 'He must have been rich.',
            reward: 'secret_code'
        },
        media: '<img src="assets/sir-henry.jpg" style="width:100%; border-radius:12px;">',
        choices: [{ text: 'Open the Secret Study', next: 'scene_study', require: 'secret_code' }]
    },
    scene_study: {
        title: 'Sir Henry\'s Study',
        text: 'The wall swings open. You enter a secret room filled with maps.',
        media: '<img src="assets/study.png" style="width:100%; border-radius:12px;">',
        choices: [{ text: 'To be continued...', next: 'scene1' }]
    }
};

function renderScene(id) {
    const data = scenes[id];
    if (!data) return;

    const gameArea = document.querySelector('.game');
    gameArea.style.opacity = '0';

    setTimeout(() => {
        document.getElementById('scene-title').innerText = data.title;
        document.getElementById('scene-text').innerHTML = data.text;
        document.getElementById('mini-english-content').innerHTML = data.english || '';

        // ИНВЕНТАРЬ
        const itemNames = {
            'silver_key': '🗝️ Silver Key',
            'access_hint': '📜 Radio Code',
            'housekeeper_trust': '🤝 Trust',
            'secret_code': '🔢 Code'
        };
        document.getElementById('score-display').innerText = `Score: ${state.score} points`;
        const invEl = document.getElementById('inventory-display');
        if (invEl) {
            const pretty = state.inventory.map(i => itemNames[i] || i);
            invEl.innerText = state.inventory.length ? 'Inventory: ' + pretty.join(', ') : 'Inventory: empty';
        }

        document.getElementById('clue-media').innerHTML = data.media || '';
        const choicesCont = document.querySelector('.choices');
        choicesCont.innerHTML = '';

        if (data.task && !state.completedTasks.includes(data.task.id)) {
            renderTask(data.task, choicesCont, id);
        } else {
            data.choices.forEach(ch => {
                const btn = document.createElement('button');
                btn.className = 'choice-btn';
                const locked = ch.require && !state.inventory.includes(ch.require);
                btn.innerText = locked ? `🔒 ${ch.text}` : ch.text;
                btn.disabled = locked;
                btn.onclick = () => { sound.play('uiClick'); renderScene(ch.next); };
                choicesCont.appendChild(btn);
            });
        }

        if (data.onEnter) data.onEnter();
        gameArea.style.opacity = '1';
        sound.play('stepSound');
    }, 400);
}

function renderTask(task, container, sceneId) {
    const div = document.createElement('div');
    div.className = 'task-panel';
    div.innerHTML = `<p style="margin-bottom:15px;"><b>Task:</b> ${task.question}</p>`;
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
            } else { alert('Try again!'); }
        };
        div.appendChild(b);
    });
    container.appendChild(div);
}

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
