import Point2D from "../geometry/point2d";
import Color from "../color";

export default class Circle {
  public isGrowing: boolean = true;

  constructor(
    public center: Point2D,
    public radius: number,
    public color: Color
  ) { }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color.rgb;
    ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI*2);
    this.color.shift();
    this.growThenShrink();
  }

  growThenShrink() {
    if (this.isGrowing) {
      this.radius++;
      if (this.radius >= 50) {
        this.isGrowing = false;
      }
    } else {
      this.radius--;
      if (this.radius <= 0) {
        this.radius = 0;
        this.isGrowing = true;
      }
    }
  }
}