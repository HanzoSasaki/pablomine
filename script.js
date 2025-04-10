const gameBoard = document.getElementById('gameBoard');
const startBtn = document.getElementById('startBtn');
const difficultySelect = document.getElementById('difficulty');
const statusText = document.getElementById('status');
const scoreText = document.getElementById('score');

let boardSize = 8;
let bombCount = 10;
let board = [];
let gameOver = false;
let revealedCount = 0;
let score = 0;

startBtn.addEventListener('click', startGame);

function startGame() {
  gameOver = false;
  revealedCount = 0;
  score = 0;
  updateScore();
  statusText.textContent = "Boa sorte, Pablo!";
  defineDificuldade();
  generateBoard();
}

function defineDificuldade() {
  const level = difficultySelect.value;
  if (level === 'easy') {
    boardSize = 8;
    bombCount = 10;
  } else if (level === 'medium') {
    boardSize = 10;
    bombCount = 20;
  } else if (level === 'hard') {
    boardSize = 12;
    bombCount = 35;
  }
}

function generateBoard() {
  gameBoard.innerHTML = '';
  gameBoard.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;

  board = [];
  for (let i = 0; i < boardSize * boardSize; i++) {
    board.push({ bomb: false, revealed: false });
  }

  for (let i = 0; i < bombCount; i++) {
    let index;
    do {
      index = Math.floor(Math.random() * board.length);
    } while (board[index].bomb);
    board[index].bomb = true;
  }

  board.forEach((cell, index) => {
    const cellEl = document.createElement('div');
    cellEl.classList.add('cell');
    cellEl.dataset.index = index;
    cellEl.addEventListener('click', () => revealCell(index));
    gameBoard.appendChild(cellEl);
  });
}

function revealCell(index) {
  if (gameOver || board[index].revealed) return;

  const cell = board[index];
  const cellEl = gameBoard.children[index];
  cell.revealed = true;
  cellEl.classList.add('revealed');

  if (cell.bomb) {
    cellEl.textContent = '💣';
    endGame(false);
  } else {
    cellEl.textContent = '💎';
    revealedCount++;
    score += 10;
    updateScore();
    checkVictory();
  }
}

function updateScore() {
  scoreText.textContent = `💰 R$: ${score.toFixed(2).replace('.', ',')}`;
}

function endGame(won) {
  gameOver = true;
  statusText.textContent = won ? 'Você venceu! 💎' : `O Pablo deu a bunda 💥 perdeu R$${score.toFixed(2).replace('.', ',')}`;
  board.forEach((cell, i) => {
    if (cell.bomb && !cell.revealed) {
      const cellEl = gameBoard.children[i];
      cellEl.textContent = '💣';
      cellEl.classList.add('revealed');
    }
  });
}

function checkVictory() {
  if (revealedCount === board.length - bombCount) {
    endGame(true);
  }
}
