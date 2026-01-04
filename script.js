let score = 0;

const sounds = {
    play: (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.currentTime = 0;
            el.play().catch(e => console.log("Sound blocked:", id));
        }
    }
};

const scenes = {
    scene1: {
        title: 'Episode I · The Summons',
        text: 'You stand before the towering gates of Ravenhill. The air is <span class="vocab-word">chilly</span>. A single light flickers in the window. You must find Elizabeth.',
        english: '<b>Chilly</b> — прохладно, зябко.',
        media: '<img src="assets/gates.jpg" style="width:100%; border-radius:12px; margin-top:20px;" alt="Gates">', 
        choices: [
            { text: 'Enter the Grand Hall', next: 'scene2_hall', points: 5 },
            { text: 'Search the Garden', next: 'scene2_garden', points: 10 }
        ]
    },
    scene2_hall: {
        title: 'The Grand Hall',
        text: 'The heavy oak door <span class="vocab-word">creaks</span> open. Dust motes dance in your flashlight beam. You see a grand staircase.',
        english: '<b>Creak</b> — скрипеть (о двери).',
        // Путь с папкой assets:
        media: '<video src="assets/hall-intro.mp4" autoplay loop muted playsinline style="width:100%; border-radius:12px; margin-top:20px;"></video>',
        choices: [
            { text: 'Read the Diary', next: 'scene_diary', points: 15 }
        ]
    },
    scene2_garden: {
        title: 'The Silent Garden',
        text: 'The roses are <span class="vocab-word">withered</span>. In the shadows, you notice a stone statue.',
        english: '<b>Withered</b> — увядший.',
        // Путь с папкой assets:
        media: '<img src="assets/garden-statue.jpg" style="width:100%; border-radius:12px; margin-top:20px;" alt="Statue">',
        choices: [
            { text: 'Go to the Hall', next: 'scene2_hall', points: 5 }
        ]
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
        document.getElementById('score-display').innerText = `Score: ${score} points`;

        const mediaCont = document.getElementById('clue-media');
        if (mediaCont) mediaCont.innerHTML = data.media || '';

        const choicesCont = document.querySelector('.choices');
        choicesCont.innerHTML = '';
        data.choices.forEach(ch => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerText = ch.text;
            btn.onclick = () => {
                score += (ch.points || 0);
                sounds.play('clickSound');
                renderScene(ch.next);
            };
            choicesCont.appendChild(btn);
        });

        gameArea.style.opacity = '1';
        sounds.play('stepSound');
    }, 400);
}

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.onclick = () => {
            sounds.play('clickSound');
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
