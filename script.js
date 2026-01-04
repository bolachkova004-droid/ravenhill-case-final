// Функция отрисовки сцены
function renderScene(id) {
    const scenes = {
        scene1: {
            title: 'Welcome to Ravenhill',
            text: 'You stand before the gates. It is quiet.',
            choices: [{ text: 'Go inside', next: 'scene2' }]
        },
        scene2: {
            title: 'The Hall',
            text: 'It is dark here.',
            choices: [{ text: 'Go back', next: 'scene1' }]
        }
    };
    const data = scenes[id];
    if (!data) return;

    document.getElementById('scene-title').innerText = data.title;
    document.getElementById('scene-text').innerText = data.text;
    
    const container = document.querySelector('.choices');
    container.innerHTML = '';
    data.choices.forEach(ch => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerText = ch.text;
        btn.onclick = () => renderScene(ch.next);
        container.appendChild(btn);
    });
}

// ГЛАВНЫЙ ОБРАБОТЧИК КЛИКА
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('start-btn');
    
    if (btn) {
        btn.addEventListener('click', () => {
            console.log("Клик сработал!");
            
            // Скрываем заставку
            document.getElementById('start-screen').style.opacity = '0';
            
            setTimeout(() => {
                document.getElementById('start-screen').style.display = 'none';
                const game = document.getElementById('game-content');
                game.style.display = 'block';
                setTimeout(() => {
                    game.style.opacity = '1';
                    renderScene('scene1');
                }, 50);
            }, 800);
        });
    } else {
        alert("Ошибка: Кнопка не найдена. Проверьте index.html!");
    }
});
