// --- 1. СОСТОЯНИЕ ИГРЫ ---
let inventory = new Set();
let score = 0;

const itemNames = {
    'access_hint': '📜 Radio Hint',
    'silver_key': '🗝️ Silver Key',
    'housekeeper_trust': '🤝 Housekeeper Trust',
    'secret_code': '🔢 Secret Code',
    'diary_clue': '📓 Elizabeth\'s Diary',
    'basement_map': '🗺️ Basement Map',
    'caretaker_key': '🔑 Cell Key',
    'trapdoor_open': '🔓 Trapdoor Unlocked'
};

function updateStatus() {
    const scoreDisplay = document.getElementById('score-display');
    const invDisplay = document.getElementById('inventory-display');
    if (scoreDisplay) scoreDisplay.innerText = `Score: ${score} points`;
    if (invDisplay) {
        const displayItems = Array.from(inventory).map(id => itemNames[id] || id).join(', ');
        invDisplay.innerText = `Inventory: ${displayItems || 'empty'}`;
    }
}

// --- 2. ФУНКЦИЯ СТАРТА ---
function startGame() {
    const startScreen = document.getElementById('start-screen');
    const gameContent = document.getElementById('game-container');
    
    // Прячем заставку
    if (startScreen) startScreen.style.display = 'none';
    // Показываем игру
    if (gameContent) gameContent.style.display = 'block';
    
    // Включаем музыку
    const music = document.getElementById('bgMusic');
    if (music) music.play().catch(e => console.log("Music blocked"));
    
    renderScene('scene1'); // Запускаем первую сцену
}

   
// Привязка кнопки старта
const startBtn = document.querySelector('.start-btn');
if (startBtn) { startBtn.onclick = startGame; }

