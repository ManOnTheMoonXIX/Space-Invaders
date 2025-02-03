export class Particle {
  static GRAVITY = 0.1;
  static FRICTION = 0.99;
  static LIFETIME = 60; // frames the particle lives for
  static particles = [];

  constructor(position, color) {
    this.position = { x: position.x, y: position.y };
    this.velocity = {
      x: (Math.random() - 0.5) * 4, // Random spread
      y: (Math.random() - 0.5) * 4,
    };
    this.radius = Math.random() * 2 + 1;
    this.color = color;
    this.opacity = 1;
    this.lifetime = Particle.LIFETIME;
  }

  update() {
    this.velocity.x *= Particle.FRICTION;
    this.velocity.y *= Particle.FRICTION;
    this.velocity.y += Particle.GRAVITY;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.opacity = this.lifetime / Particle.LIFETIME;
    this.lifetime--;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }

  static createExplosion(position, count, color) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(position, color));
    }
  }

  static updateAll() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.update();

      if (particle.lifetime <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  static drawAll(ctx) {
    this.particles.forEach((particle) => particle.draw(ctx));
  }
}
