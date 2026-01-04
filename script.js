let score = 0;

// Управление звуками
const sounds = {
    play: (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.currentTime = 0;
            el.play().catch(e => console.log("Sound blocked:", id));
        }
    },
    stopAll: () => {
        // Остановка специфических звуков (например, голоса), если нужно
    }
};

// БАЗА ДАННЫХ СЦЕН (С картинками и видео)
const scenes = {
    scene1: {
        title: 'Episode I · The Summons',
        text: 'You stand before the towering gates of Ravenhill. The air is <span class="vocab-word">chilly</span>. A single light flickers in the window. You must find Elizabeth.',
        english: '<b>Chilly</b> — прохладно, зябко.',
        media: '', // Можно добавить фото ворот
        choices: [
            { text: 'Enter the Grand Hall', next: 'scene2_hall', points: 5 },
            { text: 'Search the Garden', next: 'scene2_garden', points: 10 }
        ]
    },
    scene2_hall: {
        title: 'The Grand Hall',
        text: 'The heavy oak door <span class="vocab-word">creaks</span> open. Dust motes dance in your flashlight beam. You see a grand staircase.',
        english: '<b>Creak</b> — скрипеть (о двери).',
        // ПРИМЕР ВИДЕО:
        media: '<video src="assets/hall-intro.mp4" autoplay loop muted playsinline style="width:100%; border-radius:12px; margin-top:20px;"></video>',
        choices: [
            { text: 'Read the Diary on the table', next: 'scene_diary', points: 15 },
            { text: 'Go Upstairs', next: 'scene_end', points: 5 }
        ]
    },
    scene2_garden: {
        title: 'The Silent Garden',
        text: 'The roses are <span class="vocab-word">withered</span>. In the shadows, you notice a stone statue that seems to be watching you.',
        english: '<b>Withered</b> — увядший, высохший.',
        // ПРИМЕР КАРТИНКИ:
        media: '<img src="assets/garden-statue.jpg" style="width:100%; border-radius:12px; margin-top:20px;" alt="Statue">',
        choices: [
            { text: 'Examine the statue', next: 'scene_statue', points: 20 },
            { text: 'Go to the Hall', next: 'scene2_hall', points: 5 }
        ]
    },
    scene_diary: {
        title: 'Elizabeth\'s Diary',
        text: 'The handwriting is shaky: "He is here. The one from the <span class="vocab-word">basement</span>. I must hide."',
        english: '<b>Basement</b> — подвал, цокольный этаж.',
        choices: [
            { text: 'Look for the basement', next: 'scene_end', points: 30 }
        ]
    },
    scene_end: {
        title: 'To be continued...',
        text: 'You have found the first clues. But the mystery of Ravenhill is just beginning.',
        english: '<b>Mystery</b> — тайна, загадка.',
        choices: [{ text: 'Restart Game', next: 'scene1', points: -score }]
    }
};

// ГЛАВНАЯ ФУНКЦИЯ ОТРИСОВКИ
function renderScene(id) {
    const data = scenes[id];
    if (!data) return;

    const gameArea = document.querySelector('.game');
    gameArea.style.opacity = '0'; // Затухание

    setTimeout(() => {
        // Тексты
        document.getElementById('scene-title').innerText = data.title;
        document.getElementById('scene-text').innerHTML = data.text;
        document.getElementById('mini-english-content').innerHTML = data.english || '';
        document.getElementById('score-display').innerText = `Score: ${score} points`;

        // Медиа (Картинки/Видео)
        const mediaCont = document.getElementById('clue-media');
        mediaCont.innerHTML = data.media || '';

        // Кнопки
        const choicesCont = document.querySelector('.choices');
        choicesCont.innerHTML = '';
        data.choices.forEach(ch => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerText = ch.text;
            btn.onclick = () => {
                score += (ch.points || 0);
                sounds.play('clickSound'); // radio-message.wav теперь играет только тут
                renderScene(ch.next);
            };
            choicesCont.appendChild(btn);
        });

        gameArea.style.opacity = '1'; // Появление
        sounds.play('stepSound');
    }, 400);
}

// ЗАПУСК ИГРЫ
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.onclick = () => {
            sounds.play('clickSound');
            
            const startScreen = document.getElementById('start-screen');
            startScreen.style.opacity = '0';

            setTimeout(() => {
                startScreen.style.display = 'none';
                const game = document.getElementById('game-content');
                game.style.display = 'block';
                
                setTimeout(() => {
                    game.style.opacity = '1';
                    sounds.play('bgMusic'); // Фоновая музыка включается ОДИН РАЗ при старте
                    renderScene('scene1');
                }, 50);
            }, 800);
        };
    }
});
