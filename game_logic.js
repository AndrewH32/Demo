     const canvas = document.getElementById("gameCanvas");
            const ctx = canvas.getContext("2d");

            // Define image URLs
            const SPACE = new Image();
            SPACE.onload = function() {
                console.log("Space image loaded successfully.");
            };
            SPACE.onerror = function() {
                console.error("Error loading space image.");
            };
            SPACE.src = "imgs/space.jpg";

            const TRACK = new Image();
            TRACK.onload = function() {
                console.log("Track image loaded successfully.");
            };
            TRACK.onerror = function() {
                console.error("Error loading track image.");
            };
            TRACK.src = "imgs/track.png";

            const TRACK_BORDER = new Image();
            TRACK_BORDER.onload = function() {
                console.log("Track border image loaded successfully.");
            };
            TRACK_BORDER.onerror = function() {
                console.error("Error loading track border image.");
            };
            TRACK_BORDER.src = "imgs/track-border.png";

            const FINISH = new Image();
            FINISH.onload = function() {
                console.log("Finish image loaded successfully.");
            };
            FINISH.onerror = function() {
                console.error("Error loading finish image.");
            };
            FINISH.src = "imgs/finish.png";

            const GREEN_ROCKET = new Image();
            GREEN_ROCKET.onload = function() {
                console.log("Green rocket image loaded successfully.");
            };
            GREEN_ROCKET.onerror = function() {
                console.error("Error loading green rocket image.");
            };
            GREEN_ROCKET.src = "imgs/green-rocket.png";

            const ORANGE_ROCKET = new Image();
            ORANGE_ROCKET.onload = function() {
                console.log("Orange rocket image loaded successfully.");
            };
            ORANGE_ROCKET.onerror = function() {
                console.error("Error loading orange rocket image.");
            };
            ORANGE_ROCKET.src = "imgs/orange-rocket.png";

            const MAIN_FONT = "44px sans-serif";

            // Define game logic variables and functions...

            // Define utility functions
            function scaleImage(img, factor) {
                const width = Math.round(img.width * factor);
                const height = Math.round(img.height * factor);
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                return canvas;
            }

            function blitRotateCenter(ctx, image, topLeft, angle) {
                ctx.save();
                ctx.translate(topLeft[0] + image.width / 2, topLeft[1] + image.height / 2);
                ctx.rotate(angle * Math.PI / 180);
                ctx.drawImage(image, -image.width / 2, -image.height / 2);
                ctx.restore();
            }

            function blitTextCenter(ctx, font, text, x, y) {
                ctx.font = font;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = 'rgb(200, 200, 200)';
                ctx.fillText(text, x, y);
            }

            // Game loop function
            function draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(SPACE, 0, 0);
                ctx.drawImage(TRACK, 0, 0);
                ctx.drawImage(FINISH, 130, 250);
                ctx.drawImage(TRACK_BORDER, 0, 0);

                const level_text = `Level ${game_info.level}`;
                ctx.font = MAIN_FONT;
                ctx.fillStyle = "white";
                blitTextCenter(ctx, MAIN_FONT, level_text, 10, canvas.height - 70);

                const time_text = `Time: ${game_info.get_level_time()}s`;
                blitTextCenter(ctx, MAIN_FONT, time_text, 10, canvas.height - 40);

                const vel_text = `Vel: ${player_car.vel.toFixed(1)}px/s`;
                blitTextCenter(ctx, MAIN_FONT, vel_text, 10, canvas.height - 10);

                // Draw player car with rotation
                blitRotateCenter(ctx, scaleImage(GREEN_ROCKET, 0.5), [player_car.x, player_car.y], player_car.angle);

                // Draw computer car with rotation
                blitRotateCenter(ctx, scaleImage(ORANGE_ROCKET, 0.5), [computer_car.x, computer_car.y], computer_car.angle);

                requestAnimationFrame(draw);
            }

            // Start the game loop
            draw();
