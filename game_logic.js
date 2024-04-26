<script>
            class Car {
                constructor(x, y, angle, vel, image) {
                    this.x = x;
                    this.y = y;
                    this.angle = angle;
                    this.vel = vel;
                    this.image = image;
                }

                draw(ctx) {
                    ctx.save();
                    ctx.translate(this.x, this.y);
                    ctx.rotate(this.angle);
                    ctx.drawImage(this.image, -this.image.width / 2, -this.image.height / 2);
                    ctx.restore();
                }
            }

            class GameInfo {
                constructor(level) {
                    this.level = level;
                }

                getLevelTime() {
                    // Your logic to get the level time
                    return 60; // Example time
                }
            }

            const canvas = document.getElementById("gameCanvas");
            const ctx = canvas.getContext("2d");

            // Define image URLs
            const SPACE = new Image();
            SPACE.src = "imgs/space.jpg";

            const TRACK = new Image();
            TRACK.src = "imgs/track.png";

            const FINISH = new Image();
            FINISH.src = "imgs/finish.png";

            const GREEN_ROCKET = new Image();
            GREEN_ROCKET.src = "imgs/green-rocket.png";

            const ORANGE_ROCKET = new Image();
            ORANGE_ROCKET.src = "imgs/orange-rocket.png";

            const MAIN_FONT = "44px sans-serif";

            // Game logic variables
            const gameInfo = new GameInfo(1);
            const playerCar = new Car(100, 100, 0, 0, GREEN_ROCKET);
            const computerCar = new Car(200, 200, 0, 0, ORANGE_ROCKET);

            // Define utility functions
            function scaleImage(img, factor) {
                const width = Math.round(img.width * factor);
                const height = Math.round(img.height * factor);
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const scaledCtx = canvas.getContext('2d');
                scaledCtx.drawImage(img, 0, 0, width, height);
                return canvas;
            }

            // Game loop function
            function draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(SPACE, 0, 0);
                ctx.drawImage(TRACK, 0, 0);
                ctx.drawImage(FINISH, 130, 250);

                const levelText = `Level ${gameInfo.level}`;
                ctx.font = MAIN_FONT;
                ctx.fillStyle = "white";
                ctx.textAlign = 'center';
                ctx.fillText(levelText, 10, canvas.height - 70);

                const timeText = `Time: ${gameInfo.getLevelTime()}s`;
                ctx.fillText(timeText, 10, canvas.height - 40);

                const velText = `Vel: ${playerCar.vel.toFixed(1)}px/s`;
                ctx.fillText(velText, 10, canvas.height - 10);

                // Draw player car with rotation
                playerCar.draw(ctx);

                // Draw computer car with rotation
                computerCar.draw(ctx);

                requestAnimationFrame(draw);
            }

            // Start the game loop
            draw();
