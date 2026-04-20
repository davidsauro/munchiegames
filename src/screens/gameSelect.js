import { registerSoundBtn, toggleSound } from '../audio.js';

const GAMES = [
  {
    id: 'game1',
    title: '🐸 Find the Numbers',
    desc: 'Move Munchie around the grid and eat all the numbers that match the prompt.',
    topics: {
      K: '• Numbers 1 to 10\n• Greater than / less than',
      1: '• Numbers 1 to 20\n• Odd and even\n• + and − equations',
      2: '• Two-digit numbers\n• Even / odd\n• Harder + and − equations',
      3: '• Multiples of 2–9\n• × and ÷ equations\n• Odd and even',
    },
  },
  {
    id: 'game2',
    title: '🍽️ Eat the Answer',
    desc: 'An answer appears above Munchie. Move left or right to eat the equation that equals it.',
    topics: {
      K: '• Addition within 10\n• Subtraction within 10',
      1: '• Addition within 20\n• Subtraction within 20',
      2: '• Two-digit + and −\n• Harder equations',
      3: '• Multiplication\n• Division',
    },
  },
];

const GRADE_LABELS = { K: 'K', 1: '1', 2: '2', 3: '3' };
const GRADE_CLASSES = { K: 'gk', 1: 'g1', 2: 'g2', 3: 'g3' };

let onSelect = null;

export function initGameSelect(container, selectCallback) {
  onSelect = selectCallback;
  container.innerHTML = buildHTML();
  const sndBtn = container.querySelector('#gs-snd-btn');
  registerSoundBtn(sndBtn);
  sndBtn.addEventListener('click', toggleSound);
  container.querySelectorAll('.gs-grade-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const gameId = btn.dataset.game;
      const grade = btn.dataset.grade;
      onSelect(gameId, grade);
    });
  });
}


function buildHTML() {
  const gameCards = GAMES.map(game => `
    <div class="gs-game-card">
      <div class="gs-game-header">
        <div>
          <div class="gs-game-title">${game.title}</div>
          <div class="gs-game-desc">${game.desc}</div>
        </div>
      </div>
      <div class="gs-grade-row">
        ${Object.keys(GRADE_LABELS).map(g => `
          <button class="gs-grade-btn grade-btn ${GRADE_CLASSES[g]}" data-game="${game.id}" data-grade="${g}">
            <div class="grade-header">
              <p class="grade-label">${g === 'K' ? 'Kinder' : 'Grade ' + g}</p>
            </div>
            <div class="grade-body">
              <p class="grade-topics">${game.topics[g].replace(/\n/g, '<br>')}</p>
            </div>
          </button>
        `).join('')}
      </div>
    </div>
  `).join('');

  return `
    <div id="gs-header">
      <div>
        <div class="gs-main-title">🐸 Munchie's Math Munch</div>
        <div class="gs-main-sub">Pick a game and a grade to start!</div>
      </div>
      <button class="snd-btn" id="gs-snd-btn" title="Toggle sound">🔊</button>
    </div>
    <div id="gs-games">${gameCards}</div>
  `;
}
