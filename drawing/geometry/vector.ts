export default class Vector {
  constructor(
    public x: number,
    public y: number
  ) { }

  public get m(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  public get theta(): number {
    return Math.atan2(this.y, this.x);
  }
  
  public get slowFactor(): number {
    return this.m > 15
      ? (15 / this.m)
      : 1;
  }
}