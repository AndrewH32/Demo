  <script>
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

            const MAIN_FONT = "15px sans-serif";

            // Game logic variables
            const gameInfo = {
                level: 1,
                getLevelTime() {
                    // Your logic to get the level time
                    return 60; // Example time
                }
            };

            
            const FPS = 60; // Frames per second
            const frameDelay = 1000 / FPS; // Delay between frames in milliseconds
            let lastFrameTime = 0;

            const playerCar = {
                x: 245,
                y: 200,
                angle: 0,
                vel: 100,
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
                x: 225,
                y: 200,
                angle: 0,
                vel: 80,
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

                // Scale and draw the track image
                const trackScale = 0.45; // Adjust as needed
                const trackX = (canvas.width - TRACK.width * trackScale) / 2; // Calculate X position to center horizontally
                const trackY = (canvas.height - TRACK.height * trackScale) / 2; // Calculate Y position to center vertically
                ctx.drawImage(TRACK, trackX, trackY, TRACK.width * trackScale, TRACK.height * trackScale);

                // Scale and draw the finish line
                const finishScale = trackScale; // Scale finish line to match track
                ctx.drawImage(FINISH, (130 * finishScale) + trackX, (260 * finishScale) + trackY, FINISH.width * finishScale, FINISH.height * finishScale);

                // Draw level text
                const levelText = `Level ${gameInfo.level}`;
                ctx.font = MAIN_FONT;
                ctx.fillStyle = "white";
                ctx.textAlign = 'center';
                ctx.fillText(levelText, 10, canvas.height - 70);

                // Draw time text
                const timeText = `Time: ${gameInfo.getLevelTime()}s`;
                ctx.fillText(timeText, 10, canvas.height - 40);

                // Draw velocity text
                const velText = `Vel: ${playerCar.vel.toFixed(1)}px/s`;
                ctx.fillText(velText, 10, canvas.height - 10);

                // Draw player car with rotation and scaling
                const playerCarScale = 0.15; // Adjust as needed
                ctx.save();
                ctx.translate(playerCar.x, playerCar.y);
                ctx.rotate(playerCar.angle);
                ctx.drawImage(playerCar.image, -playerCar.image.width / 2, -playerCar.image.height / 2, playerCar.image.width * playerCarScale, playerCar.image.height * playerCarScale);
                ctx.restore();

                // Draw computer car with rotation and scaling
                const computerCarScale = 0.15; // Adjust as needed
                ctx.save();
                ctx.translate(computerCar.x, computerCar.y);
                ctx.rotate(computerCar.angle);
                ctx.drawImage(computerCar.image, -computerCar.image.width / 2, -computerCar.image.height / 2, computerCar.image.width * computerCarScale, computerCar.image.height * computerCarScale);
                ctx.restore();

                requestAnimationFrame(draw);
            }

            // Start the game loop
            draw();
