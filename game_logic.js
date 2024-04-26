
            // Game Info
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

            // Car class
            class Car {
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

                draw(ctx) {
                    ctx.save();
                    ctx.translate(this.x, this.y);
                    ctx.rotate(this.angle);
                    ctx.drawImage(this.img, -this.img.width / 2, -this.img.height / 2);
                    ctx.restore();
                }

                move_forward() {
                    this.vel = Math.min(this.vel + this.acceleration, this.max_vel);
                    this.move();
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

            // Player Car class
            class PlayerCar extends Car {
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

            // Computer Car class
            class ComputerCar extends Car {
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

                move() {
                    this.calculate_angle();
                    super.move_forward();
                    if (this.vel === 0) {
                        this.vel = 1;
                    }
                    if (Math.abs(this.x - this.path[this.current_point][0]) <= 10 && Math.abs(this.y - this.path[this.current_point][1]) <= 10) {
                        this.current_point += 1;
                    }
                    if (this.current_point >= this.path.length) {
                        this.current_point = 0;
                    }
                }
            }

            // Game loop function
            function draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Draw background space image
                ctx.drawImage(SPACE, 0, 0, canvas.width, canvas.height);
                
                // Scale factors for the track, finish line, and track border
                const scaleTrack = 0.5;
                const scaleFinish = 0.5;
                const scaleBorder = 0.5;

                // Draw scaled track
                ctx.drawImage(TRACK, 0, 0, TRACK.width * scaleTrack, TRACK.height * scaleTrack);

                // Draw scaled finish line
                ctx.drawImage(FINISH, 130 * scaleFinish, 250 * scaleFinish, FINISH.width * scaleFinish, FINISH.height * scaleFinish);
                
                // Draw scaled track border
                ctx.drawImage(TRACK_BORDER, 0, 0, TRACK_BORDER.width * scaleBorder, TRACK_BORDER.height * scaleBorder);

                const level_text = `Level ${game_info.level}`;
                ctx.font = MAIN_FONT;
                ctx.fillStyle = "white";
                blitTextCenter(ctx, MAIN_FONT, level_text, 10, canvas.height - 70);

                const time_text = `Time: ${game_info.get_level_time()}s`;
                blitTextCenter(ctx, MAIN_FONT, time_text, 10, canvas.height - 40);

                const vel_text = `Vel: ${player_car.vel.toFixed(1)}px/s`;
                blitTextCenter(ctx, MAIN_FONT, vel_text, 10, canvas.height - 10);

                // Draw player car with rotation and scaling
                const playerScale = 0.5; // Adjust as needed
                blitRotateCenter(ctx, scaleImage(GREEN_ROCKET, playerScale), [player_car.x, player_car.y], player_car.angle);

                // Draw computer car with rotation and scaling
                const computerScale = 0.5; // Adjust as needed
                blitRotateCenter(ctx, scaleImage(ORANGE_ROCKET, computerScale), [computer_car.x, computer_car.y], computer_car.angle);

                requestAnimationFrame(draw);
            }

            // Start the game loop
            draw();
        
