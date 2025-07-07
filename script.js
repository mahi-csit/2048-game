const boardSize = 4;
let board = [];
let score = 0;
const boardDiv = document.getElementById("board");
const scoreDisplay = document.getElementById("scoreValue");

function init() {
  board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
  score = 0;
  scoreDisplay.innerText = score;
  addTile();
  addTile();
  updateBoard();
}

function addTile() {
  const emptyTiles = [];
  board.forEach((row, i) => {
    row.forEach((val, j) => {
      if (val === 0) emptyTiles.push([i, j]);
    });
  });
  if (emptyTiles.length === 0) return;
  const [i, j] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  board[i][j] = Math.random() < 0.9 ? 2 : 4;
}

function updateBoard() {
  boardDiv.innerHTML = '';
  board.forEach(row => {
    row.forEach(val => {
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.textContent = val !== 0 ? val : '';
      tile.style.background = getTileColor(val);
      boardDiv.appendChild(tile);
    });
  });
  scoreDisplay.innerText = score;
}

function getTileColor(value) {
  switch (value) {
    case 2: return "linear-gradient(135deg, #fdfbfb, #ebedee)";
    case 4: return "linear-gradient(135deg, #e0c3fc, #8ec5fc)";
    case 8: return "linear-gradient(135deg, #f093fb, #f5576c)";
    case 16: return "linear-gradient(135deg, #f6d365, #fda085)";
    case 32: return "linear-gradient(135deg, #ff9a9e, #fad0c4)";
    case 64: return "linear-gradient(135deg, #a18cd1, #fbc2eb)";
    case 128: return "linear-gradient(135deg, #fccb90, #d57eeb)";
    case 256: return "linear-gradient(135deg, #43e97b, #38f9d7)";
    case 512: return "linear-gradient(135deg, #30cfd0, #330867)";
    case 1024: return "linear-gradient(135deg, #667eea, #764ba2)";
    case 2048: return "linear-gradient(135deg, #ff6a00, #ee0979)";
    default: return "#ccc";
  }
}

function slide(row) {
  let arr = row.filter(val => val);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score += arr[i];
      arr[i + 1] = 0;
    }
  }
  arr = arr.filter(val => val);
  while (arr.length < boardSize) arr.push(0);
  return arr;
}

function rotateClockwise(matrix) {
  return matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());
}

function rotateCounterClockwise(matrix) {
  return matrix[0].map((_, i) => matrix.map(row => row[row.length - 1 - i]));
}

function moveLeft() {
  let moved = false;
  for (let i = 0; i < boardSize; i++) {
    let original = board[i].slice();
    board[i] = slide(board[i]);
    if (original.toString() !== board[i].toString()) moved = true;
  }
  return moved;
}

function move(dir) {
  let moved = false;

  if (dir === 'ArrowRight') {
    board = board.map(row => row.reverse());
    moved = moveLeft();
    board = board.map(row => row.reverse());
  } else if (dir === 'ArrowUp') {
    board = rotateCounterClockwise(board);
    moved = moveLeft();
    board = rotateClockwise(board);
  } else if (dir === 'ArrowDown') {
    board = rotateClockwise(board);
    moved = moveLeft();
    board = rotateCounterClockwise(board);
  } else if (dir === 'ArrowLeft') {
    moved = moveLeft();
  }

  if (moved) {
    addTile();
    updateBoard();
    checkGameStatus();
  }
}

function checkGameStatus() {
  if (board.flat().includes(2048)) {
    setTimeout(() => alert("🎉 You Win!"), 100);
  }
  if (!canMove()) {
    setTimeout(() => alert("💀 Game Over!"), 100);
  }
}

function canMove() {
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] === 0) return true;
      if (j < boardSize - 1 && board[i][j] === board[i][j + 1]) return true;
      if (i < boardSize - 1 && board[i][j] === board[i + 1][j]) return true;
    }
  }
  return false;
}

document.addEventListener("keydown", (e) => {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
    move(e.key);
  }
});

document.getElementById("restartBtn").addEventListener("click", init);
init();