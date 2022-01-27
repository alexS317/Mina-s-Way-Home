import GameObject from "./gameObject.js";

class Points extends GameObject {

    constructor(context, x, y) {
        super(context, x, y);
        this.points = 0;
    }

    render() {
        this.context.font = 'bold 50px sans-serif';
        this.context.textAlign = 'center';
        this.context.fillStyle = 'white';
        this.context.fillText(this.points, this.x, this.y);
        this.context.strokeText(this.points, this.x, this.y);
    }
    
    increase() {
        this.points += 0.5;
        return this.points;
    }
}

export default Points;