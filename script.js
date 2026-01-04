let score = 0;

// Установка громкости (выкручиваем клики на максимум)
document.addEventListener('DOMContentLoaded', () => {
    const vol = {
        'bgMusic': 0.2,    // Фоновая музыка тихо
        'radioSound': 0.9, // Радио громко
        'uiClick': 1.0,    // Кнопки МАКСИМАЛЬНО громко
        'stepSound': 0.7,
        'diary-voice': 0.9
    };
    Object.keys(vol).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.volume = vol[id];
    });
});

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
        title: 'Episode I · The Summons',
        text: 'You stand before the gates of Ravenhill. Suddenly, your <span class="vocab-word">walkie-talkie</span> starts buzzing.',
        english: '<b>Walkie-talkie</b> — рация.',
        media: '<img src="assets/gates.png" style="width:100%; border-radius:12px; margin-top:20px;">',
        choices: [
            { text: 'Answer the radio', next: 'scene_radio' },
            { text: 'Ignore and enter the Hall', next: 'scene2_hall' }
        ]
    },
    scene_radio: {
        title: 'Radio Message',
        text: 'The signal is weak. A voice says: "Detective, do not trust the portraits. They are <span class="vocab-word">watching</span>."',
        english: '<b>Watching</b> — наблюдают.',
        // Радио играет ТОЛЬКО ЗДЕСЬ и сопровождается видео помех
        media: '<video src="assets/radio-scene.mp4" autoplay loop muted playsinline style="width:100%; border-radius:12px; margin-top:20px;"></video>',
        onEnter: () => sounds.play('radioSound'), 
        choices: [
            { text: 'Enter the Grand Hall', next: 'scene2_hall' }
        ]
    },
    scene2_hall: {
        title: 'The Grand Hall',
        text: 'The heavy door creaks open. You are in the main hall.',
        media: '<video src="assets/hall-intro.mp4" autoplay loop muted playsinline style="width:100%; border-radius:12px; margin-top:20px;"></video>',
        choices: [
            { text: 'Read the Diary', next: 'scene_diary' }
        ]
    },
    scene_diary: {
        title: 'Elizabeth\'s Diary',
        text: 'The diary is open. You hear Elizabeth\'s voice in your head.',
        media: '<img src="assets/diary-mystical.png" style="width:100%; border-radius:12px; margin-top:20px;">',
        onEnter: () => sounds.play('diary-voice'),
        choices: [{ text: 'Go back to Hall', next: 'scene2_hall' }]
    }
};

function renderScene(id) {
    const data = scenes[id];
    if (!data) return;

    const gameArea = document.querySelector('.game');
    gameArea.style.opacity = '0.5';

    setTimeout(() => {
        document.getElementById('scene-title').innerText = data.title;
        document.getElementById('scene-text').innerHTML = data.text;
        document.getElementById('mini-english-content').innerHTML = data.english || '';

        const mediaCont = document.getElementById('clue-media');
        if (mediaCont) mediaCont.innerHTML = data.media || '';

        const choicesCont = document.querySelector('.choices');
        choicesCont.innerHTML = '';
        data.choices.forEach(ch => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerText = ch.text;
            btn.onclick = () => {
                sounds.play('uiClick'); // Громкий клик на каждую кнопку
                renderScene(ch.next);
            };
            choicesCont.appendChild(btn);
        });

        if (data.onEnter) data.onEnter();
        gameArea.style.opacity = '1';
    }, 400);
}

// СТАРТ
document.getElementById('start-btn').onclick = () => {
    sounds.play('uiClick');
    document.getElementById('start-screen').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('game-content').style.display = 'block';
        setTimeout(() => {
            document.getElementById('game-content').style.opacity = '1';
            sounds.play('bgMusic');
            renderScene('scene1');
        }, 50);
    }, 800);
};
