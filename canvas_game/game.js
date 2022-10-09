const canvas = document.querySelector('canvas');
const canvCtx = canvas.getContext('2d');
const directionEL = document.querySelector(".direction")

const cubeSize = 50;
const moveIntervalsec = 0.1;
const FPS = 60;

canvas.width = window.innerWidth - 200;
canvas.height = window.innerHeight - 200;

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
        canvCtx.fillRect(this.x, this.y, cubeSize, cubeSize);
    }

    move() {
        switch (this.direction) {
            case "left":
                this.x -= cubeSize / 4;
                directionEL.textContent = "🢀🢀🢀"
                break;
            case "right":
                this.x += cubeSize / 4;
                directionEL.textContent = "🢂🢂🢂"
                break;
            case "top":
                this.y -= cubeSize / 4;
                directionEL.textContent = "🢁🢁🢁"
                break;
            case "bottom":
                this.y += cubeSize / 4;
                directionEL.textContent = "🢃🢃🢃"
                break;
            default:
                break;
        }

        this.draw()

        if (this.x >= canvas.width | this.x < 0 | this.y >= canvas.height | this.y < 0) {
            this.x = cubeSize * 5;
            this.y = cubeSize * 5;

            /*
                If player leave from screen
            */
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
        canvCtx.fillRect(this.x, this.y, cubeSize, cubeSize);

        if (
            player.x + cubeSize / 2 > this.x &
            player.x - cubeSize / 2 < this.x + cubeSize &
            player.y + cubeSize > this.y &
            player.y - cubeSize < this.y + cubeSize
            ) {
            apples += 1;

            if (random(0, 2) == 0) {
                apple.x += cubeSize * 3;
            } else {
                apple.y += cubeSize * 3;
            }
        }

        if (this.x >= canvas.width | this.x < 0 | this.y >= canvas.height | this.y < 0) {
            this.x = cubeSize * 5;
            this.y = cubeSize * 5;

            /*
                If apple leave from screen
            */
        }
    }

    move() {
        this.draw();
    }
}

const apple = new Apple(cubeSize * 10, cubeSize)
apple.draw();

class Enemy {
    constructor(x, y, power) {
        this.x = x;
        this.y = y;
        this.power = power;
    }

    draw() {
        canvCtx.fillStyle = "red";
        canvCtx.fillRect(this.x, this.y, cubeSize, cubeSize);
    }

    move() {
        this.draw();
    }
}

const enemy = new Enemy(-100, 300, 50)

setInterval(() => {
    if (game) {
        player.move();
        apple.move();
        enemy.x += cubeSize / 4;
        enemy.draw();
    }
}, 1000 / FPS);

window.addEventListener('keypress', (e) => {
    let keyC = e.keyCode;

    if (keyC == 119) {
        player.direction = "top";
    } else if (keyC == 115) {
        player.direction = "bottom"
    } else if (keyC == 97) {
        player.direction = "left"
    } else if (keyC == 100) {
        player.direction = "right"
    }

    if (keyC == 32 & game) {
        game = false;
    } else if (keyC == 32 & !game) {
        game = true;
    }
})
