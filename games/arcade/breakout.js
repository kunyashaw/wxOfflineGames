const Game = require('../base/Game');

class Breakout extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.paddle = { x: 0, y: 0, w: 80, h: 12 };
    this.ball = { x: 0, y: 0, r: 8, dx: 3, dy: -3 };
    this.bricks = [];
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;
    this.paddleX = 0;
  }

  init() {
    this.paddle.y = this.height - 40;
    this.paddle.x = (this.width - this.paddle.w) / 2;
    this.ball = { x: this.width / 2, y: this.height - 60, r: 8, dx: 3, dy: -3 };
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;
    this.createBricks();
    this.startLoop();
    this.updateScore(0);
    this.draw();
  }

  createBricks() {
    this.bricks = [];
    const rows = 5, cols = 8;
    const padding = 5;
    const w = (this.width - padding * (cols + 1)) / cols;
    const h = 20;
    const colors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db'];
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        this.bricks.push({
          x: padding + c * (w + padding),
          y: 60 + r * (h + padding),
          w: w, h: h,
          color: colors[r],
          alive: true
        });
      }
    }
  }

  update() {
    if (this.gameOver) return;
    
    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;
    
    if (this.ball.x < this.ball.r || this.ball.x > this.width - this.ball.r) {
      this.ball.dx *= -1;
    }
    if (this.ball.y < this.ball.r) {
      this.ball.dy *= -1;
    }
    if (this.ball.y > this.height - this.ball.r) {
      this.lives--;
      if (this.lives <= 0) {
        this.gameOver = true;
        clearInterval(this.interval);
      } else {
        this.ball = { x: this.width / 2, y: this.height - 60, r: 8, dx: 3, dy: -3 };
      }
    }
    
    if (this.ball.y + this.ball.r > this.paddle.y &&
        this.ball.x > this.paddle.x && this.ball.x < this.paddle.x + this.paddle.w) {
      this.ball.dy *= -1;
      this.ball.y = this.paddle.y - this.ball.r;
    }
    
    this.bricks.forEach(b => {
      if (b.alive &&
          this.ball.x > b.x && this.ball.x < b.x + b.w &&
          this.ball.y - this.ball.r < b.y + b.h && this.ball.y + this.ball.r > b.y) {
        b.alive = false;
        this.ball.dy *= -1;
        this.score += 10;
        this.updateScore(this.score);
      }
    });
    
    if (this.bricks.every(b => !b.alive)) {
      this.createBricks();
      this.ball.dx *= 1.1;
      this.ball.dy *= 1.1;
    }
    
    this.draw();
  }

  startLoop() {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => this.update(), 20);
  }

  draw() {
    this.clear();
    this.drawRect(0, 0, this.width, this.height, '#1a1a2e');
    
    this.bricks.forEach(b => {
      if (b.alive) {
        this.drawRect(b.x, b.y, b.w, b.h, b.color, 3);
      }
    });
    
    this.drawCircle(this.ball.x, this.ball.y, this.ball.r, '#fff');
    this.drawRect(this.paddle.x, this.paddle.y, this.paddle.w, this.paddle.h, '#3498db', 5);
    
    this.drawText(`得分: ${this.score}`, 60, 25, 14, '#fff');
    this.drawText(`生命: ${this.lives}`, this.width - 60, 25, 14, '#fff');
    
    if (this.gameOver) {
      this.drawRect(0, this.height / 2 - 40, this.width, 80, 'rgba(0,0,0,0.7)');
      this.drawText('Game Over', this.width / 2, this.height / 2, 24, '#fff');
    }
  }

  drawRect(x, y, w, h, color, r = 0) {
    this.ctx.fillStyle = color;
    if (r > 0) {
      this.ctx.beginPath();
      this.ctx.roundRect(x, y, w, h, r);
      this.ctx.fill();
    } else {
      this.ctx.fillRect(x, y, w, h);
    }
  }

  drawCircle(x, y, r, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawText(text, x, y, size, color) {
    this.ctx.fillStyle = color;
    this.ctx.font = `${size}px sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.fillText(text, x, y);
  }

  onTouchMove(e) {
    const touch = e.touches[0];
    this.paddle.x = touch.clientX - this.paddle.w / 2;
    this.paddle.x = Math.max(0, Math.min(this.width - this.paddle.w, this.paddle.x));
  }

  cheat(action) {
    if (action === 'win') {
      this.bricks.forEach(b => b.alive = false);
      this.draw();
    }
  }

  getState() {
    return { score: this.score, lives: this.lives };
  }

  restart() {
    clearInterval(this.interval);
    this.init();
  }
}

module.exports = Breakout;
