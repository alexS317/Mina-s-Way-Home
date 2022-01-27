import GameObject from "./gameObject.js";

class Collectible extends GameObject {
    constructor(context, x, y, width, height, CONFIG) {
        super(context, x, y, width, height, CONFIG)
    }

    render() {
        this.context.translate(this.x, this.y);
        this.context.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        this.context.resetTransform();
    }
}

export default Collectible;