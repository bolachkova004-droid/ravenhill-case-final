let state = { inventory: [], completedTasks: [], score: 0 };

const sound = {
    play: (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.currentTime = 0;
            if (id === 'uiClick') el.volume = 1.0; // Клики громко
            el.play().catch(e => console.log("Sound error:", id));
        }
    }
};

const scenes = {
    scene1: {
        title: 'Episode I · The Summons',
        text: 'You stand before the gates. Your radio starts buzzing.',
        media: '<img src="assets/gates.png" style="width:100%; border-radius:12px;">',
        choices: [{ text: 'Answer the Radio', next: 'scene_radio' }]
    },
    scene_radio: {
        title: 'Radio Message',
        text: 'Static noise... then a voice: "Find the key in the garden!"',
        onEnter: () => sound.play('radioSound'), // РАДИО ИГРАЕТ ТОЛЬКО ТУТ
        media: '<video src="assets/radio-scene.mp4" autoplay loop muted playsinline style="width:100%; border-radius:12px;"></video>',
        choices: [{ text: 'Go to Garden', next: 'scene_garden' }]
    },
    scene_garden: {
        title: 'The Garden',
        text: 'You see a <span class="vocab-word">concealed</span> box.',
        english: '<b>Concealed</b> — скрытый.',
        media: '<img src="assets/garden.png" style="width:100%; border-radius:12px;">',
        choices: [{ text: 'Open the box', next: 'scene_box_task' }]
    },
    scene_box_task: {
        title: 'The Mysterious Box',
        text: 'Solve to open: "The detective decided to _____ into the room."',
        task: {
            id: 'task_go_in',
            question: 'Which phrasal verb means "to enter"?',
            options: ['Go out', 'Go in'],
            correct: 'Go in',
            reward: 'silver_key'
        },
        media: '<img src="assets/box.png" style="width:100%; border-radius:12px;">',
        choices: [{ text: 'Enter the Hall', next: 'scene2_hall', require: 'silver_key' }]
    },
    scene2_hall: {
        title: 'The Grand Hall',
        text: 'The door creaks open. A woman stands by the stairs.',
        media: '<video src="assets/hall-intro.mp4" autoplay loop muted playsinline style="width:100%; border-radius:12px;"></video>',
        choices: [{ text: 'Talk to her', next: 'scene1' }] // Зациклил для теста
    }
};

function renderScene(id) {
    const data = scenes[id];
    if (!data) return;

    document.getElementById('scene-title').innerText = data.title;
    document.getElementById('scene-text').innerHTML = data.text;
    document.getElementById('mini-english-content').innerHTML = data.english || '';

    // ИНВЕНТАРЬ
    const itemNames = { 'silver_key': '🗝️ Silver Key' };
    document.getElementById('score-display').innerText = `Score: ${state.score}`;
    const invEl = document.getElementById('inventory-display');
    if (invEl) {
        const pretty = state.inventory.map(id => itemNames[id] || id);
        invEl.innerText = state.inventory.length ? 'Items: ' + pretty.join(', ') : 'Items: empty';
    }

    document.getElementById('clue-media').innerHTML = data.media || '';
    const container = document.querySelector('.choices');
    container.innerHTML = '';

    if (data.task && !state.completedTasks.includes(data.task.id)) {
        renderTask(data.task, container, id);
    } else {
        data.choices.forEach(ch => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            const locked = ch.require && !state.inventory.includes(ch.require);
            btn.innerText = locked ? `🔒 ${ch.text}` : ch.text;
            btn.disabled = locked;
            btn.onclick = () => { sound.play('uiClick'); renderScene(ch.next); };
            container.appendChild(btn);
        });
    }

    if (data.onEnter) data.onEnter();
    sound.play('stepSound');
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
