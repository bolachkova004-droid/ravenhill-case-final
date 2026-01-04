// Ждем, пока вся страница (и кнопка) загрузится
window.onload = () => {
    console.log("Игра готова к запуску!");

    const startBtn = document.getElementById('start-btn');
    
    if (startBtn) {
        startBtn.onclick = () => {
            console.log("Кнопка нажата!");
            
            // 1. Пытаемся воспроизвести звук (если не сработает - не страшно)
            const clickSnd = document.getElementById('clickSound');
            if (clickSnd) {
                clickSnd.play().catch(e => console.log("Звук заблокирован или не найден"));
            }

            // 2. Анимация исчезновения стартового экрана
            const startScreen = document.getElementById('start-screen');
            if (startScreen) {
                startScreen.style.opacity = '0';
                startScreen.style.pointerEvents = 'none'; // Чтобы больше нельзя было нажать
            }

            // 3. Через 0.8 секунд полностью убираем заставку и включаем игру
            setTimeout(() => {
                if (startScreen) startScreen.style.display = 'none';
                
                const gameContent = document.getElementById('game-content');
                if (gameContent) {
                    gameContent.style.display = 'block';
                    // Плавное появление игры
                    setTimeout(() => {
                        gameContent.style.opacity = '1';
                        // Запускаем фоновую музыку
                        const bgMusic = document.getElementById('bgMusic');
                        if (bgMusic) bgMusic.play().catch(e => {});
                        // Рендерим первую сцену
                        renderScene('scene1');
                    }, 50);
                }
            }, 800);
        };
    } else {
        console.error("Кнопка start-btn не найдена в HTML!");
    }
};

// Функция отрисовки сцен (оставьте её как была)
function renderScene(id) {
    const scenes = {
        scene1: {
            title: 'Episode I · The Summons',
            text: 'You stand before the gates of Ravenhill Estate. A cold wind rustles the dead leaves.',
            choices: [
                { text: 'Enter the Grand Hall', next: 'scene2_hall' }
            ]
        },
        scene2_hall: {
            title: 'The Grand Hall',
            text: 'The heavy door creaks open. You are inside.',
            choices: []
        }
    };

    const scene = scenes[id];
    if (!scene) return;

    document.getElementById('scene-title').innerText = scene.title;
    document.getElementById('scene-text').innerHTML = scene.text;
    
    const container = document.querySelector('.choices');
    if (container) {
        container.innerHTML = '';
        scene.choices.forEach(ch => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerText = ch.text;
            btn.onclick = () => renderScene(ch.next);
            container.appendChild(btn);
        });
    }
}

