function ri(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

// Each prompt: { answer, correct: {text}, wrong: {text} }
// We generate these dynamically so each round is fresh.

function mkAddSub(min, max) {
  const a = ri(min, max), b = ri(min, max - a + min);
  const op = Math.random() < 0.5 ? '+' : '-';
  const result = op === '+' ? a + b : a - b;
  if (result < 1) return mkAddSub(min, max);
  return { text: op === '+' ? `${a} + ${b}` : `${a} − ${b}`, value: result };
}

function mkMul(maxFactor) {
  const a = ri(2, maxFactor), b = ri(2, maxFactor);
  return { text: `${a} × ${b}`, value: a * b };
}

function mkDiv() {
  const b = ri(2, 9), a = ri(2, 9);
  return { text: `${a * b} ÷ ${b}`, value: a };
}

function wrongEq(correctValue, grade) {
  let eq, attempts = 0;
  do {
    eq = grade === '3'
      ? (Math.random() < 0.5 ? mkMul(9) : mkDiv())
      : mkAddSub(grade === 'K' ? 1 : grade === '1' ? 1 : 10, grade === 'K' ? 9 : grade === '1' ? 18 : 90);
    attempts++;
  } while (eq.value === correctValue && attempts < 50);
  return eq;
}

export function generateRound(grade) {
  let correct;
  if (grade === 'K') correct = mkAddSub(1, 9);
  else if (grade === '1') correct = mkAddSub(1, 18);
  else if (grade === '2') correct = mkAddSub(10, 90);
  else correct = Math.random() < 0.5 ? mkMul(9) : mkDiv();

  const wrong = wrongEq(correct.value, grade);
  const flipped = Math.random() < 0.5;

  return {
    answer: correct.value,
    left:  flipped ? wrong   : correct,
    right: flipped ? correct : wrong,
    correctSide: flipped ? 'right' : 'left',
  };
}
