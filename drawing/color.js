export default class Color {
    constructor(r, g, b, a = 255) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        this.r = Math.floor(r);
        this.g = Math.floor(g);
        this.b = Math.floor(b);
        this.a = Math.floor(a);
    }
    get rgb() {
        return `rgb(${this.r},${this.g},${this.b},${this.a})`;
    }
    get rgba() {
        return this.rgb;
    }
    get rgbaHex() {
        return `#${this.r.toString(16)}${this.g.toString(16)}${this.b.toString(16)}${this.a.toString(16)}`;
    }
    shift() {
        // Get into the loop by shifting to red
        if (this.r < 255 && this.g < 255 && this.b < 255) {
            this.r++;
        }
        // Red -> Yellow
        else if (this.r === 255 && this.g < 255 && this.b === 0) {
            this.g++;
        }
        // Yellow -> Green
        else if (this.r <= 255 && this.r > 0 && this.g === 255 && this.b === 0) {
            this.r--;
        }
        // Green -> Cyan
        else if (this.r === 0 && this.g === 255 && this.b < 255) {
            this.b++;
        }
        // Cyan -> Blue
        else if (this.r === 0 && this.g <= 255 && this.g > 0 && this.b === 255) {
            this.g--;
        }
        // Blue -> Magenta
        else if (this.r <= 255 && this.g === 0 && this.b === 255) {
            this.r++;
        }
        // Magenta -> Red
        else if (this.r === 255 && this.g === 0 && this.b <= 255 && this.b > 0) {
            this.b--;
        }
    }
}
