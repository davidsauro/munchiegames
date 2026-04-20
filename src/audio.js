let actx = null;
let soundOn = true;
const soundBtns = new Set();

export function registerSoundBtn(el) {
  soundBtns.add(el);
  el.textContent = soundOn ? '🔊' : '🔇';
}

export function unregisterSoundBtn(el) {
  soundBtns.delete(el);
}

export function toggleSound() {
  soundOn = !soundOn;
  const icon = soundOn ? '🔊' : '🔇';
  soundBtns.forEach(el => { el.textContent = icon; });
}

export function isSoundOn() { return soundOn; }

export function stopAllAudio() {
  if (actx) { actx.close(); actx = null; }
}

function getACtx() {
  if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
  if (actx.state === 'suspended') actx.resume();
  return actx;
}

function playNote(type, freq, t, dur, vol = 0.28, startHz = null) {
  const ac = getACtx(), osc = ac.createOscillator(), gain = ac.createGain();
  osc.connect(gain); gain.connect(ac.destination);
  osc.type = type;
  if (startHz) { osc.frequency.setValueAtTime(startHz, t); osc.frequency.linearRampToValueAtTime(freq, t + dur * 0.6); }
  else osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(vol, t + 0.01);
  gain.gain.setValueAtTime(vol, t + dur * 0.5);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.start(t); osc.stop(t + dur + 0.05);
}

function playNoiseBurst(t, dur = 0.08, vol = 0.12) {
  const ac = getACtx(), bufLen = Math.ceil(ac.sampleRate * dur), buf = ac.createBuffer(1, bufLen, ac.sampleRate), data = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource(), hpf = ac.createBiquadFilter(), gain = ac.createGain();
  src.buffer = buf; hpf.type = 'highpass'; hpf.frequency.value = 1800;
  gain.gain.setValueAtTime(vol, t); gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(hpf); hpf.connect(gain); gain.connect(ac.destination);
  src.start(t); src.stop(t + dur + 0.02);
}

export function sfxMove() {
  if (!soundOn) return;
  const ac = getACtx(), now = ac.currentTime;
  playNote('sine', 320, now, 0.08, 0.10, 300);
}

export function sfxCorrect() {
  if (!soundOn) return;
  const ac = getACtx(), now = ac.currentTime;
  playNote('sine', 523.25, now, 0.18, 0.30);
  playNote('sine', 659.25, now + 0.1, 0.22, 0.28);
}

export function sfxWrong() {
  if (!soundOn) return;
  const ac = getACtx(), now = ac.currentTime;
  playNote('sawtooth', 174.61, now, 0.35, 0.18, 220.00);
}

export function sfxWin() {
  if (!soundOn) return;
  const ac = getACtx(), now = ac.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.50];
  notes.forEach((f, i) => { playNote('sine', f, now + i * 0.13, 0.30, 0.26); playNote('triangle', f, now + i * 0.13, 0.28, 0.10); });
  playNote('sine', 1318.51, now + 0.6, 0.4, 0.14);
}

export function sfxLose() {
  if (!soundOn) return;
  const ac = getACtx(), now = ac.currentTime;
  playNote('triangle', 261.63, now, 0.4, 0.22, 300);
  playNote('triangle', 220.00, now + 0.35, 0.4, 0.20, 280);
  playNote('triangle', 174.61, now + 0.70, 0.5, 0.18, 240);
}

export function sfxFireworkPop() {
  if (!soundOn) return;
  const ac = getACtx(), now = ac.currentTime;
  playNoiseBurst(now, 0.07, 0.10);
  const pf = [1046.50, 1174.66, 1318.51, 1396.91, 1567.98];
  playNote('sine', pf[Math.floor(Math.random() * pf.length)], now + 0.01, 0.18, 0.12);
}
