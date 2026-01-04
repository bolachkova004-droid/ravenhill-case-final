// Функция для безопасного поиска элементов
const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelector(sel);

// Настройка звуков
document.addEventListener('DOMContentLoaded', () => {
    const volumes = { 'bgMusic': 0.2, 'clickSound': 0.7, 'stepSound': 0.5 };
    Object.keys(volumes).forEach(id => {
        if ($(id)) $(id).volume = volumes[id];
    });
});

function playSnd(id) {
    if ($(id)) $(id).play().catch(() => {});
}

// Данные сцен
const scenes = {
    scene1: {
        title: 'Arrival at Ravenhill',
        text: 'You stand before the gates of Ravenhill Estate. The air is cold, and the silence is unsettling. A single light flickers in the upstairs window.',
        choices: [
            { text: 'Enter the Hall', next: 'scene2_hall' },
            { text: 'Look around the garden', next: 'scene_garden' }
        ]
    },
    scene2_hall: {
        title: 'The Grand Hall',
        text: 'The door creaks open. Inside, a dusty table holds an old diary. You hear a faint whisper from the shadows.',
        choices: [
            { text: 'Open the diary', next: 'scene1' }
        ]
    }
};

// Кнопка СТАРТ
if ($('start-btn')) {
    $('start-btn').onclick = () => {
        console.log("Start clicked");
        playSnd('clickSound');
        
        // 1. Прячем стартовый экран
        if ($('start-screen')) {
            $('start-screen').style.opacity = '0';
            setTimeout(() => $('start-screen').style.display = 'none', 600);
        }

        // 2. Показываем игру
        const game = $('game-content');
        if (game) {
            game.classList.add('visible');
            playSnd('bgMusic');
            renderScene('scene1');
        }
    };
}

// Функция рендера
function renderScene(id) {
    const data = scenes[id];
    if (!data) return;

    // Заполняем текст (с проверкой на существование ID)
    if ($('scene-title')) $('scene-title').innerText = data.title;
    if ($('scene-text')) $('scene-text').innerText = data.text;
    
    // Очищаем медиа и кнопки
    const media = $('clue-media');
    if (media) media.innerHTML = data.media || '';

    const choicesCont = $$('.choices');
    if (choicesCont) {
        choicesCont.innerHTML = '';
        data.choices.forEach(ch => {
            const b = document.createElement('button');
            b.className = 'choice-btn';
            b.innerText = ch.text;
            b.onclick = () => {
                playSnd('stepSound');
                renderScene(ch.next);
            };
            choicesCont.appendChild(b);
        });
    }
    
    console.log("Scene rendered:", id);
}
