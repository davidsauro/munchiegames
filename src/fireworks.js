import { sfxFireworkPop } from './audio.js';

const FW_COLORS = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff922b','#cc5de8','#f06595','#74c0fc','#a9e34b','#ff99c8'];
let fwRAF = null, fwTimeouts = [];

function ri(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

export function stopFireworks() {
  if (fwRAF) { cancelAnimationFrame(fwRAF); fwRAF = null; }
  fwTimeouts.forEach(t => clearTimeout(t));
  fwTimeouts = [];
  const cv = document.getElementById('fw-canvas');
  if (cv) cv.getContext('2d').clearRect(0, 0, cv.width, cv.height);
}

export function launchFireworks(overlayEl) {
  const cv = document.getElementById('fw-canvas');
  cv.width = overlayEl.offsetWidth || 370;
  cv.height = overlayEl.offsetHeight || 375;
  const ctx = cv.getContext('2d'), particles = [];

  function mkP(x, y, color) {
    const a = Math.random() * Math.PI * 2, s = 0.6 + Math.random() * 2.8;
    return { x, y, color, vx: Math.cos(a)*s, vy: Math.sin(a)*s, alpha: 1, radius: 0.8 + Math.random() * 1.4, decay: 0.006 + Math.random() * 0.006, gravity: 0.04 };
  }
  function burst(x, y) {
    const color = FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)];
    for (let i = 0; i < 55 + Math.floor(Math.random() * 16); i++) particles.push(mkP(x, y, color));
    sfxFireworkPop();
  }

  const burstTimes = [0, 400, 800, 1300, 1800, 2300, 2900, 3500, 4000, 4500];
  const start = performance.now();
  burstTimes.forEach(d => fwTimeouts.push(
    setTimeout(() => burst(ri(cv.width * 0.1, cv.width * 0.9), ri(cv.height * 0.08, cv.height * 0.65)), d)
  ));

  function frame(now) {
    ctx.fillStyle = 'rgba(255,255,255,0.14)'; ctx.fillRect(0, 0, cv.width, cv.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy; p.vy += p.gravity; p.vx *= 0.99; p.vy *= 0.99; p.alpha -= p.decay;
      if (p.alpha <= 0) { particles.splice(i, 1); continue; }
      ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (now - start < 6500 || particles.length > 0) fwRAF = requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, cv.width, cv.height);
  }
  fwRAF = requestAnimationFrame(frame);
}
