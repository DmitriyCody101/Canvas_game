const canvas = document.querySelector('canvas');
const canvCtx = canvas.getContext('2d');
const directionEL = document.querySelector(".direction")
const state = document.querySelector(".state")

const arcadeBtn = document.querySelector(".arcade")

arcadeBtn.onclick = () => {
    const zoom = 30;
    const FPS = 60;

    canvas.width = window.innerWidth - 200;
    canvas.height = window.innerHeight - 250;

    const abilityReload = 15; // of seconds

    const font = {
        size: "2vw",
        family: "sans"
    }

    const charactersColors = {
        player: [0, 0, 0].toString(),
        apple: [50, 200, 50].toString(),
        enemy: [255, 0, 0].toString(),
        invisiblePotion: [255, 0, 255].toString(),
        ability: [50, 200, 50].toString(),
        water: [0, 255, 255].toString()
    }

    const fontStr = font.size + " " + font.family;

    let playerSpeed = zoom / 5;

    let game = true;

    let apples = 0;

    function random(min, max) {
        let result = min + Math.random() * (max + 1 - min);
        return Math.floor(result);
    }

    function randomPos() {
        let result = {
            x: random(zoom, zoom * Math.floor(canvas.width / zoom)),
            y: random(zoom, zoom * Math.floor(canvas.height / zoom))
        };

        return result;
    }

    let playerOpacity = 1;

    class Player {
        constructor(x, y, direction) {
            this.x = x;
            this.y = y;
            this.direction = direction;
            this.visible = true;
        }

        draw() {
            if (!this.visible) {
                playerOpacity = 0.5;
            } else {
                playerOpacity = 1;
            }

            canvCtx.fillStyle = `rgba(${charactersColors.player}, ${playerOpacity})`;
            canvCtx.fillRect(this.x, this.y, zoom, zoom);
        }

        move() {
            switch (this.direction) {
                case "left":
                    this.x -= playerSpeed;
                    directionEL.textContent = "🢀🢀🢀"
                    break;
                case "right":
                    this.x += playerSpeed;
                    directionEL.textContent = "🢂🢂🢂"
                    break;
                case "top":
                    this.y -= playerSpeed;
                    directionEL.textContent = "🢁🢁🢁"
                    break;
                case "bottom":
                    this.y += playerSpeed;
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
            canvCtx.fillStyle = `rgb(${charactersColors.apple})`;
            canvCtx.fillRect(this.x, this.y, zoom, zoom);

            if (
                player.x + zoom > this.x &
                player.x - zoom < this.x + zoom &
                player.y + zoom > this.y &
                player.y - zoom < this.y + zoom
                ) {
                /*
                    If player touch apple;
                */
                apples += 1;

                state.style.background = `rgb(${charactersColors.apple})`;

                this.x = randomPos().x;
                this.y = randomPos().y;

            }


            if (this.x >= canvas.width - 50 | this.x < 50 | this.y >= canvas.height - 50 | this.y < 50) {
                this.x = randomPos().x;
                this.y = randomPos().y;

                /*
                    If apple leave from screen;
                */
            }
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
            canvCtx.fillStyle = `rgb(${charactersColors.enemy})`;
            canvCtx.fillRect(this.x, this.y, zoom * 2, zoom * 2);
        }
    }

    const enemy = new Enemy(canvas.width / 2, -100, 50)

    let enemyStep = zoom / 10;

    function EnemyAI() {
        if (player.visible) {
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
    }

    class Ability {
        constructor() {
            this.used = false;
            this.abilityIndicatorOpacity = 1;
        }

        drawIndicator() {

            if (this.used) {
                this.abilityIndicatorOpacity = 0;
            } else {
                this.abilityIndicatorOpacity = 1;
            }

            canvCtx.fillStyle = `rgba(${charactersColors.ability}, ${this.abilityIndicatorOpacity})`
            canvCtx.fillRect(player.x + zoom / 4, player.y + zoom / 4, zoom / 2, zoom / 2);
        }
    }

    const ability = new Ability()

    class Score {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.score = apples;
        }

        draw() {
            canvCtx.font = fontStr;
            canvCtx.fillStyle = "black"
            score.score = apples;
            canvCtx.fillText(`Score:${this.score}`, this.x, this.y);
        }
    }

    const score = new Score(20, 30)

    class InvisiblePotion {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.touched = false;
            this.visible = 1; // 1 is true and 0 is false
        }

        draw() {
            canvCtx.fillStyle = `rgba(255, 0, 255, ${this.visible})`;
            canvCtx.fillRect(this.x, this.y, zoom, zoom);

            if (
                player.x + zoom > this.x &
                player.x - zoom < this.x + zoom &
                player.y + zoom > this.y &
                player.y - zoom < this.y + zoom &
                !this.touched
            ) {
                player.visible = false;
                this.touched = true;
                this.visible = 0;

                setTimeout(() => {
                    player.visible = true;
                }, 3000);

                setTimeout(() => {
                    this.touched = false;
                    this.visible = 1;
                }, 20000);

                this.x = randomPos().x;
                this.y = randomPos().y;
            }
        }
    }

    const invisiblePotion = new InvisiblePotion(randomPos().x, randomPos().y);

    class Water {
        constructor(height) {
            this.height = height;
        }

        draw() {
            canvCtx.fillStyle = `rgb(${charactersColors.water})`;
            canvCtx.fillRect(0, canvas.height - this.height, canvas.width, this.height)

            console.log(this.height)

            if (player.y > canvas.height - this.height & apples > 0) {
                apples -= 1;
            }
        }
    }

    const water = new Water(0);

    let waterRaising = false;

    setTimeout(() => waterRaising = true, 10 * 1000);

    function waterUp(value) {
        if (waterRaising & player.visible) {
            water.height += value;
        }
    }

    function randomYExceptWater() {
        return {
            y: random(zoom, zoom * Math.floor(canvas.height / zoom) - water.height - zoom)
        }
    }

    class LowerWater {
        constructor(x, y, px) {
            this.x = x;
            this.y = y;
            this.px = px;
        }

        draw() {
            canvCtx.fillStyle = `rgb(${charactersColors.water})`
            canvCtx.fillRect(this.x, this.y, zoom, zoom)
        }

        move() {
            this.draw();

            if (
                player.x + zoom > this.x &
                player.x - zoom < this.x + zoom &
                player.y + zoom > this.y &
                player.y - zoom < this.y + zoom
            ) {
                water.height -= this.px;

                if (water.height < -10) {
                    water.height = -10;
                }

                this.x = randomPos().x;
                this.y = randomYExceptWater().y;
            }

            this.draw();
        }
    }

    const lowerWater = new LowerWater(randomPos().x, randomPos().y, 20)

    function gameLoop() {
        setInterval(() => {
            if (game) {
                canvCtx.clearRect(0, 0, canvas.width, canvas.height)
                player.move();
                ability.drawIndicator();
                apple.draw();
                score.draw();
                invisiblePotion.draw();
                enemy.draw();
                if (waterRaising) {
                    waterUp(0.1);
                    lowerWater.move();
                    water.draw();
                }
                EnemyAI();
            }
        }, 1000 / FPS);
    }


    setInterval(() => {
        if (player.x + zoom > enemy.x &
        player.x - zoom < enemy.x + zoom &
        player.y + zoom > enemy.y &
        player.y - zoom < enemy.y + zoom &
        apples > 0 &
        player.visible
        ) {
            apples -= 1;
            state.style.background = "red"
        }

        /*
            If player touch enemy;
        */
    }, 200);

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

        if (key == " " & game) {
            game = false;
        } else if (key == " " & !game) {
            game = true;
        }

        /* void it's a space key idk why */

        if (key == "Enter" & !ability.used) {
            ability.used = true;
            enemyStep = zoom / 50;
            setTimeout(() => {
                ability.used = false;
            }, abilityReload * 1000); // in seconds

            setTimeout(() => {
                enemyStep = zoom / 10;
            }, 5000);

        }
    })

    gameLoop();
}
