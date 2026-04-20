import './styles/base.css';
import './screens/gameSelect.css';
import { initGameSelect } from './screens/gameSelect.js';
import { mountGame1, game1KeyHandler } from './games/game1/index.js';
import { mountGame2, game2KeyHandler } from './games/game2/index.js';

const root = document.getElementById('app-root');
const selectScreen = document.getElementById('screen-game-select');
const gameScreen = document.getElementById('screen-game');

let activeKeyHandler = null;

document.addEventListener('keydown', e => {
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) e.preventDefault();
  if (activeKeyHandler) activeKeyHandler(e);
});

function goBack() {
  activeKeyHandler = null;
  root.removeAttribute('data-grade');
  selectScreen.style.display = 'flex';
  gameScreen.style.display = 'none';
  gameScreen.innerHTML = '';
}

initGameSelect(selectScreen, (gameId, grade) => {
  root.dataset.grade = grade;
  selectScreen.style.display = 'none';
  gameScreen.style.display = 'flex';
  gameScreen.innerHTML = '';

  if (gameId === 'game1') {
    activeKeyHandler = game1KeyHandler;
    mountGame1(gameScreen, grade, goBack);
  } else if (gameId === 'game2') {
    activeKeyHandler = game2KeyHandler;
    mountGame2(gameScreen, grade, goBack);
  }
});
