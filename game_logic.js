            const canvas = document.getElementById("gameCanvas");
            const ctx = canvas.getContext("2d");

            // Define image URLs
            const SPACE = new Image();
            SPACE.src = "imgs/space.jpg";
            SPACE.onload = () => {
                canvas.width = SPACE.width;
                canvas.height = SPACE.height;
                draw();
            };

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
            const gameInfo = {
                level: 1,
                getLevelTime() {
                    // Your logic to get the level time
                    return 60; // Example time
                }
            };

            const playerCar = {
                x: 100,
                y: 100,
                angle: 0,
                vel: 0,
                image: GREEN_ROCKET,
                draw(ctx) {
                    ctx.save();
                    ctx.translate(this.x, this.y);
                    ctx.rotate(this.angle);
                    ctx.drawImage(this.image, -this.image.width / 2, -this.image.height / 2);
                    ctx.restore();
                }
            };

            const computerCar = {
                x: 200,
                y: 200,
                angle: 0,
                vel: 0,
                image: ORANGE_ROCKET,
                draw(ctx) {
                    ctx.save();
                    ctx.translate(this.x, this.y);
                    ctx.rotate(this.angle);
                    ctx.drawImage(this.image, -this.image.width / 2, -this.image.height / 2);
                    ctx.restore();
                }
            };

            // Define utility functions
            function draw() {
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
