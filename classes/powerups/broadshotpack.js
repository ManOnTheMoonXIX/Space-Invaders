import { PackBehavior } from "./packbehavior.js";

export class BroadshotPack extends PackBehavior {
  static BOOST_DURATION = 5000; // 5 seconds in milliseconds
  static SPREAD_ANGLE = 6; // Angle between projectiles in degrees
  static PERMANENT_BOOST = false; // No permanent effect
  static SIZE_MULTIPLIER = 1.5; // Adjust this value to scale the pack size
  static powerups = [];
  static spawnSound = new Audio("../assets/sounds/powerupspawn.wav");
  static despawnSound = new Audio("../assets/sounds/powerupdespawn.wav");
  static takenSound = new Audio("../assets/sounds/poweruptaken.mp3");
  static image = new Image();
  static {
    BroadshotPack.image.src = "./assets/pictures/broadshotpack.png";
  }

  constructor(canvas) {
    super(canvas);

    // Set audio volumes to 10%
    BroadshotPack.spawnSound.volume = 0.1;
    BroadshotPack.despawnSound.volume = 0.1;
    BroadshotPack.takenSound.volume = 0.1;
  }

  static spawn(canvas) {
    const powerup = new BroadshotPack(canvas);
    this.powerups.push(powerup);
  }

  static updateAll(canvas, player, Projectile) {
    PackBehavior.updateAll(this.powerups, canvas, player, Projectile, this);
  }

  static applyPowerup(Projectile) {
    // Clear any existing timeout
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }

    // Store original fire method if we haven't already
    if (!this.originalFire) {
      this.originalFire = Projectile.fire;
    }

    // Replace fire method with broadshot version
    Projectile.fire = (player) => {
      const currentTime = Date.now();
      if (currentTime - Projectile.lastFireTime >= Projectile.FIRE_RATE) {
        // Center projectile
        const centerProjectile = new Projectile(
          { x: player.position.x + player.width / 2, y: player.position.y },
          { x: 0, y: -Projectile.SPEED }
        );

        // Left projectile
        const leftProjectile = new Projectile(
          { x: player.position.x + player.width / 2, y: player.position.y },
          {
            x:
              -Projectile.SPEED *
              Math.sin((BroadshotPack.SPREAD_ANGLE * Math.PI) / 180),
            y:
              -Projectile.SPEED *
              Math.cos((BroadshotPack.SPREAD_ANGLE * Math.PI) / 180),
          }
        );

        // Right projectile
        const rightProjectile = new Projectile(
          { x: player.position.x + player.width / 2, y: player.position.y },
          {
            x:
              Projectile.SPEED *
              Math.sin((BroadshotPack.SPREAD_ANGLE * Math.PI) / 180),
            y:
              -Projectile.SPEED *
              Math.cos((BroadshotPack.SPREAD_ANGLE * Math.PI) / 180),
          }
        );

        Projectile.projectiles.push(
          centerProjectile,
          leftProjectile,
          rightProjectile
        );
        Projectile.lastFireTime = currentTime;

        // Play the sound effect once for the spread
        Projectile.sound.currentTime = 0;
        Projectile.sound.play();
      }
    };

    // Store the timeout ID so we can clear it if needed
    this.resetTimeout = setTimeout(() => {
      Projectile.fire = this.originalFire;
      this.originalFire = null;
      this.resetTimeout = null;
    }, BroadshotPack.BOOST_DURATION);
  }

  draw(ctx) {
    const scaledSize = this.size * BroadshotPack.SIZE_MULTIPLIER;
    const xOffset = (scaledSize - this.size) / 2;
    const yOffset = (scaledSize - this.size) / 2;

    ctx.drawImage(
      BroadshotPack.image,
      this.position.x - xOffset,
      this.position.y - yOffset,
      scaledSize,
      scaledSize
    );
  }

  static drawAll(ctx) {
    this.powerups.forEach((powerup) => powerup.draw(ctx));
  }
}
