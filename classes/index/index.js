import { Player } from "../player/player.js";
import { Projectile } from "../player/projectile.js";
import { FireRatePack } from "../powerups/fireratepack.js";
import { BroadshotPack } from "../powerups/broadshotpack.js";
import { Grid } from "../invaders/grid.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// Track keyboard state
const keys = {
  space: false,
};

// Set initial canvas size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const player = new Player(canvas, ctx);
const grid = new Grid(canvas);
const invaderProjectiles = []; // Array to store invader projectiles

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // If space is being held, fire projectile
  if (keys.space) {
    Projectile.fire(player);
  }

  player.update();
  grid.update(player, invaderProjectiles);

  // Update and draw invader projectiles
  for (let i = invaderProjectiles.length - 1; i >= 0; i--) {
    const projectile = invaderProjectiles[i];
    projectile.update();

    // Remove projectiles that are off screen
    if (
      projectile.position.x < 0 ||
      projectile.position.x > canvas.width ||
      projectile.position.y < 0 ||
      projectile.position.y > canvas.height
    ) {
      invaderProjectiles.splice(i, 1);
      continue;
    }

    projectile.draw(ctx);
  }

  Projectile.updateAll(canvas);
  FireRatePack.updateAll(canvas, player, Projectile);
  BroadshotPack.updateAll(canvas, player, Projectile);

  player.draw();
  grid.draw(ctx);
  Projectile.drawAll(ctx);
  FireRatePack.drawAll(ctx);
  BroadshotPack.drawAll(ctx);

  requestAnimationFrame(animate);
}

// Replace single keydown listener with keydown and keyup
document.addEventListener("keydown", (e) => {
  if (e.key === " " && !e.repeat) {
    keys.space = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === " ") {
    keys.space = false;
  }
});

animate();
