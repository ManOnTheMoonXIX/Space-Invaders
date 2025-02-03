export class Projectile {
  static FIRE_RATE = 250; // Time in milliseconds between shots
  static SPEED = 10;
  static lastFireTime = 0;
  static projectiles = [];
  static sound = new Audio("../assets/sounds/blaster.wav");

  constructor(position, velocity) {
    this.position = {
      x: position.x,
      y: position.y,
    };
    this.velocity = velocity;
    Projectile.sound.volume = 0.1; // Set volume to 10% of maximum
  }

  static fire(player) {
    const currentTime = Date.now();
    if (currentTime - this.lastFireTime >= this.FIRE_RATE) {
      const projectile = new Projectile(
        { x: player.position.x + player.width / 2, y: player.position.y },
        { x: 0, y: -this.SPEED }
      );
      this.projectiles.push(projectile);
      this.lastFireTime = currentTime;

      // Play the sound effect
      this.sound.currentTime = 0; // Reset the sound to start
      this.sound.play();
    }
  }

  static updateAll(canvas) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.update();
      // Remove projectiles that are off screen
      if (
        p.position.x < 0 ||
        p.position.x > canvas.width ||
        p.position.y < 0 ||
        p.position.y > canvas.height
      ) {
        this.projectiles.splice(i, 1);
      }
    }
  }

  static drawAll(ctx) {
    this.projectiles.forEach((p) => p.draw(ctx));
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
