// Регулировка громкости звуков
document.addEventListener('DOMContentLoaded', () => {
  const sounds = {
    'bgMusic': 0.25,        // ID в HTML: bgMusic
    'clickSound': 0.9,      // ID в HTML: clickSound
    'stepSound': 0.85,      // ID в HTML: stepSound
    'diary-voice': 0.7,     // ИСПРАВЛЕНО: было diaryVoice (не совпадало с ID в HTML)
    'sir-henry-voice': 0.7  // ИСПРАВЛЕНО: было sirHenryVoice
  };

  Object.keys(sounds).forEach(id => {
    const audio = document.getElementById(id);
    if (audio) audio.volume = sounds[id];
  });
});

// Простая функция воспроизведения
function playSound(id) {
  const audio = document.getElementById(id);
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(e => console.warn('Audio playback blocked:', e));
  }
}

// Запуск игры
document.getElementById('start-btn').onclick = () => {
  const start = document.getElementById('start-screen');
  const game = document.getElementById('game-content');
  
  start.style.opacity = '0';
  playSound('clickSound');

  setTimeout(() => {
    start.style.display = 'none';
    game.style.display = 'block';
    
    // Небольшая задержка для запуска анимации появления
    setTimeout(() => {
      game.classList.add('visible');
      playSound('bgMusic');
      renderScene('scene1');
    }, 50);
  }, 800);
};

// Сцены
const scenes = {
  scene1: {
    title: 'Prologue · Arrival at Ravenhill',
    text: 'You are part of a small detective team. Tonight, you arrive at the old Ravenhill Estate. Only one window is still lit. Inside the hall lies a dusty table and an old diary bearing the name Elizabeth Ravenhill.',
    extra: 'The house feels alive, watching your every move.',
    media: '', 
    choices: [
      { text: 'Read the diary', next: 'scene2_diary' },
      { text: 'Explore the hall', next: 'scene2_hall' }
    ]
  },

  scene2_diary: {
    title: 'Elizabeth\'s Diary',
    text: 'The handwriting changes abruptly, as if written in fear. "The house feels different tonight. Soft footsteps echo in the halls. Someone is watching me."',
    extra: 'Pages are yellowed, with ink smudges from hasty writing.',
    media: '', // ИСПРАВЛЕНО: удален текст <img...>, так как он добавляется ниже через JS
    sound: 'diary-voice',
    choices: [
      { text: 'Continue reading', next: 'scene3' },
      { text: 'Back to hall', next: 'scene1' }
    ]
  },

  scene2_hall: {
    title: 'The Grand Hall',
    text: 'Dust covers antique furniture. A grand staircase leads upstairs. Moonlight streams through tall windows.',
    media: '<video src="assets/hall-intro.mp4" autoplay loop muted playsinline style="max-width:100%; border-radius:12px;"></video>',
    choices: [
      { text: 'Examine the portrait', next: 'scene_portrait' },
      { text: 'Search for clues', next: 'scene_clues' }
    ]
  },

  scene3: {
    title: 'To be continued...',
    text: 'The mystery deepens. More episodes coming soon!',
    choices: []
  }
};

// Основная функция рендера сцены
function renderScene(id) {
  const scene = scenes[id];
  if (!scene) return;

  playSound('stepSound');
  if (scene.sound) playSound(scene.sound);

  const gameArea = document.querySelector('.game');
  gameArea.style.opacity = '0'; // Плавное исчезновение

  setTimeout(() => {
    document.getElementById('scene-title').innerText = scene.title;
    document.getElementById('scene-text').innerText = scene.text;
    document.getElementById('scene-extra').innerText = scene.extra || '';

    // Медиа
    const mediaEl = document.getElementById('clue-media');
    mediaEl.innerHTML = scene.media || '';

    // Логика добавления картинки дневника
    if (id.includes('diary')) {
      const diaryImg = document.createElement('img');
      diaryImg.src = 'assets/diary-mystical.png';
      diaryImg.alt = 'Elizabeth\'s Diary';
      diaryImg.className = 'clue-img'; // используйте классы вместо инлайн-стилей
      mediaEl.appendChild(diaryImg);
    }

    // Кнопки выбора
    // ИСПРАВЛЕНО: в HTML у вас <section class="choices">, а не id="choices"
    const choicesContainer = document.querySelector('.choices');
    choicesContainer.innerHTML = ''; 
    
    (scene.choices || []).forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.innerText = choice.text;
      btn.onclick = () => renderScene(choice.next);
      choicesContainer.appendChild(btn);
    });

    gameArea.style.opacity = '1'; // Плавное появление
  }, 400);
}
