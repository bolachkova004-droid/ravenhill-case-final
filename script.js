let score = 0;

const sounds = {
    play: (id) => {
        const el = document.getElementById(id);
        if (el) el.play().catch(() => {});
    }
};

const scenes = {
    scene1: {
        title: 'Episode I · The Summons',
        text: 'You stand before the towering gates of Ravenhill. The air is <span class="vocab-word">chilly</span>. A single light flickers in the window. You must find Elizabeth.',
        english: '<b>Chilly</b> — прохладно, зябко.',
        choices: [
            { text: 'Enter the Grand Hall', next: 'scene2_hall', points: 5 },
            { text: 'Search the Garden', next: 'scene2_garden', points: 10 }
        ]
    },
    scene2_hall: {
        title: 'The Grand Hall',
        text: 'The door <span class="vocab-word">creaks</span> open. Inside, you see a dusty table with an old diary and a silver key.',
        english: '<b>Creak</b> — скрипеть (о двери).',
        choices: [
            { text: 'Read the Diary', next: 'scene_diary', points: 15 },
            { text: 'Take the Key', next: 'scene_key', points: 20 }
        ]
    },
    scene2_garden: {
        title: 'The Silent Garden',
        text: 'The roses are <span class="vocab-word">withered</span>. Under a stone bench, you find a small wooden box.',
        english: '<b>Withered</b> — увядший.',
        choices: [
            { text: 'Open the box', next: 'scene_box', points: 25 },
            { text: 'Go to the Hall', next: 'scene2_hall', points: 5 }
        ]
    },
    scene_diary: {
        title: 'Elizabeth\'s Diary',
        text: 'The last entry says: "The house is hiding something beneath the floorboards." You hear footsteps upstairs.',
        english: '<b>Beneath</b> — под, внизу.',
        choices: [{ text: 'Go upstairs', next: 'scene_end', points: 30 }]
    },
    scene_end: {
        title: 'To be continued...',
        text: 'The mystery deepens! You have collected enough evidence for now.',
        english: '<b>Evidence</b> — улики, доказательства.',
        choices: []
    }
};

function renderScene(id) {
    const data = scenes[id];
    if (!data) return;

    // Плавная смена текста
    const sceneBlock = document.querySelector('.scene');
    sceneBlock.style.opacity = '0.5';

    setTimeout(() => {
        document.getElementById('scene-title').innerText = data.title;
        document.getElementById('scene-text').innerHTML = data.text;
        document.getElementById('mini-english-content').innerHTML = data.english || 'No new words here.';
        document.getElementById('score-display').innerText = `Score: ${score} points`;

        const container = document.querySelector('.choices');
        container.innerHTML = '';

        data.choices.forEach(ch => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerText = ch.text;
            btn.onclick = () => {
                score += ch.points || 0;
                sounds.play('clickSound');
                renderScene(ch.next);
            };
            container.appendChild(btn);
        });

        sceneBlock.style.opacity = '1';
        sounds.play('stepSound');
    }, 300);
}

// Запуск
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
