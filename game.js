const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');

let snake = [
  {x: 10, y: 10},
  {x: 9, y: 10},
  {x: 8, y: 10},
];

let direction = 'right';

function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = 'green';
    ctx.fillRect(snake[i].x * 10, snake[i].y * 10, 10, 10);
  }
}

function moveSnake() {
  let head = {x: snake[0].x, y: snake[0].y};
  switch (direction) {
    case 'up':
      head.y--;
      break;
    case 'down':
      head.y++;
      break;
    case 'left':
      head.x--;
      break;
    case 'right':
      head.x++;
      break;
  }
  snake.unshift(head);
  snake.pop();
}

function checkCollision() {
  if (snake[0].x < 0 || snake[0].x >= canvas.width / 10 ||
      snake[0].y < 0 || snake[0].y >= canvas.height / 10) {
    return true;
  }
  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      return true;
    }
  }
  return false;
}

function main() {
  if (checkCollision()) {
    alert('Game over!');
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  moveSnake();
  drawSnake();
  setTimeout(main, 100);
}

document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 38: // up arrow
      if (direction !== 'down') {
        direction = 'up';
      }
      break;
    case 40: // down arrow
      if (direction !== 'up') {
        direction = 'down';
      }
      break;
    case 37: // left arrow
      if (direction !== 'right') {
        direction = 'left';
      }
      break;
    case 39: // right arrow
      if (direction !== 'left') {
        direction = 'right';
      }
      break;
  }
});

main();
