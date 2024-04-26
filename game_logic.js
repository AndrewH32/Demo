
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

            // Define game logic variables and functions...
            let TRACK_BORDER_MASK;

            // Load track border image
            TRACK_BORDER.onload = function() {
                const maskCanvas = document.createElement('canvas');
                maskCanvas.width = TRACK_BORDER.width;
                maskCanvas.height = TRACK_BORDER.height;
                const maskCtx = maskCanvas.getContext('2d');
                maskCtx.drawImage(TRACK_BORDER, 0, 0);
                const imageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
                const isOpaque = (x, y) => {
                    const index = (y * maskCanvas.width + x) * 4;
                    return imageData.data[index + 3] > 0; // Check alpha channel
                };
                TRACK_BORDER_MASK = [];
                for (let y = 0; y < maskCanvas.height; y++) {
                    for (let x = 0; x < maskCanvas.width; x++) {
                        TRACK_BORDER_MASK.push(isOpaque(x, y));
                    }
                }
            };

            class GameInfo {
                constructor() {
                    this.LEVELS = 10;
                    this.level = 1;
                    this.started = false;
                    this.level_start_time = 0;
                }

                next_level() {
                    this.level += 1;
                    this.started = false;
                }

                reset() {
                    this.level = 1;
                    this.started = false;
                    this.level_start_time = 0;
                }

                game_finished() {
                    return this.level > this.LEVELS;
                }

                start_level() {
                    this.started = true;
                    this.level_start_time = Date.now();
                }

                get_level_time() {
                    if (!this.started) return 0;
                    return Math.round((Date.now() - this.level_start_time) / 1000);
                }
            }

            class AbstractCar {
                constructor(max_vel, rotation_vel, img, start_pos) {
                    this.img = img;
                    this.max_vel = max_vel;
                    this.vel = 0;
                    this.rotation_vel = rotation_vel;
                    this.angle = 0;
                    this.x = start_pos[0];
                    this.y = start_pos[1];
                    this.acceleration = 0.1;
                }

                rotate(left = false, right = false) {
                    if (left) {
                        this.angle += this.rotation_vel;
                    } else if (right) {
                        this.angle -= this.rotation_vel;
                    }
                }

                draw() {
                    ctx.save();
                    ctx.translate(this.x, this.y);
                    ctx.rotate(this.angle);
                    ctx.drawImage(this.img, -this.img.width / 2, -this.img.height / 2);
                    ctx.restore();
                }

                move() {
                    const angle_rad = this.angle * Math.PI / 180;
                    const dx = this.vel * Math.cos(angle_rad);
                    const dy = this.vel * Math.sin(angle_rad);
                    this.x += dx;
                    this.y += dy;
                }
            }

            class PlayerCar extends AbstractCar {
                constructor(max_vel, rotation_vel, img, start_pos) {
                    super(max_vel, rotation_vel, img, start_pos);
                }

                accelerate() {
                    if (this.vel < this.max_vel) {
                        this.vel += this.acceleration;
                    }
                }

                brake() {
                    if (this.vel > 0) {
                        this.vel -= this.acceleration;
                    }
                }
            }

            class ComputerCar extends AbstractCar {
                constructor(max_vel, rotation_vel, img, start_pos) {
                    super(max_vel, rotation_vel, img, start_pos);
                }
            }

            const game_info = new GameInfo();
            const player_car = new PlayerCar(10, 5, GREEN_ROCKET, [canvas.width / 2, canvas.height / 2]);
            const computer_car = new ComputerCar(8, 4, ORANGE_ROCKET, [canvas.width / 2, canvas.height / 3]);

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
        
