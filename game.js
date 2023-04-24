// constants
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const BALL_RADIUS = 10;
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 10;
const PADDLE_SPEED = 5;
const BALL_SPEED = 5;

// variables
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let model = null;
let video = null;
let currentPrediction = null;
let paddle = null;
let ball = null;
let running = false;
let intervalId = null;

// load the model and start the game
handTrack.load().then(startGame);

function startGame() {
	// get the video element
	video = document.createElement('video');
	video.srcObject = null;
	video.autoplay = true;
	video.width = CANVAS_WIDTH;
	video.height = CANVAS_HEIGHT;
	
	// get the model
	handTrack.startVideo(video).then(function(status) {
		if (status) {
			model = handTrack.getModel();
			requestAnimationFrame(renderFrame);
		}
	});

	// initialize the game
	initializeGame();
}

function initializeGame() {
	// create the paddle
	paddle = {
		x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
		y: CANVAS_HEIGHT - PADDLE_HEIGHT,
		width: PADDLE_WIDTH,
		height: PADDLE_HEIGHT
	};

	// create the ball
	ball = {
		x: CANVAS_WIDTH / 2,
		y: CANVAS_HEIGHT / 2,
		radius: BALL_RADIUS,
		dx: BALL_SPEED,
		dy: BALL_SPEED
	};

	// start the game loop
	running = true;
	intervalId = setInterval(updateGame, 20);
}

function renderFrame() {
	// update the current prediction
	handTrack.detect(model, video).then(predictions => {
		if (predictions.length > 0) {
			currentPrediction = predictions[0].bbox;
		} else {
			currentPrediction = null;
		}
	});

	requestAnimationFrame(renderFrame);
}

function updateGame() {
	// update the paddle's position based on the hand gesture
	if (currentPrediction) {
		const x = currentPrediction[0] + currentPrediction[2] / 2;
		const y = currentPrediction[1] + currentPrediction[3] / 2;
		if (x < paddle.x) {
			paddle.x -= PADDLE_SPEED;
		} else if (x > paddle.x + paddle.width) {
			paddle.x += PADDLE_SPEED;
		}
	}

	// update the ball's position
	ball.x += ball.dx;
	ball.y += ball.dy;

// check for collision with walls
if (ball.x < 0 || ball.x > CANVAS_WIDTH - ball.radius) {
	ball.dx = -ball.dx;
}
if (ball.y < 0 || ball.y > CANVAS_HEIGHT - ball.radius) {
	ball.dy = -ball.dy;
}

// check for collision with paddle
if (ball.x + ball.radius >= paddle.x && ball.x - ball.radius <= paddle.x + paddle.width && ball.y + ball.radius >= paddle.y) {
	ball.dy = -ball.dy;
}

// update the paddle's position based on the hand gesture
if (currentPrediction) {
	const x = currentPrediction[0] + currentPrediction[2] / 2;
	if (x < paddle.width / 2) {
		paddle.x = 0;
	} else if (x > CANVAS_WIDTH - paddle.width / 2) {
		paddle.x = CANVAS_WIDTH - paddle.width;
	} else {
		paddle.x = x - paddle.width / 2;
	}
}

// check for game over
if (ball.y > CANVAS_HEIGHT - ball.radius) {
	gameOver();
}

// draw the game
drawGame();
}

function drawGame() {
// clear the canvas
ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  // draw the ball
ctx.beginPath();
ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
ctx.fillStyle = ball.color;
ctx.fill();
ctx.closePath();

// draw the paddle
ctx.beginPath();
ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
ctx.fillStyle = paddle.color;
ctx.fill();
ctx.closePath();
}

function gameOver() {
// stop the game
running = false;
clearInterval(intervalId);
  // display the game over message
alert('Game Over! Your score is ' + score);
}

// start the game
startGame();
