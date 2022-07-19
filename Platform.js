import GameObject from "./gameObject.js";

class Platform extends GameObject {
    constructor(context, x, y, width, height, CONFIG) {
        super(context, x, y, width, height, CONFIG);
    }

    init() {
        this.image = new Image();
        this.image.src = './Assets/platform.png';
    }

    render() {
        this.context.translate(this.x, this.y);
        this.context.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);

        this.context.strokeStyle = 'black';
        this.context.strokeRect(
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height);

        // this.context.strokeStyle = 'blue';
        // this.context.strokeRect(
        //     -this.width / 2,
        //     -this.height / 2 - 1,
        //     this.width,
        //     this.height - 15
        // );

        this.context.resetTransform();
    }

    // Bounding box for collision with player
    getBoundingBoxPlatform() {
        return {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2 - 1,
            w: this.width,
            h: this.height - 15,
        }
    }
}

export default Platform;