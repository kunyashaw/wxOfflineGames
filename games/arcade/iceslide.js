const Game = require('../base/Game');

class IceSlide extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.player = { x: 0, y: 0, size: 20, dx: 0, dy: 0 };
    this.obstacles = [];
    this.score = 0;
    this.gameOver = false;
    this.friction = 0.98;
    this.iceFriction = 0.995;
  }

  init() {
    this.player.x = this.width / 2;
    this.player.y = this.height / 2;
    this.player.dx = 0;
    this.player.dy = 0;
    this.obstacles = [];
    this.score = 0;
    this.gameOver = false;
    
    for (let i = 0; i < 15; i++) {
      this.obstacles.push({
        x: Math.random() * (this.width - 40),
        y: Math.random() * (this.height - 40),
        w: 30 + Math.random() * 30,
        h: 30 + Math.random() * 30,
        type: Math.random() > 0.5 ? 'rock' : 'tree'
      });
    }
    
    this.startLoop();
    this.updateScore(0);
    this.draw();
  }

  update() {
    if (this.gameOver) return;
    
    this.player.x += this.player.dx;
    this.player.y += this.player.dy;
    
    this.player.dx *= this.iceFriction;
    this.player.dy *= this.iceFriction;
    
    if (this.player.x < 0 || this.player.x > this.width - this.player.size ||
        this.player.y < 0 || this.player.y > this.height - this.player.size) {
      this.player.dx *= -0.5;
      this.player.dy *= -0.5;
      this.player.x = Math.max(0, Math.min(this.width - this.player.size, this.player.x));
      this.player.y = Math.max(0, Math.min(this.height - this.player.size, this.player.y));
    }
    
    this.score += 1;
    this.updateScore(Math.floor(this.score / 10));
    
    this.obstacles.forEach(obs => {
      if (this.player.x < obs.x + obs.w &&
          this.player.x + this.player.size > obs.x &&
          this.player.y < obs.y + obs.h &&
          this.player.y + this.player.size > obs.y) {
        this.gameOver = true;
        clearInterval(this.interval);
      }
    });
    
    this.draw();
  }

  startLoop() {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => this.update(), 20);
  }

  draw() {
    this.clear();
    this.ctx.fillStyle = '#d5f5e3';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    for (let i = 0; i < 20; i++) {
      this.ctx.fillStyle = '#abebc6';
      this.ctx.beginPath();
      this.ctx.arc(i * 50 + 25, (i * 37) % this.height + 25, 20, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.obstacles.forEach(obs => {
      if (obs.type === 'rock') {
        this.ctx.fillStyle = '#7f8c8d';
        this.ctx.beginPath();
        this.ctx.arc(obs.x + obs.w / 2, obs.y + obs.h / 2, obs.w / 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        this.ctx.fillStyle = '#27ae60';
        this.ctx.beginPath();
        this.ctx.moveTo(obs.x + obs.w / 2, obs.y);
        this.ctx.lineTo(obs.x + obs.w, obs.y + obs.h);
        this.ctx.lineTo(obs.x, obs.y + obs.h);
        this.ctx.closePath();
        this.ctx.fill();
      }
    });
    
    this.ctx.fillStyle = '#3498db';
    this.ctx.beginPath();
    this.ctx.arc(this.player.x + this.player.size / 2, this.player.y + this.player.size / 2,
                 this.player.size / 2, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillStyle = '#fff';
    this.ctx.beginPath();
    this.ctx.arc(this.player.x + this.player.size / 2 - 3, this.player.y + this.player.size / 2 - 3,
                 3, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = '#2c3e50';
    this.ctx.font = '16px sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`得分: ${Math.floor(this.score / 10)}`, 10, 25);
    
    if (this.gameOver) {
      this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
      this.ctx.fillRect(0, this.height / 2 - 40, this.width, 80);
      this.ctx.fillStyle = '#fff';
      this.ctx.font = '24px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('游戏结束', this.width / 2, this.height / 2);
    }
  }

  onTouchStart(e) {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - (this.player.x + this.player.size / 2);
    const dy = touch.clientY - (this.player.y + this.player.size / 2);
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > 0) {
      this.player.dx += (dx / dist) * 3;
      this.player.dy += (dy / dist) * 3;
    }
  }

  cheat(action) {
    if (action === 'slow') {
      this.friction = 0.9;
      this.iceFriction = 0.95;
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

module.exports = IceSlide;
