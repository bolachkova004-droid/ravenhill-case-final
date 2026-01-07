// --- 1. ПЕРЕМЕННЫЕ СОСТОЯНИЯ ---
let inventory = new Set();
let failedAttempts = 0;

// --- 2. ОБЪЕКТ ВСЕХ СЦЕН ---
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
            { text: 'Go to Gates with Key', next: 'scene1', require: 'silver_key' }
        ]
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
        text: 'Behind a portrait, you find a keypad. "Only the one who _____ (understand) the past can enter."',
        task: {
            id: 'task_modal',
            question: 'Grammar check:',
            options: ['must have been', 'must be'],
            correct: 'must have been',
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
            { text: 'Examine the Desk', next: 'scene_study_desk' }
        ]
    },
    scene_diary: {
        title: 'Elizabeth\'s Diary',
        text: 'Elizabeth\'s voice fills the room. She sounds scared, but <span class="vocab-word">determined</span>.',
        task: {
            id: 'task_diary',
            question: 'What is she afraid of?',
            options: ['The house', 'The weather'],
            correct: 'The house',
            reward: 'diary_clue'
        },
        english: '<b>Determined</b> — решительный.',
        media: '<img src="assets/diary-mystical.png" style="width:100%; border-radius:12px;">',
        choices: [{ text: 'Back to the Study', next: 'scene_study' }]
    },
    scene_study_desk: {
        title: 'The Mahogany Desk',
        text: 'On the desk, you find a letter. It _____ (write) by Elizabeth.',
        task: {
            id: 'task_passive',
            question: 'Choose Passive Voice:',
            options: ['was written', 'was write'],
            correct: 'was written',
            reward: 'basement_map'
        },
        media: '<img src="assets/desk.png" style="width:100%; border-radius:12px;">',
        choices: [
            { text: 'Look for the trapdoor', next: 'scene_trapdoor', require: 'basement_map' }
        ]
    },
    scene_trapdoor: {
        title: 'The Trapdoor',
        text: 'The map leads you to a rug. "If I _____ (be) you, I would leave now."',
        task: {
            id: 'task_if',
            question: 'Conditionals:',
            options: ['were', 'am'],
            correct: 'were',
            reward: 'trapdoor_open'
        },
        media: '<img src="assets/trapdoor.png" style="width:100%; border-radius:12px;">',
        choices: [{ text: 'Enter Basement', next: 'scene_basement', require: 'trapdoor_open' }]
    },
    scene_basement: {
        title: 'The Basement',
        text: 'It is pitch black. Suddenly, the door slams shut! You are <span class="vocab-word">trapped</span>.',
        english: '<b>Trapped</b> — в ловушке.',
        media: '<img src="assets/basement.png" style="width:100%; border-radius:12px;">',
        choices: [{ text: 'Who is there?', next: 'scene_caretaker' }]
    },
    scene_caretaker: {
        title: 'The Caretaker',
        text: '"I wish you _____ (not/find) that photo," says an old man.',
        task: {
            id: 'task_wish',
            question: 'B2 Regrets:',
            options: ['hadn\'t found', 'didn\'t find'],
            correct: 'hadn\'t found',
            reward: 'caretaker_key'
        },
        media: '<img src="assets/caretaker.png" style="width:100%; border-radius:12px;">',
        choices: [{ text: 'Persuade him', next: 'scene_escape', require: 'caretaker_key' }]
    },
    scene_escape: {
        title: 'The Escape',
        text: 'He lets you out. "Go to the <span class="vocab-word">attic</span>, detective!"',
        english: '<b>Attic</b> — чердак.',
        media: '<video src="assets/hall-intro.mp4" autoplay loop muted playsinline style="width:100%; border-radius:12px;"></video>',
        choices: [{ text: 'Go to the Attic', next: 'scene_attic' }]
    },
    scene_attic: {
        title: 'The Attic',
        text: 'You find a trunk. "I _____ (look) for this for ages!"',
        task: {
            id: 'task_present_perfect_cont',
            question: 'Tense check:',
            options: ['have been looking', 'had looked'],
            correct: 'have been looking',
            reward: 'elizabeth_letter'
        },
        media: '<img src="assets/attic.png" style="width:100%; border-radius:12px;">',
        choices: [{ text: 'Finish Episode 1', next: 'scene_final' }]
    },
    scene_final: {
        title: 'End of Episode 1',
        text: 'The mystery is almost solved. TO BE CONTINUED...',
        media: '<img src="assets/letter-close-up.png" style="width:100%; border-radius:12px;">',
        choices: [{ text: 'Start Over', next: 'scene1' }]
    }
};

// --- 3. ГЛАВНАЯ ФУНКЦИЯ ОТРИСОВКИ ---
function renderScene(sceneId) {
    const scene = scenes[sceneId];
    if (!scene) return;

    const textElement = document.getElementById('scene-text');
    const choicesContainer = document.getElementById('choices-container');
    const mediaContainer = document.getElementById('media-container');
    const englishElement = document.getElementById('english-note');

    // Отрисовка медиа
    if (mediaContainer) mediaContainer.innerHTML = scene.media || '';

    // Отрисовка английской заметки
    if (englishElement) englishElement.innerHTML = scene.english || '';

    // Плавное появление текста
    if (textElement) {
        textElement.classList.remove('visible');
        setTimeout(() => {
            textElement.innerHTML = scene.text;
            textElement.classList.add('visible');
        }, 50);
    }

    // Отрисовка кнопок
    if (choicesContainer) {
        choicesContainer.innerHTML = '';
        
        if (scene.task && !inventory.has(scene.task.reward)) {
            renderTask(scene.task, choicesContainer, sceneId);
        } else {
            scene.choices.forEach(choice => {
                if (!choice.require || inventory.has(choice.require)) {
                    const btn = document.createElement('button');
                    btn.innerText = choice.text;
                    btn.className = 'choice-btn';
                    btn.onclick = () => renderScene(choice.next);
                    choicesContainer.appendChild(btn);
                }
            });
        }
    }
}

// --- 4. ЛОГИКА ЗАДАНИЙ ---
function renderTask(task, container, sceneId) {
    const qText = document.createElement('p');
    qText.innerHTML = `<b>TASK:</b> ${task.question}`;
    container.appendChild(qText);

    task.options.forEach(option => {
        const btn = document.createElement('button');
        btn.innerText = option;
        btn.className = 'choice-btn task-btn';
        btn.onclick = () => {
            if (option === task.correct) {
                alert("Correct! You earned a reward.");
                inventory.add(task.reward);
                renderScene(sceneId); // Перерисовываем сцену, чтобы открыть кнопки
            } else {
                failedAttempts++;
                alert(failedAttempts >= 2 ? "Hint: Think about the grammar context!" : "Try again!");
            }
        };
        container.appendChild(btn);
    });
}

// --- 5. ЗАПУСК ИГРЫ ---
window.onload = () => {
    renderScene('scene1');
};
