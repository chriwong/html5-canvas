export default class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    get m() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    get theta() {
        return Math.atan2(this.y, this.x);
    }
    get slowFactor() {
        return this.m > 15
            ? (15 / this.m)
            : 1;
    }
}
