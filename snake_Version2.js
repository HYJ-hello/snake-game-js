const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const box = 20; // 每格像素
const row = 20;
const col = 20;

let snake;
let food;
let direction;
let score;
let gameInterval;
let isGameOver = false;

function getSpeed() {
  const diff = document.getElementById('difficulty')?.value || 'medium';
  if (diff === 'easy') return 200;   // 简单：慢
  if (diff === 'hard') return 60;    // 困难：快
  return 120;                        // 中等：中速
}

function init() {
  snake = [{x: 9, y: 9}];
  direction = 'RIGHT';
  score = 0;
  isGameOver = false;
  food = randomFood();
  document.getElementById('score')。innerText = "分数: " + score;
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(draw， getSpeed());
}

function randomFood() {
  let newFood;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * col),
      y: Math.floor(Math.random() * row)
    };
    if (!snake.some(s => s.x === newFood.x && s.y === newFood.y)) break;
  }
  return newFood;
}

document.addEventListener('keydown', function (e) {
  if (isGameOver) return;
  if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  else if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  else if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
  else if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});

function draw() {
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 画蛇
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#4caf50" : "#8bc34a";
    ctx.fillRect(snake[i].x * box, snake[i].y * box, box - 1, box - 1);
  }

  // 画食物
  ctx.fillStyle = "#ff5722";
  ctx.fillRect(food.x * box, food.y * box, box - 1, box - 1);

  // 计算新头部
  let head = {x: snake[0].x, y: snake[0].y};
  if (direction === 'LEFT') head.x--;
  if (direction === 'UP') head.y--;
  if (direction === 'RIGHT') head.x++;
  if (direction === 'DOWN') head.y++;

  // 判断撞墙或撞自己
  if (
    head.x < 0 || head.x >= col ||
    head.y < 0 || head.y >= row ||
    snake.some(s => s.x === head.x && s.y === head.y)
  ) {
    gameOver();
    return;
  }

  snake.unshift(head);

  // 吃到食物
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById('score').innerText = "分数: " + score;
    food = randomFood();
  } else {
    snake.pop();
  }
}

function gameOver() {
  clearInterval(gameInterval);
  isGameOver = true;
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = "32px 微软雅黑";
  ctx.textAlign = "center";
  ctx.fillText("游戏结束!", canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = "20px 微软雅黑";
  ctx.fillText("分数: " + score, canvas.width / 2, canvas.height / 2 + 30);
}

function restart() {
  init();
}

init();
