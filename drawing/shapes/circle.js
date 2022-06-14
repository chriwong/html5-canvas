export default class Circle {
    constructor(center, radius, color) {
        this.center = center;
        this.radius = radius;
        this.color = color;
        this.isGrowing = true;
    }
    draw(ctx) {
        ctx.fillStyle = this.color.rgb;
        ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
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
