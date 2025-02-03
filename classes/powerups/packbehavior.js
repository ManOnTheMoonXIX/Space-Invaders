export class PackBehavior {
  static MIN_SPEED = 1;
  static MAX_SPEED = 3;
  static SIZE = 20;
  static LIFETIME = 5000;
  static SPAWN_CHANCE = 0.001; // 0.1% chance per frame
  static powerups = [];
  static spawnSound = new Audio("../assets/sounds/powerupspawn.wav");
  static despawnSound = new Audio("../assets/sounds/powerupdespawn.wav");
  static takenSound = new Audio("../assets/sounds/poweruptaken.mp3");

  constructor(canvas) {
    this.canvas = canvas;
    this.position = {
      x: Math.random() * (canvas.width - PackBehavior.SIZE),
      y: -PackBehavior.SIZE,
    };

    const speed =
      PackBehavior.MIN_SPEED +
      Math.random() * (PackBehavior.MAX_SPEED - PackBehavior.MIN_SPEED);
    const angle = ((Math.random() * 120 - 60) * Math.PI) / 180;

    this.velocity = {
      x: Math.sin(angle) * speed,
      y: Math.abs(Math.cos(angle) * speed),
    };

    this.size = PackBehavior.SIZE;
    this.spawnTime = Date.now();

    PackBehavior.spawnSound.volume = 0.1;
    PackBehavior.despawnSound.volume = 0.1;
    PackBehavior.takenSound.volume = 0.1;

    PackBehavior.spawnSound.currentTime = 0;
    PackBehavior.spawnSound.play();
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (
      this.position.x <= 0 ||
      this.position.x + this.size >= this.canvas.width
    ) {
      this.velocity.x = -this.velocity.x;
      this.position.x = Math.max(
        0,
        Math.min(this.canvas.width - this.size, this.position.x)
      );
    }
  }

  static checkCollision(powerup, player) {
    return (
      powerup.position.x < player.position.x + player.width &&
      powerup.position.x + powerup.size > player.position.x &&
      powerup.position.y < player.position.y + player.height &&
      powerup.position.y + powerup.size > player.position.y
    );
  }

  static checkCollisionWithProjectile(powerup, projectile) {
    return (
      powerup.position.x < projectile.position.x + 5 &&
      powerup.position.x + powerup.size > projectile.position.x - 5 &&
      powerup.position.y < projectile.position.y + 5 &&
      powerup.position.y + powerup.size > projectile.position.y - 5
    );
  }

  static updateAll(powerups, canvas, player, Projectile, PackClass) {
    if (Math.random() < this.SPAWN_CHANCE) {
      PackClass.spawn(canvas);
    }

    const currentTime = Date.now();

    for (let i = powerups.length - 1; i >= 0; i--) {
      const powerup = powerups[i];
      powerup.update();

      if (currentTime - powerup.spawnTime >= PackBehavior.LIFETIME) {
        this.removePowerup(powerups, i, "despawn");
        continue;
      }

      if (this.checkCollision(powerup, player)) {
        PackClass.applyPowerup(Projectile);
        this.removePowerup(powerups, i, "taken");
        continue;
      }

      for (let j = Projectile.projectiles.length - 1; j >= 0; j--) {
        const projectile = Projectile.projectiles[j];
        if (this.checkCollisionWithProjectile(powerup, projectile)) {
          PackClass.applyPowerup(Projectile);
          this.removePowerup(powerups, i, "taken");
          Projectile.projectiles.splice(j, 1);
          break;
        }
      }

      if (powerup.position.y > canvas.height) {
        this.removePowerup(powerups, i, "despawn");
      }
    }
  }

  static removePowerup(powerups, index, reason) {
    if (reason === "taken") {
      this.takenSound.currentTime = 0;
      this.takenSound.play();
    } else {
      this.despawnSound.currentTime = 0;
      this.despawnSound.play();
    }
    powerups.splice(index, 1);
  }

  static drawAll(ctx) {
    this.powerups.forEach((powerup) => powerup.draw(ctx));
  }
}
