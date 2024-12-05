const app = new PIXI.Application();

const gameCanvas = document.getElementById("game");
let c;

app.init({
  view: gameCanvas,
  width: 600,
  height: 600,
  backgroundAlpha: 0,
});
let indexText;

globalThis.__PIXI_APP__ = app;
number = 0;
const colors = ["red", "yellow", "blue", "green", "purple", "orange"];

let pieces = document.getElementById("pieces");
let players = document.getElementById("players");

let graphics;
const container = new PIXI.Container();
app.stage.addChild(container);
container.position.set(335, 0);
container.label = "fking cont";
console.log(app);

// Pyramid parameters
const circleRadius = 16; // Radius of the circle
const spacing = 5; // Spacing between circles
const centerX = app.stage.width / 2;
const centerY = app.stage.height / 2;

function drawPyramid(grid) {
  const style = new PIXI.TextStyle({
    fill: "white",
  });

  const yOffset = 50;

  grid.forEach((blocksInRow, rowIndex) => {
    const totalWidth =
      blocksInRow * (circleRadius * 2) + (blocksInRow - 1) * spacing; // Calculate row width
    const startX = centerX - totalWidth / 2; // Center the row horizontally
    for (let i = 0; i < blocksInRow; i++) {
      c = new PIXI.Container();
      c.label = `${i}`;
      const x = startX + i * (circleRadius * 2 + spacing);
      const y = yOffset + rowIndex * (circleRadius * 2 + spacing);
      indexText++;
      graphics = new PIXI.Graphics();
      graphics.beginFill(0x000000); // Black color in hexadecimal
      graphics.drawCircle(0, 0, circleRadius);
      graphics.endFill();
      c.x = x;
      c.y = y;

      c.addChild(graphics);
      container.addChild(c);

      graphics.interactive = true;
      graphics.cursor = "pointer";

      const index = container.getChildIndex(c);

      graphics.on("pointertap", () => {
        console.log(`number: ${index + 1}`);
      });
      
    }
  });
}

const grid = [2, 3, 4, 11, 12, 11, 10, 9, 10, 11, 12, 11, 4, 3, 2];

drawPyramid(grid);

function startGame() {
  if (players.value == 2) {
    for (let i = 0; i < pieces.value; i++) {
      const circle = firstPlayer[i];
      circle.clear();
      circle.beginFill(colors[0]);
      circle.drawCircle(0, 0, 10);
      circle.endFill();
    }

    for (let i = 0; i < pieces.value; i++) {
      const circle = secondPlayer[i];
      circle.clear();
      circle.beginFill(colors[1]);
      circle.drawCircle(0, 0, 10);
      circle.endFill();
    }
  } else if (players.value == 3) {
    for (let i = 0; i < pieces.value; i++) {
      const circle = firstPlayer[i];
      circle.clear();
      circle.beginFill(colors[0]);
      circle.drawCircle(0, 0, 10);
      circle.endFill();
    }

    for (let i = 0; i < pieces.value; i++) {
      const circle = secondPlayer[i];
      circle.clear();
      circle.beginFill(colors[1]);
      circle.drawCircle(0, 0, 10);
      circle.endFill();
    }
    for (let i = 0; i < pieces.value; i++) {
      const circle = thirdPlayer[i];
      circle.clear();
      circle.beginFill(colors[2]);
      circle.drawCircle(0, 0, 10);
      circle.endFill();
    }
  }
  // Add more logic for other player numbers...
}




let currentPlayer = 0;
let playerTimers = [];

function startTimer(playerIndex) {
  let countdownTime = 70;
  const timerElement = document.getElementById("timer");

  if (playerTimers[playerIndex]) {
    clearInterval(playerTimers[playerIndex]);
  }

  playerTimers[playerIndex] = setInterval(() => {
    const minutes = Math.floor(countdownTime / 60);
    const seconds = countdownTime % 60;
    const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

    countdownTime--;

    if (countdownTime < 0) {
      clearInterval(playerTimers[playerIndex]);
      timerElement.textContent = "Time's up!";
      nextPlayer();
    }
  }, 1000);
}

function nextPlayer() {
  currentPlayer = (currentPlayer + 1) % players.value;
  startTimer(currentPlayer);
}

function movePieceToClosestCircle(piece, x, y, array) {
  let closestCircle = null;
  let minDistance = Infinity;

  for (let i = 0; i < array.length; i++) {
    const circle = array[i];
    const dist = Math.hypot(circle.x - x, circle.y - y);

    if (dist < minDistance) {
      minDistance = dist;
      closestCircle = circle;
    }
  }
  if (closestCircle) {
    piece.x = closestCircle.x;
    piece.y = closestCircle.y;
  }
}

function pieceInteraction(piece, array) {
  piece.interactive = true;
  piece.buttonMode = true;

  piece.on("pointerdown", (event) => {
    const piecePosition = event.data.global;

    movePieceToClosestCircle(piece, piecePosition.x, piecePosition.y, array);

    startTimer(currentPlayer);
    nextPlayer();
  });
}

startTimer(currentPlayer);
nextPlayer();
