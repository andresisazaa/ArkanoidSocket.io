//Tamaños de bola, paleta y bloques

const BALL_RADIUS = 10;
const PADDLE_HEIGHT = 10;
const PADDLE_WIDTH = 70;
// const PADDLE_WIDTH = 400;
const BRICK_ROW_COUNT = 14;
const BRICK_COLUMN_COUNT = 5;
const BRICK_WIDTH = 50;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 5;
const BRICK_OFFSET_TOP = 30;
const BRICK_OFFSET_LEFT = 20;

class Brick {
    constructor(posX, posY, status) {
        this.x = posX;
        this.y = posY;
        this.status = status;
    }
}

class Player {
    constructor(id, paddle) {
        this.id = id;
        this.paddle = paddle;
    }
}

class Game {
    constructor(ball, player1, player2, score, lives, bricks) {
        this.ball = ball;
        this.player1 = player1;
        this.player2 = player2;
        this.score = score;
        this.lives = lives
        this.level = 1;
        this.bricks = bricks;
    }
}

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
// Variables del juego

let ball = {
    posX: canvas.width / 2,
    posY: canvas.height - 30
};
let paddle1 = {
    // posX: 250,
    posX: 0,
    color: '#00661B'
};
let paddle2 = {
    // posX: 500,
    posX: 400,
    color: '#0095DD'
};

let score = 0;
let lives = 3;
let player1 = new Player(1, paddle1);
let player2 = new Player(2, paddle2);

var dx = 7;
var dy = -7;
var bricks = [];
for (c = 0; c < BRICK_COLUMN_COUNT; c++) {
    bricks[c] = [];
    for (r = 0; r < BRICK_ROW_COUNT; r++) {
        bricks[c][r] = new Brick(0, 0, 1);
    }
}

let gameSetUp = {
    ball: ball,
    player1: player1,
    player2: player2,
    score: score,
    lives: lives,
    bricks: bricks
}


// SOCKET IO

var params = new URLSearchParams(window.location.search);
if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('Nombre y sala son necesarios');
}
let usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala'),
    posX: paddle2.posX
};

let socket = io();

socket.on('connect', function () {
    socket.emit('ingresarSala', usuario, function (res) {
        console.log(res);
        // player1.id = res.id;
    });
});

socket.on('disconnect', function () {
    console.log('Perdimos conexion con el servidor');
});

// socket.on('startGameServer', function (data) {
//     var game = new Game(data.ball, data.player1, data.player2, data.score, data.lives, data.bricks);
// });
// socket.emit('startGame', gameSetUp);

socket.on('updateServer', function (data) {
    game.ball.posX = data.posX;
    game.ball.posY = data.posY;
    game.score = data.score;
    game.lives = data.lives;
});

var game = new Game(ball, player1, player2, score, lives, bricks);



canvas.addEventListener("mousemove", mouseMoveHandler, false);
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        game.player1.paddle.posX = relativeX - PADDLE_WIDTH / 2;
        game.player2.paddle.posX = relativeX - PADDLE_WIDTH / 2 + 100;
    }
}

function collisionDetection() {
    for (c = 0; c < BRICK_COLUMN_COUNT; c++) {
        for (r = 0; r < BRICK_ROW_COUNT; r++) {
            var b = game.bricks[c][r];
            if (b.status === 1) {
                if (game.ball.posX > b.x && game.ball.posX < b.x + BRICK_WIDTH && game.ball.posY > b.y && game.ball.posY < b.y + BRICK_HEIGHT) {
                    dy = -dy;
                    b.status = 0;
                    game.score++;
                }
            }
        }
    }
}


function drawBall() {
    ctx.beginPath();
    ctx.arc(game.ball.posX, game.ball.posY, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.closePath();
}

function drawPaddles() {
    ctx.beginPath();
    ctx.rect(game.player1.paddle.posX, canvas.height - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillStyle = "#00661B";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(game.player2.paddle.posX, canvas.height - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (c = 0; c < BRICK_COLUMN_COUNT; c++) {
        for (r = 0; r < BRICK_ROW_COUNT; r++) {
            if (game.bricks[c][r].status === 1) {
                var brickX = (r * (BRICK_WIDTH + BRICK_PADDING)) + BRICK_OFFSET_LEFT;
                var brickY = (c * (BRICK_HEIGHT + BRICK_PADDING)) + BRICK_OFFSET_TOP;
                game.bricks[c][r].x = brickX;
                game.bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT);
                if (c % 2 === 0) {
                    ctx.fillStyle = "#C91D0A";
                }
                else {
                    ctx.fillStyle = "#FF8000";
                }
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText("Score: " + game.score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText("Lives: " + game.lives, canvas.width - 70, 20);
}

function reset() {
    game.score = 0;
    for (c = 0; c < BRICK_COLUMN_COUNT; c++) {
        for (r = 0; r < BRICK_ROW_COUNT; r++) {
            var b = bricks[c][r];
            b.status = 1;
        }
    }
    game.ball.posX = canvas.width / 2;
    game.ball.posY = canvas.height - 50;
}

function nextLevel() {
    game.level++;
    switch (game.level) {
        case 1:
            dx = 7;
            dy = -7;
            break;
        case 2:
            dx = 10;
            dy = -10;
            break;
        case 3:
            dx = 13;
            dy = -13;
            break;
        default:
            break;
    }
    if (game.level > 3) {
        alert('Juego terminado');
        document.location.reload();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddles();
    drawScore();
    drawLives();
    collisionDetection();
    if (game.score === BRICK_ROW_COUNT * BRICK_COLUMN_COUNT) {
        reset()
        nextLevel();
    }
    if (game.ball.posX + dx > canvas.width - BALL_RADIUS || game.ball.posX + dx < BALL_RADIUS) {
        dx = -dx;
    }
    if (game.ball.posY + dy < BALL_RADIUS) {
        dy = -dy;
    }
    else if (game.ball.posY + dy > canvas.height - BALL_RADIUS) {
        if ((game.ball.posX > game.player1.paddle.posX && game.ball.posX < game.player1.paddle.posX + PADDLE_WIDTH) || (game.ball.posX > game.player2.paddle.posX && game.ball.posX < game.player2.paddle.posX + PADDLE_WIDTH)) {
            dy = -dy;
        }
        else {
            game.lives--;
            if (game.lives <= 0) {
                // alert("GAME OVER");
                // document.location.reload();
            }
            else {
                game.ball.posX = canvas.width / 2;
                game.ball.posY = canvas.height - 50;
            }
        }
    }
    game.ball.posX += dx;
    game.ball.posY += dy;
    let data = {
        x: game.ball.posX,
        y: game.ball.posY,
        p1: game.player1,
        p2: game.player2,
        score: game.score,
        lives: game.lives,
        bricks: game.bricks,
    }
    socket.emit('update', data);

    requestAnimationFrame(draw);
}
draw();
