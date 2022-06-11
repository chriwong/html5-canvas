class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.m = Math.sqrt(x ** 2 + y ** 2);
    this.theta = Math.atan2(y, x);
    this.slowFactor = this.m > 15
      ? (15 / this.m)
      : 1;
  }
}

class Player {
  constructor(x, y, radius, color, name) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.name = name;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  update() {
    // Cartesian/CSS coordinate translation requires sign change
    // Also, things move too fast, so magnitude multiplier is used to slow down
    this.x += this.velocity.x > 0
      ? (Math.cos(this.velocity.theta) * this.velocity.x * this.velocity.slowFactor)
      : (-1 * Math.cos(this.velocity.theta) * this.velocity.x * this.velocity.slowFactor);
    this.y += this.velocity.y > 0
      ? (-1 * Math.sin(this.velocity.theta) * this.velocity.y * this.velocity.slowFactor)
      : (Math.sin(this.velocity.theta) * this.velocity.y * this.velocity.slowFactor);
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y + this.radius, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function randomColor() {
  const colors = ['red', 'coral', 'orange', 'yellow', 'lime', 'green', 'teal', 'blue', 'indigo', 'violet'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function animate() {
  // Erase Canvas
  ctx.fillStyle = 'grey';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw Player
  player.draw();

  // Draw entities
  projectiles.forEach(p => {
    if (p) {
      p.draw();
    }
  });

  // Update entities
  projectiles.forEach(p => {
    if (p) {
      p.update();
    }
  });

  // Remove out-of-bounds projectiles
  removeOOBProjectiles();

  // Clean array
  if (clickCount > 50) {
    clickCount = 0;
    cleanProjectilesArray();
  }

  window.requestAnimationFrame(animate);
}

function onClick(event) {
  // I keep things in Cartesian coordinates (not CSS coordinates), so +y is up!
  
  // Add a new projectile to the array, and draw it immediately
  const velocity = new Vector(event.clientX-(windowWidth/2), (windowHeight/2)-event.clientY);
  projectiles.push(new Projectile(event.clientX, event.clientY, 10, randomColor(), velocity));
  projectiles[projectiles.length - 1].draw();

  console.log(velocity);
  clickCount++;
}

/** Sets array index to `undefined` if the projectile is outside the screen. */
function removeOOBProjectiles() {
  for (let i = 0; i < projectiles.length; i++) {
    if (projectiles[i] && (
      projectiles[i].x < 0
      || projectiles[i].x > windowWidth
      || projectiles[i].y < 0
      || projectiles[i].y > windowHeight)) {
      projectiles[i] = undefined;
      console.log(`Removed projectile. Current undefined count: ${projectiles.filter(p=>p===undefined).length}`);
    }
  }
}

/** Removes `undefined`s from array. */
function cleanProjectilesArray() {
  for (let i=0; i<projectiles.length; i++) {
    if (!projectiles[i]) {
      projectiles.shift();
    }
  }
}


/**
 * Program start
 */
const canvas = document.getElementById("game-canvas");
const windowWidth = window.innerWidth-5;
const windowHeight = window.innerHeight-5;
canvas.width = windowWidth;
canvas.height = windowHeight;

const ctx = canvas.getContext('2d');
const projectiles = new Array();
let clickCount = 0;

window.addEventListener('click', onClick);

const player = new Player(windowWidth / 2, windowHeight / 2, 50, 'rebeccapurple', 'Christian');
player.draw();

animate();