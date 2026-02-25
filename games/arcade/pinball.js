const Game = require('../base/Game');

class Pinball extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.ball = { x: 0, y: 0, r: 8, dx: 2, dy: -2 };
    this.paddle = { x: 0, y: 0, w: 80, h: 10, angle: 0 };
    this.flippers = [];
    this.bumpers = [];
    this.score = 0;
    this.gameOver = false;
    this.gravity = 0.15;
  }

  init() {
    this.ball = { x: this.width / 2, y: 50, r: 8, dx: 2, dy: -2 };
    this.paddle.x = this.width / 2 - 40;
    this.paddle.y = this.height - 30;
    this.bumpers = [
      { x: this.width * 0.3, y: this.height * 0.4, r: 20, points: 10 },
      { x: this.width * 0.7, y: this.height * 0.4, r: 20, points: 10 },
      { x: this.width / 2, y: this.height * 0.6, r: 15, points: 20 }
    ];
    this.score = 0;
    this.gameOver = false;
    this.startLoop();
    this.updateScore(0);
    this.draw();
  }

  update() {
    if (this.gameOver) return;
    
    this.ball.dy += this.gravity;
    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;
    
    if (this.ball.x < this.ball.r || this.ball.x > this.width - this.ball.r) {
      this.ball.dx *= -0.8;
      this.ball.x = Math.max(this.ball.r, Math.min(this.width - this.ball.r, this.ball.x));
    }
    if (this.ball.y < this.ball.r) {
      this.ball.dy *= -0.8;
      this.ball.y = this.ball.r;
    }
    if (this.ball.y > this.height + 50) {
      this.gameOver = true;
      clearInterval(this.interval);
    }
    
    if (this.ball.y + this.ball.r > this.paddle.y &&
        this.ball.x > this.paddle.x && this.ball.x < this.paddle.x + this.paddle.w) {
      const hitPos = (this.ball.x - this.paddle.x) / this.paddle.w;
      this.ball.dy = -Math.abs(this.ball.dy * 0.9) - 2;
      this.ball.dx += (hitPos - 0.5) * 4;
      this.ball.y = this.paddle.y - this.ball.r;
    }
    
    this.bumpers.forEach(b => {
      const dx = this.ball.x - b.x;
      const dy = this.ball.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < b.r + this.ball.r) {
        const angle = Math.atan2(dy, dx);
        this.ball.dx = Math.cos(angle) * 5;
        this.ball.dy = Math.sin(angle) * 5;
        this.score += b.points;
        this.updateScore(this.score);
      }
    });
    
    this.draw();
  }

  startLoop() {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => this.update(), 16);
  }

  draw() {
    this.clear();
    this.ctx.fillStyle = '#1a1a2e';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    this.ctx.fillStyle = '#e74c3c';
    this.bumpers.forEach(b => {
      this.ctx.beginPath();
      this.ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    this.ctx.fillStyle = '#2ecc71';
    this.ctx.beginPath();
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.r, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = '#3498db';
    this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.w, this.paddle.h);
    
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '16px sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`得分: ${this.score}`, 10, 25);
    
    if (this.gameOver) {
      this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
      this.ctx.fillRect(0, this.height / 2 - 40, this.width, 80);
      this.ctx.fillStyle = '#fff';
      this.ctx.font = '24px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('游戏结束', this.width / 2, this.height / 2);
    }
  }

  onTouchMove(e) {
    const touch = e.touches[0];
    this.paddle.x = touch.clientX - this.paddle.w / 2;
    this.paddle.x = Math.max(0, Math.min(this.width - this.paddle.w, this.paddle.x));
  }

  cheat(action) {
    if (action === 'gravity') {
      this.gravity = 0.05;
    }
  }

  getState() {
    return { score: this.score };
  }

  restart() {
    clearInterval(this.interval);
    this.init();
  }
}

module.exports = Pinball;