// --- 3. ВСЕ СЦЕНЫ (Пути проверены по вашим скриншотам) ---
const scenes = {
    scene1: {
        title: 'The Iron Gates',
        text: 'You stand before the gates. A small plaque says: "Private Property." You need to <b>find out</b> who lives here.',
        task: { 
            question: 'What is the closest synonym for "permission"?', 
            options: ['Authorization', 'Prohibition'], 
            correct: 'Authorization', 
            reward: 'access_hint' 
        },
        english: '<b>Find out</b> — выяснить.',
        media: '<img src="assets/gates.png" class="clue-img">',
        choices: [{ text: 'Search the Garden', next: 'scene_garden' }]
    },
    scene_garden: {
        title: 'The Withered Garden',
        text: 'Among the roses, you find a hidden box. A note says: "The key was hidden by the housekeeper."',
        task: { 
            question: 'Who is the person mentioned in the note?', 
            options: ['The Housekeeper', 'The Detective'], 
            correct: 'The Housekeeper', 
            reward: 'garden_clue' 
        },
        media: '<img src="assets/garden.png" class="clue-img">',
        choices: [{ text: 'Open the box', next: 'scene_box_task' }]
    },
    scene_box_task: {
        title: 'The Puzzle Box',
        text: 'To open the box, complete the sentence: "If I ____ (have) the key, I would open this manor immediately."',
        task: { 
            question: 'Choose the correct form (unreal present):', 
            options: ['had', 'have'], 
            correct: 'had', 
            reward: 'silver_key' 
        },
        // ДОБАВИЛИ КАРТИНКУ ТУТ:
        media: '<img src="assets/box.png" class="clue-img">', 
        choices: [{ text: 'Go to the Main Hall', next: 'scene2_hall', require: 'silver_key' }]
    },
    scene2_hall: {
        title: 'The Grand Hall',
        text: 'The manor is vast. You see a nervous housekeeper and doors leading to different rooms.',
        media: '<video src="assets/hall-intro.mp4" autoplay loop muted class="clue-img"></video>',
        choices: [
            { text: 'Investigate the Library', next: 'scene_library' },
            { text: 'Check the Kitchen', next: 'scene_kitchen' },
            { text: 'Talk to Housekeeper', next: 'scene_housekeeper' },
            { text: 'Examine the Portrait', next: 'scene_portrait_secret', require: 'housekeeper_trust' }
        ]
    },
    scene_kitchen: {
        title: 'The Cold Kitchen',
        text: 'A silver tray ____ (leave) on the counter by someone in a hurry.',
        task: { 
            question: 'Passive Voice (Past):', 
            options: ['was left', 'left'], 
            correct: 'was left', 
            reward: 'poison_clue' 
        },
        media: '<img src="assets/kitchen.png" class="clue-img">',
        choices: [{ text: 'Back to Hall', next: 'scene2_hall' }]
    },
    scene_library: {
        title: 'The Silent Library',
        text: 'You find two letters. "Sir Henry ____ (must/be) terrified if he left his luggage behind," you deduce.',
        task: { 
            question: 'Which shows a strong deduction about the past?', 
            options: ['must have been', 'could be'], 
            correct: 'must have been', 
            reward: 'library_clue' 
        },
        media: '<img src="assets/library.png" class="clue-img">',
        choices: [{ text: 'Back to Hall', next: 'scene2_hall' }]
    },
    scene_housekeeper: {
        title: 'The Housekeeper',
        text: '"Detective, I\'ve been working here for 20 years. Sir Henry has been acting strange recently."',
        task: { 
            question: 'Based on the context, the housekeeper feels:', 
            options: ['Anxious', 'Indifferent'], 
            correct: 'Anxious', 
            reward: 'housekeeper_trust' 
        },
        media: '<img src="assets/housekeeper.png" class="clue-img">',
        choices: [{ text: 'Back to Hall', next: 'scene2_hall' }]
    },
    scene_portrait_secret: {
        title: 'The Secret Keypad',
        text: 'Behind a painting, you find a keypad. It requires a code.',
        task: { 
            question: 'Modal Deduction: "He must ____ (be) here."', 
            options: ['have been', 'had been'], 
            correct: 'have been', 
            reward: 'secret_code' 
        },
        media: '<img src="assets/sir-henry.jpg" class="clue-img">',
        choices: [{ text: 'Open the Study', next: 'scene_study', require: 'secret_code' }]
    },
    scene_study: {
        title: 'The Hidden Study',
        text: 'A room filled with secrets. You see a mahogany desk and a diary.',
        media: '<img src="assets/study.png" class="clue-img">',
        choices: [
            { text: 'Listen to the Diary', next: 'scene_diary' },
            { text: 'Find the Trapdoor', next: 'scene_trapdoor', require: 'library_clue' }
        ]
    },
    scene_diary: {
        title: 'Elizabeth\'s Diary',
        text: 'Elizabeth\'s voice fills the room: "Find the trapdoor!"',
        onEnter: () => playSound('diary-voice'),
        media: '<img src="assets/diary-mystical.png" class="clue-img">',
        choices: [{ text: 'Return to Study', next: 'scene_study' }]
    },
    scene_trapdoor: {
        title: 'The Trapdoor',
        text: 'A hidden passage leads down to the basement.',
        media: '<img src="assets/trapdoor.png" class="clue-img">',
        choices: [{ text: 'Go down', next: 'scene_basement' }]
    },
    scene_basement: {
        title: 'The Basement',
        text: 'Suddenly, the door slams shut! You are trapped.',
        media: '<img src="assets/basement.png" class="clue-img">',
        choices: [{ text: 'Who is there?', next: 'scene_caretaker' }]
    },
    scene_caretaker: {
        title: 'The Caretaker',
        text: '"I wish you ____ (stay) away from our family business."',
        task: { 
            question: 'Wish about the past (regret):', 
            options: ['had stayed', 'stayed'], 
            correct: 'had stayed', 
            reward: 'caretaker_trust' 
        },
        media: '<img src="assets/caretaker.png" class="clue-img">',
        choices: [{ text: 'Approach Elizabeth', next: 'scene_elizabeth_reveal', require: 'caretaker_trust' }]
    },
    scene_elizabeth_reveal: {
        title: 'The Final Reveal',
        text: 'Elizabeth whispers: "If you hadn\'t come, I ____ (not/survive) this night."',
        task: { 
            question: 'Third Conditional:', 
            options: ['wouldn\'t have survived', 'didn\'t survive'], 
            correct: 'wouldn\'t have survived', 
            reward: 'final_clue' 
        },
        media: '<img src="assets/elizabeth.png" class="clue-img">',
        choices: [{ text: 'ESCAPE TOGETHER (FINISH EPISODE I)', next: 'scene_final' }]
    },
    scene_final: { title: 'To Be Continued', text: 'You saved Elizabeth! Episode II coming soon.', choices: [{ text: 'Restart', next: 'scene1' }] }
};


// --- 4. ДВИЖОК ОТРИСОВКИ ---
function renderScene(sceneId) {
    const scene = scenes[sceneId];
    if (!scene) return;

    // Обновляем текст и медиа
    const titleEl = document.getElementById('scene-title');
    const textEl = document.getElementById('scene-text');
    const mediaBox = document.getElementById('media-container');
    const dictBox = document.getElementById('dictionary-display');

    if (titleEl) titleEl.innerText = scene.title;
    if (textEl) textEl.innerHTML = scene.text;
    if (mediaBox) mediaBox.innerHTML = scene.media || '';
    if (dictBox) dictBox.innerHTML = scene.english || 'No new vocabulary here.';
    
    if (scene.onEnter) scene.onEnter();
    updateStatus();

    const choicesContainer = document.getElementById('choices-container');
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
                    btn.onclick = () => {
                        const s = document.getElementById('uiClick');
                        if(s) s.play();
                        renderScene(choice.next);
                    };
                    choicesContainer.appendChild(btn);
                }
            });
        }
    }
}

function renderTask(task, container, sceneId) {
    const qText = document.createElement('p');
    qText.className = 'task-question';
    qText.innerHTML = `<b>TASK:</b> ${task.question}`;
    container.appendChild(qText);

    task.options.forEach(option => {
        const btn = document.createElement('button');
        btn.innerText = option;
        btn.className = 'choice-btn task-btn';
        btn.onclick = () => {
            if (option === task.correct) {
                alert("Correct!");
                score += 10;
                inventory.add(task.reward);
                renderScene(sceneId);
            } else {
                alert("Wrong. Try again!");
            }
        };
        container.appendChild(btn);
    });
}
