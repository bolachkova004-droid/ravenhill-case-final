// 1. Настройка звуков с проверкой на существование
document.addEventListener('DOMContentLoaded', () => {
    const sounds = {
        'bgMusic': 0.25,
        'clickSound': 0.8,
        'stepSound': 0.6,
        'diary-voice': 0.9,      // Исправлено: ID должен быть как в HTML
        'sir-henry-voice': 0.9
    };

    Object.keys(sounds).forEach(id => {
        const audio = document.getElementById(id);
        if (audio) {
            audio.volume = sounds[id];
        } else {
            console.warn(`Audio element with id "${id}" not found.`);
        }
    });
});

// 2. Функция воспроизведения
function playSound(id) {
    const audio = document.getElementById(id);
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log('Playback blocked by browser:', id));
    }
}

// 3. Данные сцен
const scenes = {
    scene1: {
        title: 'Prologue · Arrival at Ravenhill',
        text: 'You arrive at the old Ravenhill Estate. Only one window is still lit. Inside the hall lies a dusty table and an old diary bearing the name Elizabeth Ravenhill.',
        extra: 'The house feels alive, watching your every move.',
        choices: [
            { text: 'Read the diary', next: 'scene2_diary' },
            { text: 'Explore the hall', next: 'scene2_hall' }
        ]
    },
    scene2_diary: {
        title: 'Elizabeth\'s Diary',
        text: 'The handwriting changes abruptly: "The house feels different tonight. Someone is watching me."',
        extra: 'The ink is still fresh in some places...',
        sound: 'diary-voice',
        choices: [
            { text: 'Look around the room', next: 'scene2_hall' }
        ]
    },
    scene2_hall: {
        title: 'The Grand Hall',
        text: 'Dust covers antique furniture. A grand staircase leads upstairs. Moonlight streams through tall windows.',
        media: '<video src="assets/hall-intro.mp4" autoplay loop muted playsinline style="max-width:100%; border-radius:12px;"></video>',
        choices: [
            { text: 'Go upstairs', next: 'scene3' },
            { text: 'Check the diary again', next: 'scene2_diary' }
        ]
    },
    scene3: {
        title: 'To be continued...',
        text: 'The mystery deepens. More episodes coming soon!',
        choices: []
    }
};

// 4. Логика запуска игры
document.getElementById('start-btn').onclick = function() {
    const startScreen = document.getElementById('start-screen');
    const gameContent = document.getElementById('game-content');
    
    // Скрываем стартовый экран
    startScreen.style.opacity = '0';
    playSound('clickSound');

    setTimeout(() => {
        startScreen.style.display = 'none';
        gameContent.style.display = 'block'; // Показываем блок игры
        
        setTimeout(() => {
            gameContent.classList.add('visible');
            playSound('bgMusic');
            renderScene('scene1'); // Запускаем первую сцену
        }, 50);
    }, 800);
};

// 5. Функция отрисовки сцены (исправленная)
function renderScene(sceneId) {
    const scene = scenes[sceneId];
    if (!scene) return;

    // Находим основные контейнеры
    const gameArea = document.querySelector('.game');
    const titleEl = document.getElementById('scene-title');
    const textEl = document.getElementById('scene-text');
    const extraEl = document.getElementById('scene-extra');
    const mediaEl = document.getElementById('clue-media');
    const choicesContainer = document.querySelector('.choices'); // Важно: .choices это класс!

    // Эффект затухания
    if (gameArea) gameArea.style.opacity = '0';

    setTimeout(() => {
        // Заполняем текст
        if (titleEl) titleEl.innerText = scene.title;
        if (textEl) textEl.innerText = scene.text;
        if (extraEl) extraEl.innerText = scene.extra || '';

        // Звук сцены
        if (scene.sound) playSound(scene.sound);
        playSound('stepSound');

        // Медиа
        if (mediaEl) {
            mediaEl.innerHTML = scene.media || '';
            // Если это сцена с дневником, добавляем картинку
            if (sceneId.includes('diary')) {
                mediaEl.innerHTML += '<img src="assets/diary-mystical.png" style="max-width:100%; border-radius:12px; margin-top:20px;" alt="Diary">';
            }
        }

        // Кнопки
        if (choicesContainer) {
            choicesContainer.innerHTML = '';
            scene.choices.forEach(choice => {
                const btn = document.createElement('button');
                btn.className = 'choice-btn';
                btn.innerText = choice.text;
                btn.onclick = () => renderScene(choice.next);
                choicesContainer.appendChild(btn);
            });
        }

        // Появление
        if (gameArea) gameArea.style.opacity = '1';
    }, 400);
}
