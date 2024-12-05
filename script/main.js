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

// Add this function to spawn players at specific positions
function spawnPlayersAtPositions(playerIndex, pieces, positions) {
    const circles = container.children; // Get all children in the container
    const playerPieces = []; // Array to store the spawned player pieces
  
    positions.forEach((pos, i) => {
      if (pos >= 0 && pos < circles.length) {
        // Ensure the position is valid within the container's child range
        const circle = circles[pos];
        const piece = new PIXI.Graphics();
  
        piece.beginFill(colors[playerIndex % colors.length]); // Use player's color
        piece.drawCircle(0, 0, circleRadius - 4); // Slightly smaller than the circle
        piece.endFill();
  
        // Position the piece on the circle
        piece.x = circle.x;
        piece.y = circle.y;
  
        // Add interactivity to the piece
        pieceInteraction(piece, container.children);
  
        // Add the piece to the container and the player's piece array
        container.addChild(piece);
        playerPieces.push(piece);
      } else {
        console.error(`Position ${pos} is out of bounds for container.children`);
      }
    });
  
    return playerPieces;
  }
  
  // Example usage
  const player1Positions = [0, 1, 2]; // Specific indexes of circles for player 1
  const player2Positions = [114, 113, 112]; // Specific indexes of circles for player 2
  const player3Positions = [20, 32, 9]; // Specific indexes of circles for player 1
  const player4Positions = [105, 94, 82]; // Specific indexes of circles for player 2
  
  const player1Pieces = spawnPlayersAtPositions(0, 3, player1Positions);
  const player2Pieces = spawnPlayersAtPositions(1, 3, player2Positions);
  const player3Pieces = spawnPlayersAtPositions(2, 3, player3Positions);
  const player4Pieces = spawnPlayersAtPositions(3, 3, player4Positions);
  
  // Store all player pieces (optional for further game logic)
  const allPlayers = [player1Pieces, player2Pieces];


// Update the startGame function to use the allPlayers data
function startGame() {
  allPlayers.forEach((playerPieces, playerIndex) => {
    playerPieces.forEach((piece) => {
      piece.clear();
      piece.drawCircle(0, 0, circleRadius - 4);
      piece.endFill();
    });
  });
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
