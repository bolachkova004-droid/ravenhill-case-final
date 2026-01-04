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
    const scenes = {
  scene1: {
    title: 'Episode I · The Gates',
    text: 'You stand before the towering iron gates of Ravenhill. A cold wind rustles the dead leaves. To your left, a <span class="vocab-word" title="заброшенный">neglected</span> garden; ahead, the manor itself.',
    english: '<b>Neglected</b> — заброшенный, находящийся в запустении.',
    choices: [
      { text: 'Enter the Grand Hall', next: 'scene2_hall' },
      { text: 'Investigate the Garden', next: 'scene2_garden' }
    ]
  },
  scene2_hall: {
    title: 'The Grand Hall',
    text: 'The heavy oak door <span class="vocab-word" title="скрипеть">creaks</span> open. Dust motes dance in your flashlight beam. On a marble table lies a silver key and a leather-bound diary.',
    english: '<b>Creak</b> — скрипеть (о двери, поле).',
    choices: [
      { text: 'Take the Silver Key', next: 'scene3_key' },
      { text: 'Read the Diary', next: 'scene2_diary' }
    ]
  },
  scene2_diary: {
    title: 'Elizabeth\'s Confession',
    text: 'The diary belongs to Elizabeth Ravenhill. The last entry says: "He is not who he claims to be. The shadows are moving."',
    english: '<b>Entry</b> — запись (в дневнике или журнале).',
    sound: 'diary-voice',
    choices: [
      { text: 'Look for Elizabeth', next: 'scene3_stairs' },
      { text: 'Go back to Hall', next: 'scene2_hall' }
    ]
  },
  scene2_garden: {
    title: 'The Silent Garden',
    text: 'Among the withered roses, you find a stone statue of a weeping woman. Her eyes seem to follow you. You notice a hidden cellar door.',
    english: '<b>Withered</b> — увядший, высохший.',
    choices: [
      { text: 'Open the cellar door', next: 'scene3_cellar' },
      { text: 'Return to gates', next: 'scene1' }
    ]
  },
  scene3_key: {
    title: 'The Silver Key',
    text: 'You pocket the key. Suddenly, the front door slams shut. You are trapped inside. A faint piano music starts playing upstairs.',
    english: '<b>Slam shut</b> — захлопнуться с силой.',
    choices: [
      { text: 'Follow the music', next: 'scene3_stairs' }
    ]
  }
};

// ОБНОВЛЕННАЯ ФУНКЦИЯ РЕНДЕРА
function renderScene(id) {
  const data = scenes[id];
  if (!data) return;

  // Анимация затухания
  const gameArea = document.querySelector('.game');
  gameArea.style.opacity = '0';

  setTimeout(() => {
    // 1. Текст и заголовки
    document.getElementById('scene-title').innerText = data.title;
    document.getElementById('scene-text').innerHTML = data.text; // innerHTML для vocab-word

    // 2. Mini English блок
    const englishCont = document.getElementById('mini-english-content');
    if (englishCont) {
      englishCont.innerHTML = data.english || 'No new words in this scene.';
    }

    // 3. Звук
    if (data.sound) playSnd(data.sound);
    playSnd('stepSound');

    // 4. Кнопки
    const choicesCont = document.querySelector('.choices');
    choicesCont.innerHTML = '';
    data.choices.forEach(ch => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.innerText = ch.text;
      btn.onclick = () => {
          playSnd('clickSound'); // Клик теперь работает на всех кнопках
          renderScene(ch.next);
      };
      choicesCont.appendChild(btn);
    });

    // Появление
    gameArea.style.opacity = '1';
  }, 400);
}
