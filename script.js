// Глобальное состояние игры
let gameState = {
    score: 0,
    inventory: [],
    solvedTasks: [],
    currentScene: 'scene1'
};

const sounds = {
    play: (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.currentTime = 0;
            el.play().catch(() => {});
        }
    }
};

const scenes = {
    scene1: {
        title: 'Episode I · The Gates',
        text: 'You stand before the gates. They are <span class="vocab-word">locked</span>. You need to find a way to signal the caretaker.',
        english: '<b>Locked</b> — заперт на ключ.',
        media: '<img src="assets/gates.png" style="width:100%; border-radius:12px; margin-top:20px;">',
        choices: [
            { text: 'Use the Radio', next: 'scene_radio', points: 5 },
            { text: 'Look for a key in the garden', next: 'scene2_garden' }
        ]
    },
    scene2_garden: {
        title: 'The Garden Search',
        text: 'You find an old box. To open it, choose the synonym for "CHILLY":',
        task: {
            question: 'What is a synonym for "chilly"?',
            options: ['Hot', 'Cold', 'Bright'],
            correct: 'Cold',
            reward: 'silver_key'
        },
        media: '<img src="assets/garden.png" style="width:100%; border-radius:12px; margin-top:20px;">',
        choices: [
            { text: 'Back to Gates', next: 'scene1' }
        ]
    },
    scene_radio: {
        title: 'Radio Contact',
        text: 'The radio crackles. A voice asks for the "SECRET WORD" from the gates notice.',
        english: '<b>Secret</b> — секретный, тайный.',
        media: '<video src="assets/radio-scene.mp4" autoplay loop muted playsinline style="width:100%; border-radius:12px; margin-top:20px;"></video>',
        onEnter: () => sounds.play('radioSound'),
        choices: [
            { text: 'Enter the Hall (Requires Key)', next: 'scene2_hall', require: 'silver_key' },
            { text: 'Go to Garden', next: 'scene2_garden' }
        ]
    },
    scene2_hall: {
        title: 'The Grand Hall',
        text: 'You used the Silver Key to enter. The hall is silent.',
        media: '<video src="assets/hall-intro.mp4" autoplay loop muted playsinline style="width:100%; border-radius:12px; margin-top:20px;"></video>',
        choices: []
    }
};

function renderScene(id) {
    const data = scenes[id];
    if (!data) return;

    const gameArea = document.querySelector('.game');
    if (gameArea) gameArea.style.opacity = '0.5';

    setTimeout(() => {
        // Обновление текстов
        document.getElementById('scene-title').innerText = data.title;
        document.getElementById('scene-text').innerHTML = data.text;
        document.getElementById('mini-english-content').innerHTML = data.english || '';
        document.getElementById('score-display').innerText = `Score: ${gameState.score} | Inventory: ${gameState.inventory.join(', ') || 'Empty'}`;

        // Медиа
        const mediaCont = document.getElementById('clue-media');
        if (mediaCont) mediaCont.innerHTML = data.media || '';

        const choicesCont = document.querySelector('.choices');
        choicesCont.innerHTML = '';

        // Логика ЗАДАНИЙ
        if (data.task && !gameState.solvedTasks.includes(id)) {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'mini-english';
            taskDiv.innerHTML = `<p><b>Task:</b> ${data.task.question}</p>`;
            
            data.task.options.forEach(opt => {
                const optBtn = document.createElement('button');
                optBtn.className = 'choice-btn';
                optBtn.innerText = opt;
                optBtn.onclick = () => {
                    if (opt === data.task.correct) {
                        gameState.solvedTasks.push(id);
                        if (data.task.reward) gameState.inventory.push(data.task.reward);
                        gameState.score += 20;
                        alert('Correct! You found: ' + data.task.reward);
                        renderScene(id);
                    } else {
                        alert('Wrong! Try again.');
                    }
                };
                taskDiv.appendChild(optBtn);
            });
            choicesCont.appendChild(taskDiv);
        } else {
            // Логика ОБЫЧНЫХ КНОПОК
            data.choices.forEach(ch => {
                const btn = document.createElement('button');
                btn.className = 'choice-btn';
                
                // Проверка условий (инвентарь)
                const isLocked = ch.require && !gameState.inventory.includes(ch.require);
                btn.innerText = isLocked ? `🔒 ${ch.text}` : ch.text;
                btn.disabled = isLocked;

                btn.onclick = () => {
                    gameState.score += (ch.points || 0);
                    sounds.play('uiClick');
                    renderScene(ch.next);
                };
                choicesCont.appendChild(btn);
            });
        }

        if (data.onEnter) data.onEnter();
        if (gameArea) gameArea.style.opacity = '1';
        sounds.play('stepSound');
    }, 400);
}

// Слушатель старта
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.onclick = () => {
            sounds.play('uiClick');
            document.getElementById('start-screen').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('start-screen').style.display = 'none';
                const game = document.getElementById('game-content');
                game.style.display = 'block';
                setTimeout(() => {
                    game.style.opacity = '1';
                    sounds.play('bgMusic');
                    renderScene('scene1');
                }, 50);
            }, 800);
        };
    }
});

