// Звуки
function play(id) {
  const audio = document.getElementById(id);
  if (audio) audio.play().catch(() => {});
}

// Старт
document.getElementById('start-btn').onclick = () => {
  document.getElementById('start-screen').style.display = 'none';
  const game = document.getElementById('game-content');
  game.style.display = 'block';
  game.classList.add('visible');
  play('bgMusic');
  loadScene('scene1');
};

// Сцены (пример, добавляй свои)
const scenes = {
  scene1: {
    title: 'Arrival at Ravenhill',
    text: 'You arrive at the old estate. One window is lit.',
    media: '<img src="assets/diary-mystical.png" alt="Diary">',
    choices: [
      { text: 'Read the diary', next: 'scene2_diary' },
      { text: 'Explore hall', next: 'scene_hall' }
    ]
  },
  scene2_diary: {
    title: 'Elizabeth\'s Diary',
    text: 'The handwriting changes abruptly...',
    media: '<img src="assets/diary-mystical.png" alt="Diary">',
    sound: 'diary-voice'
  },
  scene_hall: {
    title: 'The Grand Hall',
    text: 'Dust and shadows...',
    media: '<video src="assets/hall-intro.mp4" autoplay loop muted playsinline></video>'
  }
};

function loadScene(id) {
  const s = scenes[id];
  document.getElementById('scene-title').innerText = s.title;
  document.getElementById('scene-text').innerText = s.text;
  document.getElementById('clue-media').innerHTML = s.media || '';
  if (s.sound) play(s.sound);
  const ch = document.getElementById('choices');
  ch.innerHTML = '';
  (s.choices || []).forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerText = c.text;
    btn.onclick = () => loadScene(c.next);
    ch.appendChild(btn);
  });
}
