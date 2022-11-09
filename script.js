// GAME STATE
let game = {
  playing: false,
  timer: 0,
  currentPiece: [
    [1, 1],
    [1, 1],
  ],
  positionY: 0,
};

// DOM Elements
let playBtn = document.getElementById('play');
let timer = document.getElementById('timer');
let table = document.getElementById('table');

playBtn.addEventListener('click', function () {
  game.playing = !game.playing;
  if (game.playing) {
    playBtn.innerText = 'Pause';
  } else {
    playBtn.innerText = 'Start';
  }
});

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

// Game Functions
function drawPiece() {
  let piece = game.currentPiece;
  for (let i = 0; i < piece.length; i++) {
    for (let j = 0; j < piece[i].length; j++) {
      let boardRow = i + game.positionY;
      let pixel = document.getElementById(boardRow + '-' + j);
      pixel.classList.add('red');
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
      let pixel = document.getElementById(boardRow + '-' + j);
      pixel.classList.remove('red');
    }
  }
}

function checkBottom() {
  let piece = game.currentPiece;
  let tableBottom = table.children.length - 1;
  let pieceBottom = piece.length - 1 + game.positionY;
  if (pieceBottom === tableBottom) {
    game.positionY = 0;
    return;
  }
  let beneathPiece = pieceBottom + 1;
  let classList = document.getElementById(beneathPiece + '-' + 0).classList;
  if (classList.length) {
    game.positionY = 0;
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
