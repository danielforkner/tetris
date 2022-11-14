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
  timer: 0,
  currentPiece: [
    [1, 1],
    [1, 1],
  ],
  currentColor: 'red',
  positionY: -2,
  positionX: 6,
  score: 0,
  level: 1,
  toNextLevel: 5,
  speed: 500,
  boardRows: 30,
  boardColumns: 15,
  intervalId: null,
};

// DOM Elements
let playBtn = document.getElementById('play');
let scoreTxt = document.getElementById('score');
let table = document.getElementById('table');
let levelTxt = document.getElementById('level');

// Game Board
for (let i = 0; i < game.boardRows; i++) {
  createRow();
}

// Event Listeners
playBtn.addEventListener('click', function () {
  if (!game.intervalId) {
    runTick();
  } else {
    clearTick();
  }
  game.playing = !game.playing;
  if (game.playing) {
    playBtn.innerText = 'Pause';
  } else {
    playBtn.innerText = 'Start';
  }
});

window.addEventListener('keydown', function (event) {
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
  }
  // rotate counter-clockwise
  if (event.key === 'q') {
    removePiece();
    rotateLeft();
    drawPiece();
  }
  // move down
  if (event.key === 's') {
    removePiece();
    useGravity();
    drawPiece();
    return;
  }
});

// Game Functions
function runTick() {
  game.intervalId = setInterval(function () {
    if (!game.playing) return;
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
  // console.log('len: ', newArray.length);
  // console.log('x: ', game.positionX);
  while (game.positionX + newArray[0].length - 1 > 14) {
    // console.log(game.positionX);
    game.positionX--;
    // console.log(game.positionX);
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
  let atTop = checkTop();
  let atBottom = checkBottom();
  if (atTop && atBottom) {
    game.playing = false;
    console.log('YOU LOSE');
  } else if (atBottom) {
    for (let i = 0; i < game.currentPiece.length; i++) {
      checkLineClear(i + game.positionY);
    }
    selectNewPiece();
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
        if (table.children[y].children[x].classList.length) {
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
    let pixel =
      table.children[i + game.positionY]?.children[game.positionX - 1];
    // debugger
    if (piece[i][0] && pixel && pixel.classList.length) {
      return true;
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
    let pixel =
      table.children[i + game.positionY]?.children[
        lastColumn + 1 + game.positionX
      ];
    if (piece[i][lastColumn] && pixel && pixel.classList.length) {
      return true;
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
  table.children[line].remove();
  score();
  createRow();
  return cleared;
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
  let pointsEarned = 1 * game.level;
  game.score += pointsEarned;
  scoreTxt.innerText = game.score;
  levelTxt.innerText = game.level;
  game.toNextLevel--;
  if (game.toNextLevel <= 0) {
    game.level++;
    levelTxt.innerText = game.level;
    game.speed *= 0.9;
    clearTick();
    runTick();
  }
}

function selectNewPiece() {
  let randomNumberColors = Math.floor(Math.random() * colors.length);
  let randomNumberShapes = Math.floor(Math.random() * shapes.length);
  game.currentColor = colors[randomNumberColors];
  game.currentPiece = shapes[randomNumberShapes];
  let pieceLength = game.currentPiece.length;
  game.positionY = 0 - pieceLength;
  let rightPosition = game.positionX + game.currentPiece[0].length - 1;
  while (rightPosition >= 15) {
    game.positionX--;
    rightPosition = game.positionX + game.currentPiece[0].length - 1;
  }
}
