import './style.css';
import { PROMPTS } from './prompts.js';
import { sfxMove, sfxCorrect, sfxWrong, sfxWin, sfxLose, stopAllAudio } from '../../audio.js';
import { launchFireworks, stopFireworks } from '../../fireworks.js';

const GS = 6, CX = 2, CY = 2, WIN = 3, LOSE = 3;
const MIN_UNIQUE = 3;
const deckState = {};
let G = {}, grade = null, goBack = null;

function ri(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } }

function initDeck(g) {
  const indices = PROMPTS[g].map((_, i) => i); shuffle(indices);
  deckState[g] = { deck: indices, recentWins: [] };
}
function pickPrompt(g) {
  if (!deckState[g]) initDeck(g);
  const ds = deckState[g], pr = PROMPTS[g], bl = new Set(ds.recentWins);
  let pos = ds.deck.findIndex(i => !bl.has(pr[i].text));
  if (pos === -1) pos = 0;
  const ch = ds.deck.splice(pos, 1)[0];
  if (ds.deck.length === 0) { const a = pr.map((_, i) => i); shuffle(a); ds.deck = a; }
  return pr[ch];
}
function recordWin(g, t) {
  const ds = deckState[g]; ds.recentWins.push(t);
  if (ds.recentWins.length > MIN_UNIQUE) ds.recentWins.shift();
}

function idx(r, c) { return r * GS + c; }

export function mountGame1(container, g, onGoBack) {
  grade = g;
  goBack = onGoBack;
  container.innerHTML = buildHTML();
  container.querySelectorAll('.g1-back-btn').forEach(btn =>
    btn.addEventListener('click', () => { stopFireworks(); stopAllAudio(); goBack(); })
  );
  container.querySelector('#g1-play-again-btn').addEventListener('click', () => {
    stopFireworks(); stopAllAudio(); initGame();
  });
  initGame();
}

function buildHTML() {
  return `
  <div id="g1-screen" style="display:flex;flex-direction:column;gap:0;">
    <div style="display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap;">
      <div style="display:flex;flex-direction:column;gap:10px;">
        <div style="display:flex;gap:10px;align-items:center;">
          <div id="g1-cur-val-box"><div id="g1-cur-val-label">on this square</div><div id="g1-cur-val">—</div></div>
          <div style="font-size:12px;color:var(--color-text-secondary);line-height:1.9;">↑↓←→ move<br>Space eat</div>
        </div>
        <div style="position:relative;">
          <div id="g1-grid"></div>
          <div class="overlay" id="g1-end-overlay" style="display:none;">
            <canvas id="fw-canvas"></canvas>
            <div class="overlay-content" id="g1-overlay-content">
              <div id="g1-ov-anim"></div>
              <h2 id="g1-ov-title"></h2>
              <p id="g1-ov-msg"></p>
              <div class="btn-row" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;">
                <button class="action-btn" id="g1-play-again-btn">Play again</button>
                <button class="action-btn g1-back-btn">Change game</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:14px;padding-top:2px;min-width:170px;">
        <div id="g1-prompt-box"><div id="g1-prompt-label">Eat all numbers that are</div><div id="g1-prompt-text"></div></div>
        <div>
          <div style="font-size:10px;color:var(--color-text-secondary);letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px;">Correct</div>
          <div style="display:flex;gap:6px;margin-bottom:12px;">
            <div class="result-slot" id="g1-c0"></div><div class="result-slot" id="g1-c1"></div><div class="result-slot" id="g1-c2"></div>
          </div>
          <div style="font-size:10px;color:var(--color-text-secondary);letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px;">Wrong</div>
          <div style="display:flex;gap:6px;">
            <div class="result-slot" id="g1-w0"></div><div class="result-slot" id="g1-w1"></div><div class="result-slot" id="g1-w2"></div>
          </div>
        </div>
        <button class="action-btn g1-back-btn" style="font-size:12px;padding:6px 14px;margin-top:6px;">← Change game</button>
      </div>
    </div>
  </div>`;
}

