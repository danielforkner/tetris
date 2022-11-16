// GAME STATE
let colors = ['red', 'blue', 'green', 'orange', 'purple', 'yellow'];
let shapes = [
  [
    [1, 1],
    [1, 1],
  ],
  [
    [0, 1],
    [0, 1],
    [1, 1],
  ],
  [
    [1, 0],
    [1, 0],
    [1, 1],
  ],
  [[1], [1], [1], [1]],
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
];
let game = {
  playing: false,
  lost: false,
  timer: 0,
  currentPiece: shapes[Math.floor(Math.random() * (shapes.length - 1))],
  nextPiece: {
    shape: shapes[Math.floor(Math.random() * (shapes.length - 1))],
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  currentColor: colors[Math.floor(Math.random() * (colors.length - 1))],
  positionY: -2,
  positionX: 6,
  score: 0,
  level: 1,
  speed: 250,
  boardRows: 30,
  boardColumns: 15,
  intervalId: null,
};

// DOM Elements
let playBtn = document.getElementById('play');
let scoreTxt = document.getElementById('score');
let table = document.getElementById('table');
let previewTable = document.getElementById('preview');
let levelTxt = document.getElementById('level');
let redThemeBtn = document.getElementById('redBtn');
let greenThemeBtn = document.getElementById('greenBtn');
let blueThemeBtn = document.getElementById('blueBtn');

// Game Board
for (let i = 0; i < game.boardRows; i++) {
  createRow();
}

// Event Listeners
playBtn.addEventListener('click', function () {
  if (game.lost) {
    resetGame();
    game.lost = false;
  }
  if (!game.intervalId) {
    runTick();
  } else {
    clearTick();
  }
  game.playing = !game.playing;
  if (game.playing) {
    previewNextPiece();
    playBtn.innerText = 'STOP';
  } else {
    playBtn.innerText = 'PLAY';
  }
});

window.addEventListener('keydown', function (event) {
  if (event.key === ' ') {
    playBtn.click();
    return;
  }

  if (!game.playing) {
    return;
  }

  // move right
  if (event.key === 'd') {
    if (checkRight()) {
      return;
    }
    removePiece();
    game.positionX++;
    drawPiece();
    return;
  }
  // move left
  if (event.key === 'a') {
    if (checkLeft()) {
      return;
    }
    removePiece();
    game.positionX--;
    drawPiece();
    return;
  }
  // rotate clockwise
  if (event.key === 'e') {
    removePiece();
    rotateRight();
    drawPiece();
    return;
  }
  // rotate counter-clockwise
  if (event.key === 'q') {
    removePiece();
    rotateLeft();
    drawPiece();
    return;
  }
  // move down
  if (event.key === 's') {
    if (checkBottom()) {
      return;
    }
    removePiece();
    useGravity();
    drawPiece();
    return;
  }
});

redThemeBtn.addEventListener('click', function () {
  document.documentElement.style.setProperty('--baseColor', '#c39a9a');
  document.documentElement.style.setProperty('--secondaryColor', '#4e0e0e');
});
greenThemeBtn.addEventListener('click', function () {
  document.documentElement.style.setProperty('--baseColor', '#9ac3a8');
  document.documentElement.style.setProperty('--secondaryColor', '#0e4e10');
});
blueThemeBtn.addEventListener('click', function () {
  document.documentElement.style.setProperty('--baseColor', '#9b9ac3');
  document.documentElement.style.setProperty('--secondaryColor', '#282781');
});

// Game Functions
function resetGame() {
  game = {
    playing: false,
    lost: false,
    timer: 0,
    currentPiece: shapes[Math.floor(Math.random() * (shapes.length - 1))],
    nextPiece: {
      shape: shapes[Math.floor(Math.random() * (shapes.length - 1))],
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    currentColor: colors[Math.floor(Math.random() * (colors.length - 1))],
    positionY: -2,
    positionX: 6,
    score: 0,
    level: 1,
    speed: 500,
    boardRows: 30,
    boardColumns: 15,
    intervalId: null,
  };
  for (let i = 0; i < table.children.length; i++) {
    for (let j = 0; j < table.children[0].children.length; j++) {
      let cell = table.children[i].children[j];
      cell.className = '';
    }
  }
}

function runTick() {
  game.intervalId = setInterval(function () {
    if (!game.playing) return;
    checkTopAndBottom();
    removePiece();
    useGravity();
    drawPiece();
  }, game.speed);
}

function clearTick() {
  clearInterval(game.intervalId);
  game.intervalId = null;
}

function rotateRight() {
  let piece = game.currentPiece;
  let newArray = [];
  for (let i = 0; i < piece[0].length; i++) {
    let row = [];
    for (let j = piece.length - 1; j >= 0; j--) {
      row.push(piece[j][i]);
    }
    newArray.push(row);
  }
  game.currentPiece = newArray;
  while (game.positionX + newArray[0].length - 1 > 14) {
    game.positionX--;
  }
}

function rotateLeft() {
  let piece = game.currentPiece;
  let newArray = [];
  for (let i = piece[0].length - 1; i >= 0; i--) {
    let row = [];
    for (let j = 0; j < piece.length; j++) {
      row.push(piece[j][i]);
    }
    newArray.push(row);
  }
  game.currentPiece = newArray;
  while (game.positionX + newArray[0].length - 1 > 14) {
    game.positionX--;
  }
}

function drawPiece() {
  let piece = game.currentPiece;
  for (let i = 0; i < piece.length; i++) {
    for (let j = 0; j < piece[i].length; j++) {
      if (piece[i][j] === 0) {
        continue;
      }
      let boardRow = i + game.positionY;
      let boardColumn = j + game.positionX;
      let pixel = table.children[boardRow]?.children[boardColumn];
      if (pixel === undefined) {
        continue;
      }
      pixel.classList.add(game.currentColor);
    }
  }
}

function useGravity() {
  game.positionY++;
}

function removePiece() {
  let piece = game.currentPiece;
  for (let i = 0; i < piece.length; i++) {
    for (let j = 0; j < piece[i].length; j++) {
      if (piece[i][j] === 0) {
        continue;
      }
      let boardRow = i + game.positionY;
      let boardColumn = j + game.positionX;
      let pixel = table.children[boardRow]?.children[boardColumn];
      if (pixel === undefined) {
        continue;
      }
      pixel.classList.remove(game.currentColor);
    }
  }
}

function checkTopAndBottom() {
  let atTop = checkTop();
  let atBottom = checkBottom();
  if (atTop && atBottom) {
    game.playing = false;
    playBtn.innerText = 'RESET';
    game.lost = true;
    clearTick();
    clearPreviewTable();
    console.log('YOU LOSE');
  } else if (atBottom) {
    let linesToClear = [];
    for (let i = 0; i < game.currentPiece.length; i++) {
      if (checkLineClear(i + game.positionY)) {
        linesToClear.push(i + game.positionY);
      }
    }
    removeLines(linesToClear);
    selectNewPiece();
  }
}

function checkBottom() {
  let piece = game.currentPiece;
  let tableBottom = table.children.length - 1;
  let pieceBottom = piece.length - 1 + game.positionY;
  // bottom of the board
  if (pieceBottom === tableBottom) {
    return true;
  }
  // on top of another piece
  for (let i = 0; i < piece.length; i++) {
    for (let j = 0; j < piece[i].length; j++) {
      // check for hanging blocks or bottom row
      if (piece[i][j] && !piece[i + 1]?.[j]) {
        let y = game.positionY + i + 1;
        let x = game.positionX + j;
        if (table.children[y]?.children[x]?.classList.length) {
          return true;
        }
      }
    }
  }
  return false;
}

function checkTop() {
  if (game.positionY <= 0) {
    return true;
  }
  return false;
}

function checkLeft() {
  let piece = game.currentPiece;
  // check wall
  if (game.positionX <= 0) {
    return true;
  }
  // check for piece collisions
  for (let i = 0; i < piece.length; i++) {
    for (let j = 0; j < piece[i].length; j++) {
      // check for hanging blocks
      if (piece[i][j] && !piece[i]?.[j - 1]) {
        let y = game.positionY + i;
        let x = game.positionX + j - 1;
        if (table.children[y]?.children[x]?.classList.length) {
          return true;
        }
      }
    }
  }
  return false;
}

function checkRight() {
  let piece = game.currentPiece;
  let rightPosition = game.positionX + piece[0].length - 1;
  let lastColumn = piece[0].length - 1;
  // check wall
  if (rightPosition >= 14) {
    return true;
  }
  // check for piece collisions
  for (let i = 0; i < piece.length; i++) {
    for (let j = 0; j < piece[i].length; j++) {
      // check for hanging blocks
      if (piece[i][j] && !piece[i]?.[j + 1]) {
        let y = game.positionY + i;
        let x = game.positionX + j + 1;
        if (table.children[y]?.children[x]?.classList.length) {
          return true;
        }
      }
    }
  }
  return false;
}

function checkLineClear(line) {
  let row = table.children[line].children;
  let cleared = true;
  for (let i = 0; i < row.length; i++) {
    if (!row[i].classList.length) {
      return false;
    }
  }
  return cleared;
}

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

function removeLines(lines = []) {
  lines.forEach((line) => {
    table.children[line].remove();
    score();
    createRow();
    // for (let i = 0; i < table.children[line].children.length; i++) {
    //   table.children[line].children[i].className = 'yellow';
    //   // await sleep(10);
    // }
  });
}

function createRow() {
  let newRow = document.createElement('tr');
  for (let j = 0; j < game.boardColumns; j++) {
    let cell = document.createElement('td');
    newRow.appendChild(cell);
  }
  table.prepend(newRow);
}

function score() {
  game.score++;
  scoreTxt.innerText = game.score;
  levelTxt.innerText = game.level;
  game.toNextLevel--;
  if (game.score % 5 === 0) {
    game.level++;
    levelTxt.innerText = game.level;
    game.speed *= 0.9;
    clearTick();
    runTick();
  }
}

function selectNewPiece() {
  clearPreviewTable();
  game.currentColor = game.nextPiece.color;
  game.currentPiece = game.nextPiece.shape;
  game.nextPiece.shape = shapes[Math.floor(Math.random() * shapes.length)];
  game.nextPiece.color = colors[Math.floor(Math.random() * colors.length)];
  let pieceLength = game.currentPiece.length;
  game.positionY = 0 - pieceLength;
  let rightPosition = game.positionX + game.currentPiece[0].length - 1;
  // prevents a rotation from moving the piece off-board
  while (rightPosition >= 15) {
    game.positionX--;
    rightPosition = game.positionX + game.currentPiece[0].length - 1;
  }
  previewNextPiece();
}

function clearPreviewTable() {
  for (let i = 0; i < previewTable.children.length; i++) {
    for (let j = 0; j < previewTable.children[0].children.length; j++) {
      let cell = previewTable.children[i].children[j];
      cell.className = '';
    }
  }
}

function previewNextPiece() {
  let piece = game.nextPiece.shape;
  for (let i = 0; i < piece.length; i++) {
    for (let j = 0; j < piece[0].length; j++) {
      let cell =
        previewTable.children[piece.length < 3 ? i + 1 : i].children[j + 1];
      if (piece[i][j]) {
        cell.classList.add(game.nextPiece.color);
      }
    }
  }
}
