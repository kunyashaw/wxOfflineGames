const Game = require('../base/Game');

class BrickJump extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.player = { x: 0, y: 0, w: 24, h: 24, vy: 0 };
    this.platforms = [];
    this.score = 0;
    this.gameOver = false;
    this.cameraY = 0;
  }

  init() {
    this.player.x = this.width / 2 - 12;
    this.player.y = this.height - 100;
    this.player.vy = 0;
    this.cameraY = 0;
    this.score = 0;
    this.gameOver = false;
    this.platforms = [];
    
    for (let i = 0; i < 50; i++) {
      this.platforms.push({
        x: Math.random() * (this.width - 60),
        y: this.height - 80 - i * 70,
        w: 60 + Math.random() * 40,
        h: 15
      });
    }
    
    this.startLoop();
    this.updateScore(0);
    this.draw();
  }

  update() {
    if (this.gameOver) return;
    
    this.player.vy += 0.3;
    this.player.y += this.player.vy;
    
    if (this.player.y < this.height / 2) {
      this.cameraY = this.height / 2 - this.player.y;
      this.score += Math.floor(this.cameraY / 10);
      this.updateScore(this.score);
    }
    
    if (this.player.y > this.height) {
      this.gameOver = true;
      clearInterval(this.interval);
    }
    
    this.platforms.forEach(p => {
      if (this.player.vy > 0 &&
          this.player.x + this.player.w > p.x &&
          this.player.x < p.x + p.w &&
          this.player.y + this.player.h > p.y &&
          this.player.y + this.player.h < p.y + p.h + 10) {
        this.player.y = p.y - this.player.h;
        this.player.vy = -10;
      }
    });
    
    this.platforms = this.platforms.filter(p => p.y - this.cameraY < this.height);
    
    while (this.platforms.length < 50) {
      const lastY = this.platforms.length > 0 ? 
        Math.min(...this.platforms.map(p => p.y)) : this.height;
      this.platforms.push({
        x: Math.random() * (this.width - 60),
        y: lastY - 70,
        w: 60 + Math.random() * 40,
        h: 15
      });
    }
    
    this.draw();
  }

  startLoop() {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => this.update(), 20);
  }

  draw() {
    this.clear();
    this.ctx.fillStyle = '#1a1a2e';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    this.platforms.forEach(p => {
      const y = p.y - this.cameraY;
      if (y > -20 && y < this.height) {
        this.ctx.fillStyle = '#27ae60';
        this.ctx.fillRect(p.x, y, p.w, p.h);
      }
    });
    
    this.ctx.fillStyle = '#e74c3c';
    this.ctx.fillRect(this.player.x, this.player.y, this.player.w, this.player.h);
    
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '16px sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`高度: ${Math.floor(this.score / 10)}`, 10, 25);
    
    if (this.gameOver) {
      this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
      this.ctx.fillRect(0, this.height / 2 - 40, this.width, 80);
      this.ctx.fillStyle = '#fff';
      this.ctx.font = '24px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('游戏结束', this.width / 2, this.height / 2);
    }
  }

  onTouchStart(e) {
    if (this.gameOver) return;
    const touch = e.changedTouches[0];
    if (touch.clientX < this.width / 2) {
      this.player.vy = -5;
      this.player.x -= 20;
    } else {
      this.player.vy = -5;
      this.player.x += 20;
    }
    this.player.x = Math.max(0, Math.min(this.width - this.player.w, this.player.x));
  }

  cheat(action) {
    if (action === 'fly') {
      this.player.vy = -5;
    }
  }

  getState() {
    return { score: Math.floor(this.score / 10) };
  }

  restart() {
    clearInterval(this.interval);
    this.init();
  }
}

module.exports = BrickJump;
