export default class Hexagon {
    constructor(center, radius, color) {
        this.center = center;
        this.radius = radius;
        this.color = color;
        this.isGrowing = true;
    }
    /** Draws an untilted hexagon, like a space animal shine (i.e. points at theta = 0, 60, 120, etc.) */
    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo((this.center.x + this.radius), this.center.y);
        // I hand-calculated the six points, but then saw this... literally the reason loops exist
        const theta = Math.PI / 3;
        for (let i = 0; i < 6; i++) {
            ctx.lineTo(this.center.x + (this.radius * Math.cos(theta * i)), this.center.y + (this.radius * Math.sin(theta * i)));
        }
        ctx.fillStyle = this.color.rgb;
        ctx.fill();
        this.color.shift();
        this.growThenShrink();
    }
    growThenShrink() {
        if (this.isGrowing) {
            this.radius++;
            if (this.radius >= 50) {
                this.isGrowing = false;
            }
        }
        else {
            this.radius--;
            if (this.radius <= 0) {
                this.radius = 0;
                this.isGrowing = true;
            }
        }
    }
}
