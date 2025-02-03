import { Projectile } from "../player/projectile.js";
import { Invader, InvaderProjectile } from "./invader(grunt).js";
import { Particle } from "../effects/particle.js";

export class Grid {
  static VELOCITY = 3;
  static DESCENT_DISTANCE = 30;
  static PADDING = 30; // Space between invaders

  constructor(canvas) {
    this.canvas = canvas;
    this.position = { x: 0, y: 0 };
    this.velocity = { x: Grid.VELOCITY, y: 0 };
    this.invaders = [];
    this.width = 0;
    this.height = 0;

    this.createGrid();
  }

  createGrid() {
    const columns = Math.floor(Math.random() * 6 + 5); // 5-10 columns
    const rows = Math.floor(Math.random() * 3 + 2); // 2-4 rows

    // Create a new invader to get dimensions
    const tempInvader = new Invader({ x: 0, y: 0 }, this.canvas);

    // Wait for image to load to get proper dimensions
    const checkDimensions = () => {
      if (tempInvader.width === 0) {
        requestAnimationFrame(checkDimensions);
        return;
      }

      // Calculate grid dimensions
      this.width = columns * (tempInvader.width + Grid.PADDING);
      this.height = rows * (tempInvader.height + Grid.PADDING);

      // Center grid horizontally
      this.position.x = (this.canvas.width - this.width) / 2;
      this.position.y = Grid.PADDING; // Start near top of canvas

      // Create invaders
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          this.invaders.push(
            new Invader(
              {
                x: this.position.x + col * (tempInvader.width + Grid.PADDING),
                y: this.position.y + row * (tempInvader.height + Grid.PADDING),
              },
              this.canvas
            )
          );
        }
      }
    };

    checkDimensions();
  }

  update(player, projectiles) {
    this.updateMovement();
    this.updateInvaders(player, projectiles);
    Particle.updateAll();
  }

  updateMovement() {
    // Move grid
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Check for wall collision using actual invader positions
    const rightMost = Math.max(
      ...this.invaders.map((inv) => inv.position.x + inv.width)
    );
    const leftMost = Math.min(...this.invaders.map((inv) => inv.position.x));

    if (rightMost >= this.canvas.width || leftMost <= 0) {
      // Reverse direction and move down
      this.velocity.x = -this.velocity.x;
      this.velocity.y = Grid.DESCENT_DISTANCE;
    }

    // Update invader positions
    this.invaders.forEach((invader) => {
      invader.velocity.x = this.velocity.x;
      invader.velocity.y = this.velocity.y;
      invader.update();
    });

    // Reset vertical velocity
    this.velocity.y = 0;
  }

  updateInvaders(player, projectiles) {
    // Remove destroyed invaders
    this.invaders = this.invaders.filter((invader) => {
      // Check for player projectile collisions
      const isHit = Projectile.projectiles.some(
        (projectile, projectileIndex) => {
          const hitX =
            projectile.position.x >= invader.position.x &&
            projectile.position.x <= invader.position.x + invader.width;
          const hitY =
            projectile.position.y >= invader.position.y &&
            projectile.position.y <= invader.position.y + invader.height;

          if (hitX && hitY) {
            // Remove the projectile
            Projectile.projectiles.splice(projectileIndex, 1);

            // Play hit sound and check if invader dies
            invader.hit();

            if (invader.isDead()) {
              // Create explosion at invader's center position
              Particle.createExplosion(
                {
                  x: invader.position.x + invader.width / 2,
                  y: invader.position.y + invader.height / 2,
                },
                15, // number of particles
                "#FFFFFF" // white color for explosion
              );
            }

            return invader.isDead();
          }
          return false;
        }
      );
      return !isHit;
    });

    // Spawn new grid if all invaders are destroyed
    if (this.invaders.length === 0) {
      this.createGrid();
    }

    // Update grid dimensions and position based on remaining invaders
    if (this.invaders.length > 0) {
      const leftMost = Math.min(...this.invaders.map((inv) => inv.position.x));
      const rightMost = Math.max(
        ...this.invaders.map((inv) => inv.position.x + inv.width)
      );
      const bottomMost = Math.max(
        ...this.invaders.map((inv) => inv.position.y + inv.height)
      );

      this.width = rightMost - leftMost;
      this.position.x = leftMost;
      this.height = bottomMost - this.position.y;
    }

    // Check for invader projectile collisions with player
    projectiles.forEach((projectile, index) => {
      if (projectile instanceof InvaderProjectile) {
        const hitX =
          projectile.position.x >= player.position.x &&
          projectile.position.x <= player.position.x + player.width;
        const hitY =
          projectile.position.y >= player.position.y &&
          projectile.position.y <= player.position.y + player.height;

        if (hitX && hitY) {
          // Remove the projectile and reset game
          projectiles.splice(index, 1);
          this.resetGame(player);
        }
      }
    });

    // Random shooting
    this.invaders.forEach((invader) => {
      if (Math.random() < 0.002) {
        invader.shoot(player, projectiles);
      }
    });
  }

  resetGame(player) {
    // Reset player position
    player.position.x = (player.canvas.width - player.width) / 2;
    player.position.y = player.canvas.height - player.height;

    // Reset grid
    this.invaders = [];
    this.createGrid();
  }

  draw(ctx) {
    this.invaders.forEach((invader) => invader.draw(ctx));
    // Draw particles
    Particle.drawAll(ctx);
  }
}
