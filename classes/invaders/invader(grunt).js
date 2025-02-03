export class Invader {
  static SCALE_FACTOR = 0.4;
  static PROJECTILE_SPEED = 3;
  static TRACKING_ACCURACY = 0.5; // 0 = straight down, 1 = perfect tracking
  static FIRE_RATE = 2000; // Time in milliseconds between shots
  static HEALTH = 1; // How many hits it takes to kill
  static shootSound = new Audio("../assets/sounds/invadershot(grunt).wav");

  // Initialize audio with try-catch
  static {
    try {
      this.shootSound = new Audio("../../assets/sounds/invadershot(grunt).wav");
    } catch (error) {
      console.warn("Could not load audio files:", error);
      this.shootSound = { play: () => {}, volume: 1, currentTime: 0 };
    }
  }

  constructor(position, canvas) {
    this.position = { x: position.x, y: position.y };
    this.velocity = { x: 0, y: 0 };
    this.canvas = canvas;
    this.image = null;
    this.width = 0;
    this.height = 0;
    this.lastFireTime = 0;
    this.health = Invader.HEALTH;

    this.loadImage();
    this.setupSound();
  }

  setupSound() {
    try {
      Invader.shootSound.volume = 0.1;
    } catch (error) {
      console.warn("Error setting up sound:", error);
    }
  }

  loadImage() {
    const image = new Image();
    image.src = "../assets/pictures/invader(grunt).png";
    image.onload = () => {
      this.image = image;
      this.width = image.width * Invader.SCALE_FACTOR;
      this.height = image.height * Invader.SCALE_FACTOR;
    };
  }

  shoot(player, projectiles) {
    const currentTime = Date.now();
    if (currentTime - this.lastFireTime >= Invader.FIRE_RATE) {
      // Calculate direction towards player
      const angle = Math.atan2(
        player.position.y - this.position.y,
        player.position.x - this.position.x
      );

      // Mix between tracking and straight down based on TRACKING_ACCURACY
      const targetAngle =
        angle * Invader.TRACKING_ACCURACY +
        (Math.PI / 2) * (1 - Invader.TRACKING_ACCURACY);

      const velocity = {
        x: Math.cos(targetAngle) * Invader.PROJECTILE_SPEED,
        y: Math.sin(targetAngle) * Invader.PROJECTILE_SPEED,
      };

      projectiles.push(
        new InvaderProjectile(
          {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height,
          },
          velocity
        )
      );

      this.lastFireTime = currentTime;
      try {
        Invader.shootSound.currentTime = 0;
        Invader.shootSound.play();
      } catch (error) {
        console.warn("Error playing shoot sound:", error);
      }
    }
  }

  hit() {
    this.health--;
  }

  isDead() {
    return this.health <= 0;
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  draw(ctx) {
    if (!this.image) return;

    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}

export class InvaderProjectile {
  constructor(position, velocity) {
    this.position = { x: position.x, y: position.y };
    this.velocity = velocity;
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  }
}
