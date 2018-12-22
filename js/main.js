const cvs = document.getElementById('snake');
const ctx = cvs.getContext("2d");

const controlsBtn = document.querySelector("#controls");
const controlsOuter = document.querySelector(".controls-outer");

const restartBtn = document.querySelector("#restart");

const box = 32;

// load audio files

let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let right = new Audio();
let left = new Audio();
let down = new Audio();


dead.src = "../audio/dead.mp3";
eat.src = "../audio/eat.mp3";
up.src = "../audio/up.mp3";
right.src = "../audio/right.mp3";
left.src = "../audio/left.mp3";
down.src = "../audio/down.mp3";

// load images
const ground = new Image();
ground.src = "img/ground.png";

const foodImg = new Image();
foodImg.src = "img/food.png";

let snake = [];
snake[0] = {
  x : 9 * box,
  y : 10 * box
}

let foodX, foodY;
do {
  foodX = Math.floor(Math.random()*15+2) * box;
  foodY = Math.floor(Math.random()*13+4) * box;
} while (foodX == snake[0].x && foodY == snake[0].y);

let food = {
  x : foodX,
  y : foodY
}

let score = 0;

let d;

document.addEventListener("keydown", direction);

function direction(event) {
  let key = event.keyCode;
  if (key == 37 && d != "RIGHT") {
    d = "LEFT";
    left.play();
  } else if (key == 38 && d != "DOWN") {
    d = "UP";
    up.play();
  } else if (key == 39 && d != "LEFT") {
    d = "RIGHT";
    right.play();
  } else if (key == 40 && d != "UP") {
    d = "DOWN";
    down.play();
  } else if (key == 27) {
    gameOver();
  }
}

// check collision
function collision(head, snakeArr) {
  for (let i = 0; i < snakeArr.length; i++) {
    if (head.x == snakeArr[i].x && head.y == snakeArr[i].y) {
      return true;
    }
  }
  return false;
}

// draw everything to canvas
function draw() {
  ctx.drawImage(ground,0,0);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = (i == 0) ? "#1217b3" : "white";
    ctx.fillRect(snake[i].x,snake[i].y,box,box);

    ctx.strokeStyle = "red";
    ctx.strokeRect(snake[i].x,snake[i].y,box,box);
  }

  ctx.drawImage(foodImg, food.x, food.y);

  // old head position
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // which direction
  if (d == "LEFT") snakeX -= box;
  if (d == "UP") snakeY -= box;
  if (d == "RIGHT") snakeX += box;
  if (d == "DOWN") snakeY += box;
  
  // if snake eats the food
  if (snakeX == food.x && snakeY == food.y) {
    score++;
    eat.play();

    let foodXnew, foodYnew;
    do {
      var boolCoord = true;
      foodXnew = Math.floor(Math.random()*15+2) * box;
      foodYnew = Math.floor(Math.random()*13+4) * box;
      for (let k = 0; k < snake.length; k++) {
        if (snake[k].x == foodXnew && snake[k].y == foodYnew) {
          boolCoord = false;
          break;
        }
      }
    } while (!boolCoord);

    food = {
      x : foodXnew,
      y : foodYnew
    }
  } else {
    // remove the tail
    snake.pop();
  }

  // add new head
  let newHead = {
    x : snakeX,
    y : snakeY
  }

  // GameOver
  if (snakeX < box || snakeX > 17 * box || snakeY < 3 * box || snakeY > 17 * box || collision(newHead,snake)) {
    gameOver();
  }

  snake.unshift(newHead);

  ctx.fillStyle = "white";
  ctx.font = "40px Original Surfer";
  ctx.fillText(score,2*box,1.6*box);
}

function gameOver() {
  clearInterval(game);
  dead.play();
}

let game = setInterval(draw, 150);

controlsBtn.addEventListener('click', (event) => {
  $(".controls-outer").fadeIn('slow');
  $(".controls-inner").click(function(e) {
    e.stopPropagation();
  });
});

controlsOuter.addEventListener('click', (event) => {
  $(".controls-outer").fadeOut('slow');
});

restartBtn.addEventListener('click', (event) => {
  clearInterval(game);
  location.reload();
});