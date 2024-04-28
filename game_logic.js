  
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

                // Scale and draw the track image
                const trackScale = 0.5; // Adjust as needed
                ctx.drawImage(TRACK, 0, 0, TRACK.width * trackScale, TRACK.height * trackScale);

                // Draw the finish line
                ctx.drawImage(FINISH, 130, 250);

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
                const playerCarScale = 0.5; // Adjust as needed
                ctx.save();
                ctx.translate(playerCar.x, playerCar.y);
                ctx.rotate(playerCar.angle);
                ctx.drawImage(playerCar.image, -playerCar.image.width / 2, -playerCar.image.height / 2, playerCar.image.width * playerCarScale, playerCar.image.height * playerCarScale);
                ctx.restore();

                // Draw computer car with rotation and scaling
                const computerCarScale = 0.5; // Adjust as needed
                ctx.save();
                ctx.translate(computerCar.x, computerCar.y);
                ctx.rotate(computerCar.angle);
                ctx.drawImage(computerCar.image, -computerCar.image.width / 2, -computerCar.image.height / 2, computerCar.image.width * computerCarScale, computerCar.image.height * computerCarScale);
                ctx.restore();

                requestAnimationFrame(draw);
            }

            // Start the game loop
            draw();
        
