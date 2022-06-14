import Color from "./drawing/color.js";
import Hexagon from "./drawing/shapes/hexagon.js";

class Utils {
  static randomColor() {
    const colors = ['orchid', 'coral', 'orange', 'yellow', 'lime', 'springgreen', 'teal', 'powderblue', 'plum', 'lavender', 'lightSkyBlue'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  static randomGreyscale() {
    const colors = ["darkgoldenrod", "darkolivegreen", "darkslategray", "maroon", "midnightblue", "navy"];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  /** Sets array index to `undefined` if the projectile is outside the screen. */
  static removeOOBProjectiles() {
    for (let i = 0; i < projectiles.length; i++) {
      const arrayItem = projectiles[i];
      if (arrayItem && (
        arrayItem.location.x < 0
        || arrayItem.location.x > windowWidth
        || arrayItem.location.y < 0
        || arrayItem.location.y > windowHeight)) {
        projectiles[i] = undefined;
        console.log(`Removed projectile. Current undefined count: ${projectiles.filter(p => p === undefined).length}`);
      }
    }
  }
  /** Removes `undefined`s from array. */
  static cleanProjectilesArray() {
    for (let i = 0; i < projectiles.length; i++) {
      if (!projectiles[i]) {
        projectiles.shift();
      }
    }
  }
}

class Point2D {
  constructor(
    public x: number,
    public y: number
  ) { }
}

class Vector {
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

class Player {
  constructor(
    public location: Point2D,
    public radius: number,
    public color: string,
    public name: string
  ) { }

  draw() {
    ctx.beginPath();
    ctx.arc(this.location.x, this.location.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    // small dot to indicate center
    ctx.beginPath();
    ctx.arc(windowWidth / 2, windowHeight / 2, 4, 0, Math.PI * 2);
    ctx.fillStyle = "orange";
    ctx.fill();
  }
}

class Projectile {
  constructor(
    public location: Point2D,
    public radius: number,
    public color: string,
    public velocity: Vector
  ) { }

  update() {
    // Cartesian/CSS coordinate translation requires sign change
    // Also, things move too fast, so magnitude multiplier is used to slow down
    this.location.x += this.velocity.x > 0
      ? (Math.cos(this.velocity.theta) * this.velocity.x * this.velocity.slowFactor)
      : (-1 * Math.cos(this.velocity.theta) * this.velocity.x * this.velocity.slowFactor);
    this.location.y += this.velocity.y > 0
      ? (-1 * Math.sin(this.velocity.theta) * this.velocity.y * this.velocity.slowFactor)
      : (Math.sin(this.velocity.theta) * this.velocity.y * this.velocity.slowFactor);
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.location.x, this.location.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class Enemy {
  constructor(
    public location: Point2D,
    public radius: number,
    public color: string,
    public velocity: Vector
  ) { }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.location.x + this.radius, this.location.y);
    // Draw hexagon
    // I hand-calculated the six points, but then saw this... literally the reason loops exist
    const theta = Math.PI / 3;
    for (let i = 0; i < 6; i++) {
      ctx.lineTo(this.location.x + (this.radius * Math.cos(theta * i)), this.location.y + (this.radius * Math.sin(theta * i)));
    }
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    // Cartesian/CSS coordinate translation requires sign change
    // Also, things move too fast, so magnitude multiplier is used to slow down
    this.location.x += this.velocity.x > 0
      ? (Math.cos(this.velocity.theta) * this.velocity.x * this.velocity.slowFactor)
      : (-1 * Math.cos(this.velocity.theta) * this.velocity.x * this.velocity.slowFactor);
    this.location.y += this.velocity.y > 0
      ? (-1 * Math.sin(this.velocity.theta) * this.velocity.y * this.velocity.slowFactor)
      : (Math.sin(this.velocity.theta) * this.velocity.y * this.velocity.slowFactor);
  }
}

function animate() {
  // Erase Canvas
  // clearScreen();
  drawBackground();
  myHexagon.draw(ctx);

  // Draw Player
  player.draw();

  // Draw entities
  enemies.forEach(e => {
    if (e) {
      e.draw();
    }
  });
  projectiles.forEach(p => {
    if (p) {
      p.draw();
    }
  });

  // Update entities
  enemies.forEach(e => {
    if (e) {
      e.update();
    }
  })
  projectiles.forEach(p => {
    if (p) {
      p.update();
    }
  });

  // Remove out-of-bounds projectiles
  Utils.removeOOBProjectiles();

  // Clean array
  if (clickCount > 50) {
    clickCount = 0;
    Utils.cleanProjectilesArray();
  }

  window.requestAnimationFrame(animate);
}
function clearScreen() {
  ctx.fillStyle = 'grey';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function drawBackground() {
  ctx.fillStyle = backgroundColor.rgb;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  backgroundColor.shift();
}
function onClick(event: MouseEvent) {
  // I keep things in Cartesian coordinates (not CSS coordinates), so +y is up!

  // Add a new projectile to the array, and draw it immediately
  const velocity = new Vector(event.clientX - (windowWidth / 2), (windowHeight / 2) - event.clientY);
  const point = new Point2D(event.clientX, event.clientY);
  projectiles.push(new Projectile(point, 10, Utils.randomColor(), velocity));

  // console.log(velocity);
  clickCount++;
}
function spawnEnemies() {
  setInterval(() => {
    const point = new Point2D(0, 0);
    const radius = (Math.random() * 30) + 10;
    const color = Utils.randomGreyscale();
    const velocity = new Vector(0, 0);

    if (Math.random() < 0.25) {
      point.x = 100, point.y = 100,
        velocity.x = 1, velocity.y = -1;
    } else if (Math.random() < 0.50) {
      point.x = (windowWidth - 100), point.y = 100,
        velocity.x = -1, velocity.y = -1;
    } else if (Math.random() < 0.75) {
      point.x = (windowWidth - 100), point.y = (windowHeight - 100),
        velocity.x = -1, velocity.y = 1;
    } else {
      point.x = 100, point.y = (windowHeight - 100),
        velocity.x = 1, velocity.y = 1;
    }
    enemies.push(new Enemy(point, radius, color, velocity));
  }, 2500);
}



/**
 * Program start
 */
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
canvas.width = windowWidth;
canvas.height = windowHeight;

const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const backgroundColor = new Color(255,0,0);
const projectiles: (Projectile | undefined)[] = new Array();
const enemies: Enemy[] = new Array();
let clickCount = 0;

window.addEventListener('click', onClick);

const player = new Player(new Point2D(windowWidth / 2, windowHeight / 2), 50, 'rebeccapurple', 'Player1');
player.draw();

const myHexagon = new Hexagon(new Point2D(250,250), 30, new Color(0,0,0));

animate();
spawnEnemies();