const Game = require('../base/Game');

class Copter extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.copter = { x: 0, y: 0, w: 30, h: 20, vy: 0 };
    this.obstacles = [];
    this.score = 0;
    this.gameOver = false;
    this.gravity = 0.3;
    this.thrust = -6;
  }

  init() {
    this.copter.x = this.width / 3;
    this.copter.y = this.height / 2;
    this.copter.vy = 0;
    this.obstacles = [];
    this.score = 0;
    this.gameOver = false;
    this.startLoop();
    this.updateScore(0);
    this.draw();
  }

  update() {
    if (this.gameOver) return;
    
    this.copter.vy += this.gravity;
    this.copter.y += this.copter.vy;
    this.score += 1;
    this.updateScore(Math.floor(this.score / 10));
    
    if (this.copter.y < 0 || this.copter.y > this.height - 20) {
      this.gameOver = true;
      clearInterval(this.interval);
    }
    
    if (Math.random() < 0.03) {
      const h = 40 + Math.random() * 80;
      this.obstacles.push({
        x: this.width,
        y: Math.random() > 0.5 ? 0 : this.height - h,
        w: 30,
        h: h
      });
    }
    
    this.obstacles.forEach(obs => {
      obs.x -= 3;
    });
    
    this.obstacles = this.obstacles.filter(obs => obs.x + obs.w > 0);
    
    this.obstacles.forEach(obs => {
      if (this.copter.x < obs.x + obs.w &&
          this.copter.x + this.copter.w > obs.x &&
          this.copter.y < obs.y + obs.h &&
          this.copter.y + this.copter.h > obs.y) {
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
    this.ctx.fillStyle = '#2c3e50';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    this.obstacles.forEach(obs => {
      this.ctx.fillStyle = '#27ae60';
      this.ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
    });
    
    this.ctx.fillStyle = '#e74c3c';
    this.ctx.fillRect(this.copter.x, this.copter.y, this.copter.w, this.copter.h);
    this.ctx.fillStyle = '#f39c12';
    this.ctx.fillRect(this.copter.x - 10, this.copter.y + 5, 10, 8);
    
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '16px sans-serif';
    this.ctx.fillText(`得分: ${Math.floor(this.score / 10)}`, 10, 25);
    
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
    this.copter.vy = this.thrust;
  }

  cheat(action) {
    if (action === 'slow') {
      this.gravity = 0.1;
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

module.exports = Copter;
