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

            const PATH = [
              [175, 119], [110, 70], [56, 133], [70, 481], [318, 731], [404, 680], 
              [418, 521], [507, 475], [600, 551], [613, 715], [736, 713], [734, 399], 
              [611, 357], [409, 343], [433, 257], [697, 258], [738, 123], [581, 71], 
              [303, 78], [275, 377], [176, 388], [178, 260]
            ];

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

                move_forward() {
                    this.calculate_angle();
                    this.x += Math.sin(this.angle * (Math.PI / 180)) * this.vel;
                    this.y -= Math.cos(this.angle * (Math.PI / 180)) * this.vel;
                    this.update_path_point();
                }

                move_backward() {
                    this.vel = Math.max(this.vel - this.acceleration, -this.max_vel / 2);
                    this.move();
                }

                move() {
                    const radians = this.angle * (Math.PI / 180);
                    const vertical = Math.cos(radians) * this.vel;
                    const horizontal = Math.sin(radians) * this.vel;
                    this.y -= vertical;
                    this.x -= horizontal;
                }

                collide(mask, x = 0, y = 0) {
                    const car_mask = new ImageData(this.img.width, this.img.height);
                    ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height);
                    const car_pixels = ctx.getImageData(0, 0, this.img.width, this.img.height);
                    car_mask.data.set(car_pixels.data);
                    const poi = overlapMask(car_mask, mask, this.x - x, this.y - y);
                    return poi;
                }

                reset() {
                    this.x = this.START_POS[0];
                    this.y = this.START_POS[1];
                    this.angle = 0;
                    this.vel = 0;
                }
            }

            class PlayerCar extends AbstractCar {
                constructor() {
                    super(4, 4, GREEN_ROCKET, [180, 200]);
                }

                reduce_speed() {
                    this.vel = Math.max(this.vel - this.acceleration / 2, 0);
                    this.move();
                }

                bounce() {
                    this.vel = -this.vel;
                    this.move();
                }
            }

            class ComputerCar extends AbstractCar {
                constructor() {
                    super(1, 4, ORANGE_ROCKET, [150, 200]);
                    this.path = PATH;
                    this.current_point = 0;
                    this.vel = 1;
                }

                calculate_angle() {
                    const [target_x, target_y] = this.path[this.current_point];
                    const x_diff = target_x - this.x;
                    const y_diff = target_y - this.y;
                    let desired_radian_angle;
                    if (y_diff === 0) {
                        desired_radian_angle = Math.PI / 2;
                    } else {
                        desired_radian_angle = Math.atan(x_diff / y_diff);
                    }
                    if (target_y > this.y) {
                        desired_radian_angle += Math.PI;
                    }
                    const difference_in_angle = this.angle - (desired_radian_angle * 180) / Math.PI;
                    if (difference_in_angle >= 180) {
                        difference_in_angle -= 360;
                    }
                    if (difference_in_angle > 0) {
                        this.angle -= Math.min(this.rotation_vel, Math.abs(difference_in_angle));
                    } else {
                        this.angle += Math.min(this.rotation_vel, Math.abs(difference_in_angle));
                    }
                }

                update_path_point() {
                    const target = this.path[this.current_point];
                    const rect = {
                        left: this.x,
                        top: this.y,
                        right: this.x + this.img.width,
                        bottom: this.y + this.img.height
                    };
                    if (rect.left <= target[0] && target[0] <= rect.right &&
                        rect.top <= target[1] && target[1] <= rect.bottom) {
                        this.current_point += 1;
                    }
                }

                move() {
                    if (this.current_point >= this.path.length) return;
                    this.calculate_angle();
                    this.update_path_point();
                    super.move();
                }

                next_level(level) {
                    this.reset();
                    this.vel = this.max_vel + (level - 1) * 0.2;
                    this.current_point = 0;
                }
            }

            function overlapMask(mask1, mask2, offsetX, offsetY) {
                const xStart = Math.max(0, offsetX);
                const xEnd = Math.min(mask1.width, mask2.width + offsetX);
                const yStart = Math.max(0, offsetY);
                const yEnd = Math.min(mask1.height, mask2.height + offsetY);

                for (let x = xStart; x < xEnd; x++) {
                    for (let y = yStart; y < yEnd; y++) {
                        if (mask1.data[(y * mask1.width + x) * 4 + 3] !== 0 && 
                            mask2.data[((y - offsetY) * mask2.width + (x - offsetX)) * 4 + 3] !== 0) {
                            return [x - xStart, y - yStart];
                        }
                    }
                }
                return null;
            }

            const player_car = new PlayerCar();
            const computer_car = new ComputerCar();
            const game_info = new GameInfo();

            function draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(SPACE, 0, 0);
                ctx.drawImage(TRACK, 0, 0);
                ctx.drawImage(FINISH, 130, 250);
                ctx.drawImage(TRACK_BORDER, 0, 0);

                const level_text = `Level ${game_info.level}`;
                ctx.font = MAIN_FONT;
                ctx.fillStyle = "white";
                ctx.fillText(level_text, 10, canvas.height - 70);

                const time_text = `Time: ${game_info.get_level_time()}s`;
                ctx.fillText(time_text, 10, canvas.height - 40);

                const vel_text = `Vel: ${player_car.vel.toFixed(1)}px/s`;
                ctx.fillText(vel_text, 10, canvas.height - 10);

                player_car.draw();
                computer_car.draw();

                requestAnimationFrame(draw);
            }

            function move_player() {
                const keys = {};
                document.addEventListener("keydown", (event) => {
                    keys[event.key] = true;
                });
                document.addEventListener("keyup", (event) => {
                    keys[event.key] = false;
                });

                const moved = false;
                if (keys["k"]) {
                    player_car.rotate(left = true);
                }
                if (keys["l"]) {
                    player_car.rotate(right = true);
                }
                if (keys["w"]) {
                    player_car.move_forward();
                }
                if (keys["s"]) {
                    player_car.move_backward();
                }

                if (!moved) {
                    player_car.reduce_speed();
                }
            }

            function handle_collision() {
                if (player_car.collide(TRACK_BORDER_MASK) !== null) {
                    player_car.bounce();
                }

                const computer_finish_poi_collide = computer_car.collide(FINISH_MASK, 130, 250);
                if (computer_finish_poi_collide !== null) {
                    alert("You lost!");
                    game_info.reset();
                    player_car.reset();
                    computer_car.reset();
                }

                const player_finish_poi_collide = player_car.collide(FINISH_MASK, 130, 250);
                if (player_finish_poi_collide !== null) {
                    if (player_finish_poi_collide[1] === 0) {
                        player_car.bounce();
                    } else {
                        game_info.next_level();
                        player_car.reset();
                        computer_car.next_level(game_info.level);
                    }
                }
            }

            function gameLoop() {
                draw();
                move_player();
                computer_car.move();
                handle_collision();

                if (game_info.game_finished()) {
                    alert("You won the game!");
                    game_info.reset();
                    player_car.reset();
                    computer_car.reset();
                } else {
                    requestAnimationFrame(gameLoop);
                }
            }

            gameLoop();
