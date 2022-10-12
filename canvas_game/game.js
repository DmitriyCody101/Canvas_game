const canvas = document.querySelector('canvas');
const canvCtx = canvas.getContext('2d');
const directionEL = document.querySelector(".direction")
const state = document.querySelector(".state")

const zoom = 30;
const FPS = 60;

canvas.width = window.innerWidth - 200;
canvas.height = window.innerHeight - 250;

let game = true;

let apples = 0;

function random(min, max) {
  let result = min + Math.random() * (max + 1 - min);
  return Math.floor(result);
}

class Player {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.direction = direction;
    }

    draw() {
        canvCtx.clearRect(0, 0, window.innerWidth, window.innerHeight)
        canvCtx.fillStyle = "black";
        canvCtx.fillRect(this.x, this.y, zoom, zoom);
    }

    move() {
        switch (this.direction) {
            case "left":
                this.x -= zoom / 5;
                directionEL.textContent = "🢀🢀🢀"
                break;
            case "right":
                this.x += zoom / 5;
                directionEL.textContent = "🢂🢂🢂"
                break;
            case "top":
                this.y -= zoom / 5;
                directionEL.textContent = "🢁🢁🢁"
                break;
            case "bottom":
                this.y += zoom / 5;
                directionEL.textContent = "🢃🢃🢃"
                break;
            default:
                break;
        }

        this.draw()

        if (this.x >= canvas.width) {
            this.x = 0;
        } else if (this.x <= 0) {
            this.x = zoom * Math.floor(canvas.width / zoom) - zoom
        } else if (this.y >= canvas.height) {
            this.y = 0;
        } else if (this.y <= 0) {
            this.y = zoom * Math.floor(canvas.height / zoom) - zoom
        }
    }
}

const player = new Player(200, 50, "bottom");
player.draw();

class Apple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw() {
        canvCtx.fillStyle = "lime";
        canvCtx.fillRect(this.x, this.y, zoom, zoom);

        if (
            player.x + zoom / 2 > this.x &
            player.x - zoom / 2 < this.x + zoom &
            player.y + zoom > this.y &
            player.y - zoom < this.y + zoom
            ) {
            /*
                If player touch apple;
            */
            apples += 1;

            state.style.background = "lime"

            if (random(0, 5) == 0) {
                apple.x += zoom * 2;
            } else if (random(0, 5) == 1) {
                apple.y += zoom * 2;
            } else if (random(0, 5) == 2) {
                apple.x -= zoom * 2;
            } else if (random(0, 4) == 3) {
                apple.y -= zoom * 2;
            }

        }


        if (this.x >= canvas.width - 50 | this.x < 0 | this.y >= canvas.height - 50 | this.y < 0) {
            this.x = random(zoom, zoom * Math.floor(canvas.width / zoom));
            this.y = random(zoom, zoom * Math.floor(canvas.height / zoom));

            /*
                If apple leave from screen;
            */
        }
    }

    move() {
        this.draw();
    }
}

const apple = new Apple(zoom * 10, zoom)
apple.draw();

class Enemy {
    constructor(x, y, power) {
        this.x = x;
        this.y = y;
        this.power = power
    }

    draw() {
        canvCtx.fillStyle = "red";
        canvCtx.fillRect(this.x, this.y, zoom, zoom);
    }

    move() {
        this.draw();
    }
}

const enemy = new Enemy(canvas.width / 2, -100, 50)

const enemyStep = zoom / 15;

function EnemyAI() {
  canvCtx.clearRect(enemy.x, enemy.y, player.size, player.size);
  if ((player.x > enemy.x) & (player.y < enemy.y)) {
    // if player to the right and to the top of enemy then ->
    enemy.x += enemyStep;
    enemy.y -= enemyStep;
  } else if ((player.x < enemy.x) & (player.y > enemy.y)) {
    // if player to the left and to the bottom of enemy them ->
    enemy.x -= enemyStep;
    enemy.y += enemyStep;
  } else if ((player.x < enemy.x) & (player.y < enemy.y)) {
    // if player to the left and to the top of enemy then ->
    enemy.x -= enemyStep;
    enemy.y -= enemyStep;
  } else if ((player.x > enemy.x) & (player.y > enemy.y)) {
    // if player to the right and to the bottom of enemy then ->
    enemy.x += enemyStep;
    enemy.y += enemyStep;
  } else if (player.x > enemy.x) {
    // if player to the right of enemy then ->
    enemy.x += enemyStep;
  } else if (player.x < enemy.x) {
    // if player to the left of enemy then ->
    enemy.x -= enemyStep;
  } else if (player.y > enemy.y) {
    // if player to the top of enemy then ->
    enemy.y += enemyStep;
  } else if (player.y < enemy.y) {
    // if player to the bottom of enemy then ->
    enemy.y -= enemyStep;
  }
}

class Deco {
    constructor(x, y) {
        this.x = player.x;
        this.y = player.y;
    }

    draw() {
        canvCtx.fillStyle = "gray"
        canvCtx.fillRect(player.x + zoom / 4, player.y + zoom / 4, zoom / 2, zoom / 2);

    }
}

const deco = new Deco(player.x, player.y)

function gameLoop() {
    setInterval(() => {
        if (game) {
            player.move();
            deco.draw();
            apple.move();
            enemy.move();
            EnemyAI();
        }
    }, 1000 / FPS);
}


setInterval(() => {
    if (player.x + zoom > enemy.x &
    player.x - zoom < enemy.x + zoom &
    player.y + zoom > enemy.y &
    player.y - zoom < enemy.y + zoom
    ) {
        apples -= 1;
        state.style.background = "red"
        console.log(apples)
    }

    /*
        If player touch enemy;
    */
}, 250);

window.addEventListener('keydown', (e) => {
    let key = e.key;

    if (key == "ArrowUp") {
        player.direction = "top";
    } else if (key == "ArrowDown") {
        player.direction = "bottom"
    } else if (key == "ArrowLeft") {
        player.direction = "left"
    } else if (key == "ArrowRight") {
        player.direction = "right"
    }

    if (key == "Space" & game) {
        game = false;
    } else if (key == "Space" & !game) {
        game = true;
    }
})

gameLoop();
