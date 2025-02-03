export class Player {
  static SCALE_FACTOR = 0.5;
  static SPEED = 6;
  static MAX_TILT = 0.3;
  static TILT_SPEED = 0.1;

  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.image = null;
    this.width = 0;
    this.height = 0;
    this.rotation = 0;

    this.loadImage();
    this.setupControls();
  }

  setupControls() {
    window.addEventListener("keydown", (e) => {
      switch (e.key.toLowerCase()) {
        case "w":
          this.velocity.y = -Player.SPEED;
          break;
        case "s":
          this.velocity.y = Player.SPEED;
          break;
        case "a":
          this.velocity.x = -Player.SPEED;
          break;
        case "d":
          this.velocity.x = Player.SPEED;
          break;
      }
    });

    window.addEventListener("keyup", (e) => {
      switch (e.key.toLowerCase()) {
        case "w":
          if (this.velocity.y < 0) this.velocity.y = 0;
          break;
        case "s":
          if (this.velocity.y > 0) this.velocity.y = 0;
          break;
        case "a":
          if (this.velocity.x < 0) this.velocity.x = 0;
          break;
        case "d":
          if (this.velocity.x > 0) this.velocity.x = 0;
          break;
      }
    });
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    const targetRotation = this.velocity.x * (Player.MAX_TILT / Player.SPEED);
    this.rotation += (targetRotation - this.rotation) * Player.TILT_SPEED;

    if (this.image) {
      this.position.x = Math.max(
        0,
        Math.min(this.canvas.width - this.width, this.position.x)
      );
      this.position.y = Math.max(
        0,
        Math.min(this.canvas.height - this.height, this.position.y)
      );
    }
  }

  loadImage() {
    const image = new Image();
    image.src = "../assets/pictures/player.png";
    image.onload = () => {
      this.image = image;
      this.width = image.width * Player.SCALE_FACTOR;
      this.height = image.height * Player.SCALE_FACTOR;
      this.position.x = (this.canvas.width - this.width) / 2;
      this.position.y = this.canvas.height - this.height;
    };
  }

  draw() {
    if (!this.image) return;

    this.ctx.save();

    this.ctx.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
    this.ctx.rotate(this.rotation);
    this.ctx.drawImage(
      this.image,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );

    this.ctx.restore();
  }
}
