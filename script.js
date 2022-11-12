// GAME STATE
let colors = ['red', 'blue', 'green', 'orange', 'purple'];
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
  positionY: 15,
  positionX: 6,
};

// DOM Elements
let playBtn = document.getElementById('play');
let timer = document.getElementById('timer');
let table = document.getElementById('table');

// Game Board
for (let i = 0; i < 30; i++) {
  let row = document.createElement('tr');
  table.appendChild(row);
  for (let j = 0; j < 15; j++) {
    let cell = document.createElement('td');
    cell.id = i + '-' + j;
    row.appendChild(cell);
  }
}

// Event Listeners
playBtn.addEventListener('click', function () {
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
  let piece = game.currentPiece;
  if (event.key === 'd') {
    // move right
    if (checkRightWall()) {
      return;
    }
    removePiece();
    game.positionX++;
    drawPiece();
    return;
  }
  if (event.key === 'a') {
    // move left
    if (game.positionX <= 0) {
      return;
    }
    removePiece();
    game.positionX--;
    drawPiece();
    return;
  }
  if (event.key === 'e') {
    removePiece();
    rotateRight();
    drawPiece();
  }
  if (event.key === 'q') {
    removePiece();
    rotateLeft();
    drawPiece();
  }
  if (event.key === 's') {
    removePiece();
    useGravity();
    drawPiece();
    return;
  }
});

// Game Functions
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
  console.log(newArray);
  game.currentPiece = newArray;
}

let array = [
  [1, 0, 0],
  [1, 0, 0],
  [1, 0, 0],
];
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
  console.log(newArray);
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
      let pixel = document.getElementById(boardRow + '-' + boardColumn);
      if (pixel === null) {
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
      let pixel = document.getElementById(boardRow + '-' + boardColumn);
      if (pixel === null) {
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
        if (document.getElementById(y + '-' + x).classList.length) {
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

function checkRightWall() {
  let rightPosition = game.positionX + game.currentPiece[0].length - 1;
  if (rightPosition >= 14) {
    return true;
  }
  return false;
}

function selectNewPiece() {
  let randomNumberColors = Math.floor(Math.random() * colors.length);
  let randomNumberShapes = Math.floor(Math.random() * shapes.length);
  game.currentColor = colors[randomNumberColors];
  game.currentPiece = shapes[randomNumberShapes];
  let pieceLength = game.currentPiece.length;
  game.positionY = 0 - pieceLength;
  // if (checkRight()) {
  //   game.positionX--;
  // }
  let rightPosition = game.positionX + game.currentPiece[0].length - 1;
  while (rightPosition >= 15) {
    game.positionX--;
    rightPosition = game.positionX + game.currentPiece[0].length - 1;
  }
}

function advanceTime() {
  timer.innerText = ++game.timer;
}

// Tick
setInterval(function () {
  if (!game.playing) return;
  advanceTime();
  removePiece();
  useGravity();
  drawPiece();
}, 500);
