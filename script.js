// GAME STATE
let colors = ['red', 'blue', 'green', 'orange', 'purple'];
let game = {
  playing: false,
  timer: 0,
  currentPiece: [
    [1, 1],
    [1, 1],
  ],
  currentColor: 'red',
  positionY: 0,
  positionX: 0,
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
  console.log(event.key);
  if (event.key === 'd') {
    removePiece();
    game.positionX++;
    drawPiece();
  }
  if (event.key === 'a') {
    removePiece();
    game.positionX--;
    drawPiece();
  }
  if (event.key === 's') {
    removePiece();
    useGravity();
    drawPiece();
  }
});

// Game Functions
function drawPiece() {
  let piece = game.currentPiece;
  for (let i = 0; i < piece.length; i++) {
    for (let j = 0; j < piece[i].length; j++) {
      let boardRow = i + game.positionY;
      let boardColumn = j + game.positionX;
      let pixel = document.getElementById(boardRow + '-' + boardColumn);
      pixel.classList.add(game.currentColor);
    }
  }
  checkBottom();
}

function useGravity() {
  game.positionY++;
}

function removePiece() {
  let piece = game.currentPiece;
  for (let i = 0; i < piece.length; i++) {
    for (let j = 0; j < piece[i].length; j++) {
      let boardRow = i + game.positionY;
      let boardColumn = j + game.positionX;
      let pixel = document.getElementById(boardRow + '-' + boardColumn);
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
    game.positionY = 0;
    let randomNumber = Math.floor(Math.random() * colors.length);
    game.currentColor = colors[randomNumber];
    return;
  }
  // on top of another piece
  let beneathPiece = pieceBottom + 1;
  let classList = document.getElementById(
    beneathPiece + '-' + game.positionX
  ).classList;
  if (classList.length) {
    game.positionY = 0;
    let randomNumber = Math.floor(Math.random() * colors.length);
    game.currentColor = colors[randomNumber];
    return;
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
}, 75);
