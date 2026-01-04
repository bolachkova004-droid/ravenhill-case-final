// Звуки — регулируем громкость сразу
document.addEventListener('DOMContentLoaded', () => {
  const bgMusic = document.getElementById('bgMusic');
  const clickSound = document.getElementById('clickSound');
  const stepSound = document.getElementById('stepSound');

  if (bgMusic) bgMusic.volume = 0.25; // фон тише
  if (clickSound) clickSound.volume = 0.8; // клики громче
  if (stepSound) stepSound.volume = 0.7; // шаги средне
});

// Простая функция воспроизведения звука
function playSound(id) {
  const audio = document.getElementById(id);
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(e => console.log('Audio error:', e));
  }
}

// Старт игры — плавный переход без мигания
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
      renderScene('scene1'); // ← ОБЯЗАТЕЛЬНО вызываем первую сцену!
      console.log('Game started, rendering scene1'); // для отладки
    }, 50);
  }, 800);
};

// Сцены — пример, добавляй свои
const scenes = {
  scene1: {
    title: 'Prologue · Arrival at Ravenhill',
    text: 'You are part of a small detective team. Tonight, you arrive at the old Ravenhill Estate. Only one window is still lit. Inside the hall lies a dusty table and an old diary bearing the name Elizabeth Ravenhill.',
    extra: 'The house feels alive, watching your every move.',
    media: '<img src="assets/diary-mystical.png" alt="Elizabeth\'s Diary" style="max-width:100%; border-radius:12px;">',
    choices: [
      { text: 'Read the diary', next: 'scene2_diary' },
      { text: 'Explore the hall', next: 'scene2_hall' }
    ]
  },

  scene2_diary: {
    title: 'Elizabeth\'s Diary',
    text: 'The handwriting changes abruptly, as if written in fear. "The house feels different tonight. Soft footsteps echo in the halls. Someone is watching me."',
    extra: 'Pages are yellowed, with ink smudges from hasty writing.',
    media: '<img src="assets/diary-mystical.png" alt="Diary" style="max-width:100%; border-radius:12px;">',
    sound: 'diary-voice',
    task: 'CAE B2 · Fill in the blanks: The house feels ___ tonight. (different) / Soft ___ echo in the halls. (footsteps)',
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
// Функция загрузки сцены
function renderScene(id) {
  const scene = scenes[id];
  if (!scene) return;

  playSound('stepSound');

  // Плавный fade-out текущей сцены
  document.querySelector('.game').style.opacity = '0';

  setTimeout(() => {
    document.getElementById('scene-title').innerText = scene.title;
    document.getElementById('scene-text').innerText = scene.text;
    document.getElementById('scene-extra').innerText = scene.extra || '';
    document.getElementById('clue-media').innerHTML = scene.media || '';

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

    // Показываем твои картинки автоматически
    if (id.includes('diary')) {
      const diaryImg = document.createElement('img');
      diaryImg.src = 'assets/diary-mystical.png';
      diaryImg.alt = 'Elizabeth\'s Diary';
      diaryImg.style.maxWidth = '100%';
      diaryImg.style.borderRadius = '12px';
      document.getElementById('clue-media').appendChild(diaryImg);
    }

    if (id.includes('henry')) {
      const henryImg = document.createElement('img');
      henryImg.src = 'assets/sir-henry.jpeg';
      henryImg.alt = 'Sir Henry Ravenhill';
      henryImg.style.maxWidth = '80%';
      henryImg.style.borderRadius = '12px';
      henryImg.style.boxShadow = '0 8px 24px rgba(0,0,0,0.6)';
      document.getElementById('clue-media').appendChild(henryImg);
    }

    // Плавное появление
    document.querySelector('.game').style.opacity = '1';
  }, 400);
}
