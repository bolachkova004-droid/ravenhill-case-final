// Регулировка громкости звуков
document.addEventListener('DOMContentLoaded', () => {
  const sounds = {
    bgMusic: 0.25,        // фон очень тихо
    clickSound: 0.9,      // клики громко
    stepSound: 0.85,      // шаги слышно
    diaryVoice: 0.7,
    sirHenryVoice: 0.7
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
    audio.play().catch(e => console.log('Audio error:', e));
  }
}

// Запуск игры
document.getElementById('start-btn').onclick = () => {
  const start = document.getElementById('start-screen');
  start.style.opacity = '0';
  playSound('clickSound');

  setTimeout(() => {
    start.style.display = 'none';
    const game = document.getElementById('game-content');
    game.style.display = 'block';
    setTimeout(() => {
      game.classList.add('visible');
      playSound('bgMusic');
      renderScene('scene1'); // старт с первой сцены
      console.log('Game started, rendering scene1');
    }, 50);
  }, 800);
};

// Сцены — полный пример с текстом, картинками, звуками
const scenes = {
  scene1: {
    title: 'Prologue · Arrival at Ravenhill',
    text: 'You are part of a small detective team. Tonight, you arrive at the old Ravenhill Estate. Only one window is still lit. Inside the hall lies a dusty table and an old diary bearing the name Elizabeth Ravenhill.',
    extra: 'The house feels alive, watching your every move.',
    media: '', // без картинки в первой сцене
    choices: [
      { text: 'Read the diary', next: 'scene2_diary' },
      { text: 'Explore the hall', next: 'scene2_hall' }
    ]
  },

  scene2_diary: {
    title: 'Elizabeth\'s Diary',
    text: 'The handwriting changes abruptly, as if written in fear. "The house feels different tonight. Soft footsteps echo in the halls. Someone is watching me."',
    extra: 'Pages are yellowed, with ink smudges from hasty writing.',
    media: '<img src="assets/diary-mystical.png" alt="Elizabeth\'s Diary" style="max-width:100%; border-radius:12px;">',
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
  console.log('Rendering scene:', id); // для отладки

  const scene = scenes[id];
  if (!scene) {
    console.log('Scene not found:', id);
    return;
  }

  playSound('stepSound');

  // Плавный fade-out
  document.querySelector('.game').style.opacity = '0';

  setTimeout(() => {
    // Обновляем текст
    document.getElementById('scene-title').innerText = scene.title;
    document.getElementById('scene-text').innerText = scene.text;
    document.getElementById('scene-extra').innerText = scene.extra || '';

    // Медиа (очищаем и добавляем)
    const mediaEl = document.getElementById('clue-media');
    mediaEl.innerHTML = scene.media || '';

    // Автоматическое добавление картинки дневника ТОЛЬКО в сценах с дневником
    if (id === 'scene2_diary' || id.includes('diary')) {
      const diaryImg = document.createElement('img');
      diaryImg.src = 'assets/diary-mystical.png';
      diaryImg.alt = 'Elizabeth\'s Diary';
      diaryImg.style.maxWidth = '100%';
      diaryImg.style.borderRadius = '12px';
      diaryImg.style.marginTop = '16px';
      mediaEl.appendChild(diaryImg);
    }

    // Кнопки выбора
    const choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML = '';
    (scene.choices || []).forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.innerText = choice.text;
      btn.onclick = () => renderScene(choice.next);
      choicesDiv.appendChild(btn);
    });

    // Плавное появление
    document.querySelector('.game').style.opacity = '1';
  }, 400);
}
