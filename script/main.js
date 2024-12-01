let app;

app = new PIXI.Application();
const gameCanvas = document.getElementById('game');

app.init({
    view: gameCanvas,
    width: 600,
    height: 600,
    backgroundAlpha: 0,
});
globalThis.__PIXI_APP__ = app;

const colors = ["red", "yellow", "blue", "green", "purple", "orange"];

let pieces = document.getElementById("pieces");
let players = document.getElementById("players");

let firstPlayer = [];
let secondPlayer = [];
let thirdPlayer = [];
let fourthPlayer = [];
let fifthPlayer = [];
let sixthPlayer = [];

function generateCircles(holesNumber, x, y) {
    const canvasWidth = x;
    const canvasHeight = y;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const radius = 10;
    const spacing = 30;

    // Create a container for circles
    const container = new PIXI.Container();
    app.stage.addChild(container);

    // Add the center circle
    const centerCircle = new PIXI.Graphics();
    centerCircle.beginFill("black");
    centerCircle.drawCircle(0, 0, radius);
    centerCircle.endFill();
    centerCircle.x = centerX;
    centerCircle.y = centerY;
    container.addChild(centerCircle);

    // Add circles for each ring
    for (let ring = 1; ring <= holesNumber; ring++) {
        const count = 6 * ring; // Number of circles in the current ring
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2; // Angle for circle position
            const x = centerX + Math.cos(angle) * spacing * ring;
            const y = centerY + Math.sin(angle) * spacing * ring;

            const circle = new PIXI.Graphics();
            circle.beginFill("black"); 
            circle.drawCircle(0, 0, radius);
            circle.endFill();
            circle.x = x;
            circle.y = y;

            container.addChild(circle);
        }
    }
}

function generateSpawns(holesNumber, x, y, array) {
    const canvasWidth = x;
    const canvasHeight = y;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const radius = 10;
    const spacing = 30;

    const container = new PIXI.Container();
    app.stage.addChild(container);

    const centerCircle = new PIXI.Graphics();
    centerCircle.beginFill("black");
    centerCircle.drawCircle(0, 0, radius);
    centerCircle.endFill();
    centerCircle.x = centerX;
    centerCircle.y = centerY;
    container.addChild(centerCircle);

    array.push(centerCircle);

    for (let ring = 1; ring <= holesNumber; ring++) {
        const count = 6 * ring;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * spacing * ring;
            const y = centerY + Math.sin(angle) * spacing * ring;

            const circle = new PIXI.Graphics();
            circle.beginFill("black");
            circle.drawCircle(0, 0, radius);
            circle.endFill();
            circle.x = x;
            circle.y = y;

            container.addChild(circle);
            array.push(circle);
        }
    }
}

generateCircles(5, 600, 600);
generateSpawns(1, 600, 1000, firstPlayer);
generateSpawns(1, 620, 200, secondPlayer);
generateSpawns(1, 920, 340, thirdPlayer);
generateSpawns(1, 320, 900, fourthPlayer);
generateSpawns(1, 300, 300, fifthPlayer);
generateSpawns(1, 880, 900, sixthPlayer);

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

        timerElement.textContent = `${minutes}:${formattedSeconds}`;
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

    piece.on('pointerdown', (event) => {
        const piecePosition = event.data.global;

        movePieceToClosestCircle(piece, piecePosition.x, piecePosition.y, array);

        startTimer(currentPlayer);
        nextPlayer();
    });
}

for (let i = 0; i < firstPlayer.length; i++) {
    pieceInteraction(firstPlayer[i], firstPlayer);
}
for (let i = 0; i < secondPlayer.length; i++) {
    pieceInteraction(secondPlayer[i], secondPlayer);
}
for (let i = 0; i < thirdPlayer.length; i++) {
    pieceInteraction(thirdPlayer[i], thirdPlayer);
}
for (let i = 0; i < fourthPlayer.length; i++) {
    pieceInteraction(fourthPlayer[i], fourthPlayer);
}
for (let i = 0; i < fifthPlayer.length; i++) {
    pieceInteraction(fifthPlayer[i], fifthPlayer);
}
for (let i = 0; i < sixthPlayer.length; i++) {
    pieceInteraction(sixthPlayer[i], sixthPlayer);
}

startTimer(currentPlayer);
nextPlayer();
