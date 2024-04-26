 <script>
            // Define all your variables and functions here

            const canvas = document.getElementById("gameCanvas");
            const ctx = canvas.getContext("2d");

            // Define the updated scaleImage function
            function scaleImage(img, factor) {
                if (img.width === 0 || img.height === 0) {
                    console.error("Image dimensions are zero.");
                    return null;
                }
                
                const width = Math.round(img.width * factor);
                const height = Math.round(img.height * factor);
                if (width === 0 || height === 0) {
                    console.error("Scaled image dimensions are zero.");
                    return null;
                }
                
                const scaledCanvas = document.createElement('canvas');
                scaledCanvas.width = width;
                scaledCanvas.height = height;
                const scaledCtx = scaledCanvas.getContext('2d');
                scaledCtx.drawImage(img, 0, 0, width, height);
                return scaledCanvas;
            }

            // Rest of your code goes here...
        </script>
    </section>

    <section id="contact">
        <h2>Contact Me</h2>
        <p>You can reach me at <a href="mailto:poweredbydreams92@gmail.com">poweredbydreams92@gmail.com</a>, <a href="tel:720-290-8971">720-290-8971</a></p>
    </section>

    <footer>
        <p>&copy; 2024 Andrew Hensley</p>
    </footer>
</body>
</html>
You can now fill in the rest of your code within the <script> tag where it says "Rest of your code goes here..." and utilize the scaleImage function as needed. Make sure to handle cases where the image dimensions are zero to avoid errors.



User
add all previous code.
ChatGPT
Here's the entire code including all previous adjustments:

html
Copy code
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sol-Hearts</title>
    <link rel="stylesheet" href="Sol-Hearts-Styles.css"> <!-- Link to custom CSS file for styling -->
    <style>
        /* Define any CSS styles for your canvas here */
        canvas {
            border: 1px solid black;
            display: block;
            margin: 0 auto; /* Center the canvas */
        }
    </style>
</head>
<body>
    
    <header>
        <h1>Sol-Hearts</h1>
        <nav>
            <ul>
                <li><a href="#design">Design Document</a></li>
                <li><a href="#game">Game</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <section id="design">
        <h2>Design Document</h2>
        <iframe src="Sol Hearts.pdf" title="Sol-Hearts" width="800" height="600" frameborder="0"></iframe>
    </section>

    <section id="game">
        <h2>Game</h2>
        <!-- Canvas for the game -->
        <canvas id="gameCanvas" width="800" height="600"></canvas>
        <script>
            // Define all your variables and functions here

            const canvas = document.getElementById("gameCanvas");
            const ctx = canvas.getContext("2d");

            // Define the updated scaleImage function
            function scaleImage(img, factor) {
                if (img.width === 0 || img.height === 0) {
                    console.error("Image dimensions are zero.");
                    return null;
                }
                
                const width = Math.round(img.width * factor);
                const height = Math.round(img.height * factor);
                if (width === 0 || height === 0) {
                    console.error("Scaled image dimensions are zero.");
                    return null;
                }
                
                const scaledCanvas = document.createElement('canvas');
                scaledCanvas.width = width;
                scaledCanvas.height = height;
                const scaledCtx = scaledCanvas.getContext('2d');
                scaledCtx.drawImage(img, 0, 0, width, height);
                return scaledCanvas;
            }

            // Rest of your code goes here...

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

            // Define game logic variables and functions...

            // Define utility functions
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
        </script>