function initGame() {
  const prompt = pickPrompt(grade);
  const positions = [];
  for (let r = 0; r < GS; r++) for (let c = 0; c < GS; c++) if (!(r === CX && c === CY)) positions.push(idx(r, c));
  shuffle(positions);
  const cells = Array.from({ length: GS * GS }, (_, i) => {
    const r = Math.floor(i / GS), c = i % GS;
    return { val: (r === CX && c === CY) ? null : prompt.gen(), eaten: false };
  });
  const ensure = (fn, n) => {
    const oth = positions.filter(p => !fn(cells[p].val)); shuffle(oth);
    let have = positions.filter(p => fn(cells[p].val)).length, pi = 0;
    while (have < n && pi < oth.length) {
      let v, t = 0; do { v = prompt.gen(); t++; } while (!fn(v) && t < 200);
      if (fn(v)) { cells[oth[pi]].val = v; have++; } pi++;
    }
  };
  ensure(prompt.fn, 6); ensure(v => !prompt.fn(v), 8);
  G = { cells, frog: { r: CX, c: CY }, prompt, correct: 0, wrong: 0, over: false };
  document.getElementById('g1-prompt-text').textContent = prompt.text;
  for (let i = 0; i < 3; i++) ['g1-c', 'g1-w'].forEach(t => {
    const el = document.getElementById(t + i); el.className = 'result-slot'; el.textContent = '';
  });
  document.getElementById('g1-end-overlay').style.display = 'none';
  document.getElementById('g1-overlay-content').className = 'overlay-content';
  updateCurVal(); renderGrid();
}

function renderGrid() {
  const g = document.getElementById('g1-grid'); g.innerHTML = '';
  for (let r = 0; r < GS; r++) for (let c = 0; c < GS; c++) {
    const cd = G.cells[idx(r, c)], isFrog = G.frog.r === r && G.frog.c === c;
    const d = document.createElement('div'); d.className = 'g1-cell';
    if (isFrog) { d.classList.add('munchie'); d.textContent = '🐸'; }
    else if (cd.eaten) { d.classList.add('eaten'); d.textContent = cd.val ?? ''; }
    else if (cd.val !== null) { d.textContent = cd.val; }
    g.appendChild(d);
  }
}

function updateCurVal() {
  const cd = G.cells[idx(G.frog.r, G.frog.c)];
  document.getElementById('g1-cur-val').textContent = (cd.val === null || cd.eaten) ? '—' : cd.val;
}

function move(dr, dc) {
  if (G.over) return;
  const nr = G.frog.r + dr, nc = G.frog.c + dc;
  if (nr < 0 || nr >= GS || nc < 0 || nc >= GS) return;
  G.frog = { r: nr, c: nc }; sfxMove(); updateCurVal(); renderGrid();
}

function eat() {
  if (G.over) return;
  const cd = G.cells[idx(G.frog.r, G.frog.c)];
  if (cd.val === null || cd.eaten) return;
  cd.eaten = true;
  const ok = G.prompt.fn(cd.val);
  if (ok) {
    const s = document.getElementById('g1-c' + G.correct); s.classList.add('correct'); s.textContent = '✓';
    G.correct++; sfxCorrect(); if (G.correct >= WIN) endGame(true);
  } else {
    const s = document.getElementById('g1-w' + G.wrong); s.classList.add('wrong'); s.textContent = '✗';
    G.wrong++; sfxWrong(); if (G.wrong >= LOSE) endGame(false);
  }
  updateCurVal(); renderGrid();
}

function endGame(won) {
  G.over = true;
  const ov = document.getElementById('g1-end-overlay'), ct = document.getElementById('g1-overlay-content');
  ov.style.display = 'flex';
  if (won) {
    ov.style.background = 'transparent';
    ct.className = 'overlay-content win-content';
    document.getElementById('g1-ov-anim').innerHTML = '<span style="font-size:48px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5))">🎉</span>';
    document.getElementById('g1-ov-title').textContent = 'Amazing job!';
    document.getElementById('g1-ov-msg').textContent = "Munchie ate all the right numbers! You're a math star!";
    sfxWin(); launchFireworks(ov); recordWin(grade, G.prompt.text);
  } else {
    ov.style.background = 'transparent';
    ct.className = 'overlay-content lose-content';
    document.getElementById('g1-ov-anim').innerHTML = `<div class="dizzy-wrap"><span class="lose-frog">🐸</span><span class="dizzy-star" style="animation-delay:0s">⭐</span><span class="dizzy-star" style="animation-delay:-0.33s">⭐</span><span class="dizzy-star" style="animation-delay:-0.66s">⭐</span></div>`;
    document.getElementById('g1-ov-title').textContent = 'Oof! Tummy ache!';
    document.getElementById('g1-ov-msg').textContent = "Munchie ate too many wrong numbers and his tummy hurts! Let's try again!";
    sfxLose();
  }
}

export function game1KeyHandler(e) {
  if (!G.frog) return;
  if (e.key === 'ArrowUp') move(-1, 0);
  else if (e.key === 'ArrowDown') move(1, 0);
  else if (e.key === 'ArrowLeft') move(0, -1);
  else if (e.key === 'ArrowRight') move(0, 1);
  else if (e.key === ' ') eat();
}
