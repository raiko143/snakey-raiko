const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 40; 
const width = canvas.width / box;
const height = canvas.height / box;

let snake = [{ x: 9 * box, y: 6 * box }];
let direction = "RIGHT";
let food = { x: Math.floor(Math.random() * width) * box, y: Math.floor(Math.random() * height) * box };
let gameOver = false;
let score = 0;

const eatSound = new Audio("eat.mp4");
const gameOverSound = new Audio("gameover.mp3");
const backgroundMusic = new Audio("Wii Shop Channel - Background Music (HD).mp3"); 
backgroundMusic.loop = true; 

function animateScoreIncrease() {
    const scoreboard = document.getElementById("scoreboard");
    scoreboard.classList.add("score-increase"); 

    setTimeout(() => {
        scoreboard.classList.remove("score-increase");
    }, 200); 
}

document.getElementById("scoreboard").innerText = `Score: ${score}`;

document.addEventListener("keydown", (event) => {
    if (event.key === 'a' && direction !== "RIGHT") direction = "LEFT";
    else if (event.key === 'd' && direction !== "LEFT") direction = "RIGHT";
    else if (event.key === 'w' && direction !== "DOWN") direction = "UP";
    else if (event.key === 's' && direction !== "UP") direction = "DOWN";
});

function startGame() {
    document.getElementById("playButton").style.display = "none"; 
    document.getElementById("gameCanvas").style.display = "block"; 
    document.getElementById("controls").style.display = "block";
    backgroundMusic.play()
    gameLoop(); 
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#1a1a1a");
    gradient.addColorStop(1, "#000");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        if (i === 0) {
            drawSnakeHead(snake[i].x, snake[i].y);
        } else if (i === snake.length - 1) {
            drawSnakeTail(snake[i].x, snake[i].y);
        } else {
            drawSnakeBody(snake[i].x, snake[i].y);
        }
    }

    drawFood(food.x, food.y);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "UP") snakeY -= box;
    if (direction === "DOWN") snakeY += box;

    if (snakeX < 0) snakeX = canvas.width - box;
    if (snakeX >= canvas.width) snakeX = 0;
    if (snakeY < 0) snakeY = canvas.height - box;
    if (snakeY >= canvas.height) snakeY = 0;

    if (snakeX === food.x && snakeY === food.y) {
        eatSound.play();
        score++;
        animateScoreIncrease();
        document.getElementById("scoreboard").innerText = `Score: ${score}`;
        food = { x: Math.floor(Math.random() * width) * box, y: Math.floor(Math.random() * height) * box };
    } else {
        snake.pop();
    }

    const newHead = { x: snakeX, y: snakeY };
    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        gameOver = true;
        showGameOver();
        return;
    }

    snake.unshift(newHead);
}

function drawSnakeHead(x, y) {
    ctx.fillStyle = "#228B22"; 
    ctx.beginPath();
    ctx.moveTo(x + 5, y);
    ctx.arcTo(x + box, y, x + box, y + box, 5);
    ctx.arcTo(x + box, y + box, x, y + box, 5);
    ctx.arcTo(x, y + box, x, y, 5);
    ctx.arcTo(x, y, x + box, y, 5);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    for (let i = 5; i < box; i += 10) {
        for (let j = 5; j < box; j += 10) {
            ctx.beginPath();
            ctx.arc(x + i, y + j, 1, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    ctx.fillStyle = "#ffcc00"; 
    ctx.beginPath();
    ctx.arc(x + box * 0.3, y + box * 0.3, box * 0.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x + box * 0.7, y + box * 0.3, box * 0.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "black"; 
    ctx.beginPath();
    ctx.ellipse(x + box * 0.3, y + box * 0.3, box * 0.03, box * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(x + box * 0.7, y + box * 0.3, box * 0.03, box * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + box * 0.3, y + box * 0.65);
    ctx.quadraticCurveTo(x + box * 0.5, y + box * 0.75, x + box * 0.7, y + box * 0.65);
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.moveTo(x + box * 0.4, y + box * 0.7);
    ctx.lineTo(x + box * 0.5, y + box * 0.8);
    ctx.lineTo(x + box * 0.6, y + box * 0.7);
    ctx.fill();
}

function drawSnakeTail(x, y) {
    ctx.fillStyle = "#2E8B57"; 
    ctx.beginPath();
    ctx.moveTo(x + 5, y);
    ctx.arcTo(x + box, y, x + box, y + box, 5);
    ctx.arcTo(x + box, y + box, x, y + box, 5);
    ctx.arcTo(x, y + box, x, y, 5);
    ctx.arcTo(x, y, x + box, y, 5);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    for (let i = 5; i < box; i += 10) {
        for (let j = 5; j < box; j += 10) {
            ctx.beginPath();
            ctx.arc(x + i, y + j, 1, 0, Math.PI * 2);
            ctx.fill();
        }
    }

}

function drawSnakeBody(x, y) {
    const bodyGradient = ctx.createLinearGradient(x, y, x + box, y + box);
    bodyGradient.addColorStop(0, "#2e8b57"); 
    bodyGradient.addColorStop(1, "#66cdaa");
    ctx.fillStyle = bodyGradient;
    ctx.fillRect(x, y, box, box);

    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    for (let i = 2; i < box; i += 6) {
        for (let j = 2; j < box; j += 6) {
            ctx.beginPath();
            ctx.arc(x + i, y + j, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function drawFood(x, y) {
    ctx.fillStyle = "#FF6347"; 
    ctx.beginPath();
    ctx.arc(x + box / 2, y + box / 2, box / 2.5, 0, Math.PI * 2); 
    ctx.fill();

    ctx.strokeStyle = "#8B0000";
    ctx.lineWidth = 2;
    ctx.stroke();
}

function showGameOver() {
    document.getElementById("gameOver").style.display = "block"; 
    gameOverSound.play();
    document.getElementById("restartButton").style.display = "block";
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}

function restartGame() {
    gameOver = false;
    score = 0;
    snake = [{ x: 9 * box, y: 6 * box }];
    direction = "RIGHT";
    document.getElementById("gameOver").style.display = "none"; 
    document.getElementById("scoreboard").innerText = `Score: ${score}`;
    document.getElementById("restartButton").style.display = "none"; 
    gameLoop(); 
}

function gameLoop() {
    if (gameOver) {
        showGameOver();
        return;
    }
    draw();
    setTimeout(gameLoop, 100); 
}