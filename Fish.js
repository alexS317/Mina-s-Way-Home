import Collectible from "./Collectible.js";

class Fish extends Collectible {
    constructor(context, x, y, width, height, CONFIG) {
        super(context, x, y, width, height, CONFIG)
    }

    init() {
        this.image = new Image;
        this.image.src = './Assets/fish.png'
    }
}

export default Fish;