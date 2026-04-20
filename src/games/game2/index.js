import './style.css';
import { generateRound } from './prompts.js';
import { sfxMove, sfxCorrect, sfxWrong, sfxWin, sfxLose, stopAllAudio } from '../../audio.js';
import { launchFireworks, stopFireworks } from '../../fireworks.js';

const WIN = 3, LOSE = 3;
let G = {}, grade = null, goBack = null;

export function mountGame2(container, g, onGoBack) {
  grade = g;
  goBack = onGoBack;
  container.innerHTML = buildHTML();
  container.querySelector('#g2-play-again-btn').addEventListener('click', () => {
    stopFireworks(); stopAllAudio(); initGame();
  });
  container.querySelectorAll('.g2-back-btn').forEach(btn =>
    btn.addEventListener('click', () => { stopFireworks(); stopAllAudio(); goBack(); })
  );
  initGame();
}

function buildHTML() {
  return `
  <div id="g2-screen" style="display:flex;flex-direction:column;align-items:center;gap:16px;">
    <div id="g2-answer-box">
      <div id="g2-answer-label">Answer</div>
      <div id="g2-answer-value">—</div>
    </div>
    <div id="g2-arena">
      <div class="g2-eq-cell gap-right" id="g2-left"></div>
      <div class="g2-frog-cell" id="g2-frog">🐸</div>
      <div class="g2-eq-cell gap-left" id="g2-right"></div>
    </div>
    <div style="font-size:12px;color:var(--color-text-secondary);">← → move &nbsp;|&nbsp; Space eat</div>
    <div id="g2-scores">
      <div class="g2-score-group">
        <div class="g2-score-label">Correct</div>
        <div class="g2-slots">
          <div class="result-slot" id="g2-c0"></div>
          <div class="result-slot" id="g2-c1"></div>
          <div class="result-slot" id="g2-c2"></div>
        </div>
      </div>
      <div class="g2-score-group">
        <div class="g2-score-label">Wrong</div>
        <div class="g2-slots">
          <div class="result-slot" id="g2-w0"></div>
          <div class="result-slot" id="g2-w1"></div>
          <div class="result-slot" id="g2-w2"></div>
        </div>
      </div>
    </div>
    <button class="action-btn g2-back-btn" style="font-size:12px;padding:6px 14px;">← Change game</button>

    <div class="overlay" id="g2-end-overlay" style="display:none;position:absolute;top:0;left:0;right:0;bottom:0;">
      <canvas id="fw-canvas"></canvas>
      <div class="overlay-content" id="g2-overlay-content">
        <div id="g2-ov-anim"></div>
        <h2 id="g2-ov-title"></h2>
        <p id="g2-ov-msg"></p>
        <div class="btn-row" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;">
          <button class="action-btn" id="g2-play-again-btn">Play again</button>
          <button class="action-btn g2-back-btn">Change game</button>
        </div>
      </div>
    </div>
  </div>`;
}

function initGame() {
  G = { round: generateRound(grade), pos: 'center', correct: 0, wrong: 0, over: false };
  for (let i = 0; i < 3; i++) ['g2-c', 'g2-w'].forEach(t => {
    const el = document.getElementById(t + i); el.className = 'result-slot'; el.textContent = '';
  });
  document.getElementById('g2-end-overlay').style.display = 'none';
  document.getElementById('g2-overlay-content').className = 'overlay-content';
  renderArena();
}

function renderArena() {
  document.getElementById('g2-answer-value').textContent = G.round.answer;
  document.getElementById('g2-left').textContent = G.round.left.text;
  document.getElementById('g2-right').textContent = G.round.right.text;
  const frogEl = document.getElementById('g2-frog');
  frogEl.textContent = '🐸';
  // highlight which cell munchie is adjacent to
  document.getElementById('g2-left').classList.toggle('munchie-adjacent', G.pos === 'left');
  document.getElementById('g2-right').classList.toggle('munchie-adjacent', G.pos === 'right');
}

function move(dir) {
  if (G.over) return;
  if (dir === 'left' && G.pos !== 'left') { G.pos = G.pos === 'center' ? 'left' : 'center'; sfxMove(); renderArena(); }
  else if (dir === 'right' && G.pos !== 'right') { G.pos = G.pos === 'center' ? 'right' : 'center'; sfxMove(); renderArena(); }
}

function eat() {
  if (G.over || G.pos === 'center') return;
  const ok = G.pos === G.round.correctSide;
  if (ok) {
    const s = document.getElementById('g2-c' + G.correct); s.classList.add('correct'); s.textContent = '✓';
    G.correct++; sfxCorrect();
    if (G.correct >= WIN) { endGame(true); return; }
  } else {
    const s = document.getElementById('g2-w' + G.wrong); s.classList.add('wrong'); s.textContent = '✗';
    G.wrong++; sfxWrong();
    if (G.wrong >= LOSE) { endGame(false); return; }
  }
  // next round
  G.round = generateRound(grade);
  G.pos = 'center';
  renderArena();
}

function endGame(won) {
  G.over = true;
  const ov = document.getElementById('g2-end-overlay'), ct = document.getElementById('g2-overlay-content');
  ov.style.display = 'flex';
  if (won) {
    ov.style.background = 'transparent';
    ct.className = 'overlay-content win-content';
    document.getElementById('g2-ov-anim').innerHTML = '<span style="font-size:48px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5))">🎉</span>';
    document.getElementById('g2-ov-title').textContent = 'Amazing job!';
    document.getElementById('g2-ov-msg').textContent = "Munchie ate the right answers! You're a math star!";
    sfxWin(); launchFireworks(ov);
  } else {
    ov.style.background = 'transparent';
    ct.className = 'overlay-content lose-content';
    document.getElementById('g2-ov-anim').innerHTML = `<div class="dizzy-wrap"><span class="lose-frog">🐸</span><span class="dizzy-star" style="animation-delay:0s">⭐</span><span class="dizzy-star" style="animation-delay:-0.33s">⭐</span><span class="dizzy-star" style="animation-delay:-0.66s">⭐</span></div>`;
    document.getElementById('g2-ov-title').textContent = 'Oof! Tummy ache!';
    document.getElementById('g2-ov-msg').textContent = "Munchie ate too many wrong answers and his tummy hurts! Let's try again!";
    sfxLose();
  }
}

export function game2KeyHandler(e) {
  if (e.key === 'ArrowLeft') move('left');
  else if (e.key === 'ArrowRight') move('right');
  else if (e.key === ' ') eat();
}
