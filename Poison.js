import Collectible from "./Collectible.js";

class Poison extends Collectible {
    constructor(context, x, y, width, height, CONFIG) {
        super(context, x, y, width, height, CONFIG);
    }

    init() {
        this.image = new Image();
        this.image.src = './Assets/poison.png';
    }
}

export default Poison;