const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Define image URLs
const SPACE = new Image();
SPACE.src = "imgs/space.jpg";

const TRACK = new Image();
TRACK.src = "imgs/track.png";

const TRACK_BORDER = new Image();
TRACK_BORDER.src = "imgs/track-border.png";

const FINISH = new Image();
FINISH.src = "imgs/finish.png";

const GREEN_ROCKET = new Image();
GREEN_ROCKET.src = "imgs/green-rocket.png";

const ORANGE_ROCKET = new Image();
ORANGE_ROCKET.src = "imgs/orange-rocket.png";

const MAIN_FONT = "44px sans-serif";

// Ensure all images are loaded before starting the game loop
const images = [SPACE, TRACK, TRACK_BORDER, FINISH, GREEN_ROCKET, ORANGE_ROCKET];
let imagesLoaded = 0;

images.forEach(image => {
    image.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === images.length) {
            startGame();
        }
    };
});

function startGame() {
    // Define game logic variables and functions...
    
    // Start the game loop
    draw();
}

// Continue with your utility functions, draw function, and the rest of the code...

