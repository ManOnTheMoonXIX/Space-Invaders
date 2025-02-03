import { PackBehavior } from "./packbehavior.js";

export class FireRatePack extends PackBehavior {
  static BOOST_DURATION = 5000;
  static FIRE_RATE_MULTIPLIER = 2;
  static SIZE_MULTIPLIER = 1.5;
  static powerups = [];
  static spawnSound = new Audio("../assets/sounds/powerupspawn.wav");
  static despawnSound = new Audio("../assets/sounds/powerupdespawn.wav");
  static takenSound = new Audio("../assets/sounds/poweruptaken.mp3");
  static image = new Image();

  static {
    FireRatePack.image.src = "../assets/pictures/fireratepack.png";
  }

  constructor(canvas) {
    super(canvas);
  }

  static spawn(canvas) {
    const powerup = new FireRatePack(canvas);
    this.powerups.push(powerup);
  }

  static updateAll(canvas, player, Projectile) {
    PackBehavior.updateAll(this.powerups, canvas, player, Projectile, this);
  }

  static applyPowerup(Projectile) {
    const originalFireRate = Projectile.FIRE_RATE;

    Projectile.FIRE_RATE = originalFireRate / FireRatePack.FIRE_RATE_MULTIPLIER;

    setTimeout(() => {
      Projectile.FIRE_RATE = originalFireRate;
    }, FireRatePack.BOOST_DURATION);
  }

  draw(ctx) {
    const scaledSize = this.size * FireRatePack.SIZE_MULTIPLIER;
    const xOffset = (scaledSize - this.size) / 2;
    const yOffset = (scaledSize - this.size) / 2;

    ctx.drawImage(
      FireRatePack.image,
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
