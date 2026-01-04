// Настройки звука
const playSnd = (id) => {
    const el = document.getElementById(id);
    if (el) el.play().catch(() => {});
};

// База данных сцен
const scenes = {
    scene1: {
        title: 'Episode I · The Summons',
        text: 'You stand before the gates of Ravenhill Estate. A cold wind rustles the dead leaves. To your left, a <span class="vocab-word">neglected</span> garden; ahead, the manor itself.',
        english: '<b>Neglected</b> — заброшенный, в запустении.',
        choices: [
            { text: 'Enter the Grand Hall', next: 'scene2_hall' },
            { text: 'Investigate the Garden', next: 'scene2_garden' }
        ]
    },
    scene2_hall: {
        title: 'The Grand Hall',
        text: 'The heavy door <span class="vocab-word">creaks</span> open. Inside, you find a dusty table with an old diary.',
        english: '<b>Creak</b> — скрипеть.',
        choices: [
            { text: 'Read the Diary', next: 'scene2_diary' },
            { text: 'Go Back', next: 'scene1' }
        ]
    },
    scene2_diary: {
        title: 'The Diary',
        text: 'The handwriting is shaky: "The house is watching me." You hear a sound from upstairs.',
        english: '<b>Shaky</b> — дрожащий.',
        sound: 'diary-voice',
        choices: [{ text: 'Go upstairs', next: 'scene3' }]
    },
    scene2_garden: {
        title: 'The Garden',
        text: 'The roses are <span class="vocab-word">withered</span>. You find a strange silver key on the ground.',
        english: '<b>Withered</b> — увядшие.',
        choices: [{ text: 'Take the key and go to Hall', next: 'scene2_hall' }]
    },
    scene3: {
        title: 'To be continued...',
        text: 'The mystery deepens. Episode II coming soon!',
        choices: []
    }
};

// Функция отрисовки
function renderScene(id) {
    const scene = scenes[id];
    if (!scene) return;

    document.getElementById('scene-title').innerText = scene.title;
    document.getElementById('scene-text').innerHTML = scene.text;
    document.getElementById('mini-english-content').innerHTML = scene.english || '';
    
    if (scene.sound) playSnd(scene.sound);
    playSnd('stepSound');

    const container = document.querySelector('.choices');
    container.innerHTML = '';
    scene.choices.forEach(ch => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerText = ch.text;
        btn.onclick = () => {
            playSnd('clickSound');
            renderScene(ch.next);
        };
        container.appendChild(btn);
    });
}

// Запуск игры
document.getElementById('start-btn').onclick = () => {
    playSnd('clickSound');
    document.getElementById('start-screen').style.opacity = '0';
    
    setTimeout(() => {
        document.getElementById('start-screen').style.display = 'none';
        const game = document.getElementById('game-content');
        game.style.display = 'block';
        setTimeout(() => {
            game.style.opacity = '1';
            playSnd('bgMusic');
            renderScene('scene1');
        }, 50);
    }, 800);
};
