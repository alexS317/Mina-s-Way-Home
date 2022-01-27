import GameObject from "./gameObject.js";

class Player extends GameObject {

    constructor(context, x, y, width, height, CONFIG) {
        super(context, x, y, width, height, CONFIG);
        this.dx = 0;
        this.dy = 0;
        this.currentKeys = {};
        this.xVelocity = 0.5;
        this.yVelocity = 0.2;
        this.gravity = 0.1;
        this.grounded = false;
    }

    init() {
        // set up key events
        document.addEventListener('keydown', (event) => {
            this.currentKeys[event.code] = true;
            if(
                this.currentKeys['ArrowUp'] === true ||
                this.currentKeys['ArrowDown'] === true ||
                this.currentKeys['ArrowRight'] === true ||
                this.currentKeys['ArrowLeft'] === true ||
                this.currentKeys['Space'] === true
            ) {
                event.preventDefault();
            }
        });

        document.addEventListener('keyup', (event) => {
            this.currentKeys[event.code] = false;
        });

        // set up sprites
        this.sprites = {
            idle: {
                src: './Assets/idle-sprite.png',
                frames: 1,
                fps: 12,
                frameSize: {
                    width: 900,
                    height: 900
                }
            },

            run: {
                src: './Assets/run-sprite.png',
                frames: 6,
                fps: 12,
                frameSize: {
                    width: 900,
                    height: 900
                }
            },

            jump: {
                src: './Assets/jump-sprite.png',
                frames: 1,
                fps: 12,
                frameSize: {
                    width: 900,
                    height: 900
                }
            }
        }
        Object.values(this.sprites).forEach(sprite => {
            sprite.image = new Image();
            sprite.image.src = sprite.src;
        });
    }

    update(timePassedSinceLastRender) {
        // Horizontal movements
        if(this.currentKeys['ArrowRight']) {
            this.dx = 1;
        } else if(this.currentKeys['ArrowLeft']) {
            this.dx = -1;
        } else {
            this.dx = 0;
        }
        this.x += timePassedSinceLastRender * this.dx * this.xVelocity;

        // Jump
        const jump = () => {
            if(this.currentKeys['Space']) {
                if(this.grounded) {
                    this.dy = -10;
                    this.grounded = false;
                } else {
                    this.dy += this.gravity;
                }
            } else {
                this.dy += this.gravity;
            }
            this.y += timePassedSinceLastRender * this.dy * this.yVelocity;
        }
        jump();


        // Decide which sprite to use
        if(this.dx === 0 && this.dy === 0) {
            this.state = 'idle';
        } else if(this.dx === 0 && this.dy !== 0) {
            this.state = 'jump';
        } else {
            this.state = 'run';
        }

        // store last direction (whether character is turned left or right)
        if (this.dx !== 0) {
            this.lastDirectionX = this.dx;
        }

        // Check left side boundary so character can't move off the screen
        if(this.x - this.width / 2 < 0) {
            this.x = 0 + this.width / 2 ;
        }
    }

    render() {
        this.context.translate(this.x, this.y);

        // flip image if direction is negative
        this.context.scale(this.lastDirectionX, 1);

        let coords = this.getImageSpriteCoordinates(this.sprites[this.state]);

        this.context.drawImage(
            this.sprites[this.state].image,
            coords.sourceX,
            coords.sourceY,
            coords.sourceWidth,
            coords.sourceHeight,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height);

        this.context.resetTransform();
    }

    getImageSpriteCoordinates(sprite) {
        let frameX = Math.floor(performance.now() / 1000 * sprite.fps % sprite.frames);
        let coords = {
            sourceX: frameX * sprite.frameSize.width,
            sourceY: 0,
            sourceWidth: sprite.frameSize.width,
            sourceHeight: sprite.frameSize.height,
        }
        return coords;
    }

    // Bounding box for collision with collectibles
    getBoundingBox() {
        return {
            x: this.x - this.width / 2 + 10,
            y: this.y - this.height / 2 + 25,
            w: this.width - 15,
            h: this.height - 25,
        }
    }

    // Bounding box for collision with platforms
    getBoundingBoxPlayer() {
        return {
            x: this.x - this.width / 2 + 10,
            y: this.y - this.height / 2 + this.height - 5,
            w: this.width - 15,
            h: this.height -this.height + 5,
        }
    }
}

export default Player;