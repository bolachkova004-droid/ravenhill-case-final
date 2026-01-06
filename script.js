// 1. СОСТОЯНИЕ ИГРЫ (Здесь хранится прогресс)
let state = {
    inventory: [],      // Список предметов (например, ['silver_key'])
    completedTasks: [], // Список решенных задачек
    score: 0            // Очки за правильные ответы
};

// 2. ЗВУКОВОЙ ДВИЖОК
const sound = {
    play: (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.currentTime = 0;
            el.play().catch(e => console.log("Sound error:", id));
        }
    }
};

// 3. БАЗА ДАННЫХ СЦЕН (Ваш сюжет и задания)
const scenes = {
    scene1: {
        title: 'Episode I · The Gates',
        text: 'You stand before the towering gates. They are <span class="vocab-word">locked</span>. You need to <b>find out</b> how to enter. What does "find out" mean?',
        // ЗАДАНИЕ (B1-B2: Phrasal Verbs)
        task: {
            id: 'task_find_out',
            question: 'Complete: "I need to find out..."',
            options: ['...where the key is.', '...the door with a key.'],
            correct: '...where the key is.',
            reward: 'access_hint' // Награда за правильный ответ
        },
        english: '<b>Find out</b> — выяснить, узнать информацию.',
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
            options: ['Go out', 'Go in', 'Go off'],
            correct: 'Go in',
            reward: 'silver_key'
        },
        choices: [{ text: 'Return to Garden', next: 'scene_garden' }]
    },
    scene2_hall: {
        title: 'The Grand Hall',
        text: 'The heavy door creaks open. You are inside Ravenhill Estate.',
        media: '<video src="assets/hall-intro.mp4" autoplay loop muted playsinline style="width:100%; border-radius:12px;"></video>',
        choices: [{ text: 'To be continued...', next: 'scene1' }]
    }
};

// 4. ГЛАВНАЯ ФУНКЦИЯ ОТРИСОВКИ
function renderScene(id) {
    const data = scenes[id];
    if (!data) return;

    const gameArea = document.querySelector('.game');
    gameArea.style.opacity = '0'; // Эффект затухания

    setTimeout(() => {
        // Заполняем тексты и статус
        document.getElementById('scene-title').innerText = data.title;
        document.getElementById('scene-text').innerHTML = data.text;
        document.getElementById('mini-english-content').innerHTML = data.english || '';
        document.getElementById('score-display').innerText = `Score: ${state.score} | Items: ${state.inventory.join(', ') || 'None'}`;
        document.getElementById('clue-media').innerHTML = data.media || '';

        const choicesCont = document.querySelector('.choices');
        choicesCont.innerHTML = '';

        // ПРОВЕРКА: ЕСТЬ ЛИ В СЦЕНЕ НЕВЫПОЛНЕННОЕ ЗАДАНИЕ?
        if (data.task && !state.completedTasks.includes(data.task.id)) {
            renderTask(data.task, choicesCont, id);
        } else {
            renderChoices(data.choices, choicesCont);
        }

        gameArea.style.opacity = '1'; // Появление
        sound.play('stepSound');
    }, 400);
}

// 5. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ (Кнопки и Задания)
function renderChoices(choices, container) {
    choices.forEach(ch => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        
        // Проверка: есть ли у игрока нужный предмет для этой кнопки?
        const isLocked = ch.require && !state.inventory.includes(ch.require);
        btn.innerText = isLocked ? `🔒 ${ch.text}` : ch.text;
        btn.disabled = isLocked;

        btn.onclick = () => {
            sound.play('uiClick');
            renderScene(ch.next);
        };
        container.appendChild(btn);
    });
}

function renderTask(task, container, sceneId) {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task-panel';
    taskDiv.innerHTML = `<p style="margin-bottom:15px;"><b>Grammar Task:</b> ${task.question}</p>`;
    
    task.options.forEach(opt => {
        const optBtn = document.createElement('button');
        optBtn.className = 'choice-btn';
        optBtn.style.marginBottom = "10px";
        optBtn.innerText = opt;
        optBtn.onclick = () => {
            if (opt === task.correct) {
                state.completedTasks.push(task.id);
                if (task.reward) state.inventory.push(task.reward);
                state.score += 50;
                sound.play('uiClick');
                alert('Correct! Answer unlocked.');
                renderScene(sceneId); // Перерисовываем сцену, чтобы показать обычные кнопки
            } else {
                alert('Try again! Focus on the context.');
            }
        };
        taskDiv.appendChild(optBtn);
    });
    container.appendChild(taskDiv);
}

// 6. СТАРТ ИГРЫ
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
