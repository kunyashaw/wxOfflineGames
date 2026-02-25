const Game = require('../base/Game');

class Shooter extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.player = { x: 0, y: 0, w: 30, h: 30 };
    this.bullets = [];
    this.enemies = [];
    this.score = 0;
    this.gameOver = false;
  }

  init() {
    this.player.x = this.width / 2 - 15;
    this.player.y = this.height - 80;
    this.bullets = [];
    this.enemies = [];
    this.score = 0;
    this.gameOver = false;
    this.startLoop();
    this.updateScore(0);
    this.draw();
  }

  update() {
    if (this.gameOver) return;
    
    this.score += 1;
    this.updateScore(Math.floor(this.score / 10));
    
    if (Math.random() < 0.03) {
      this.enemies.push({
        x: Math.random() * (this.width - 30),
        y: -30,
        w: 30,
        h: 30,
        speed: 2 + Math.random() * 2
      });
    }
    
    this.enemies.forEach(enemy => {
      enemy.y += enemy.speed;
    });
    
    this.enemies = this.enemies.filter(enemy => enemy.y < this.height);
    
    this.enemies.forEach(enemy => {
      if (this.player.x < enemy.x + enemy.w &&
          this.player.x + this.player.w > enemy.x &&
          this.player.y < enemy.y + enemy.h &&
          this.player.y + this.player.h > enemy.y) {
        this.gameOver = true;
        clearInterval(this.interval);
      }
    });
    
    this.bullets = this.bullets.filter(b => b.y > 0);
    
    this.bullets.forEach(bullet => {
      this.enemies.forEach((enemy, ei) => {
        if (bullet.x < enemy.x + enemy.w &&
            bullet.x + bullet.w > enemy.x &&
            bullet.y < enemy.y + enemy.h &&
            bullet.y + bullet.h > enemy.y) {
          enemy.dead = true;
          bullet.dead = true;
          this.score += 50;
          this.updateScore(Math.floor(this.score / 10));
        }
      });
    });
    
    this.bullets = this.bullets.filter(b => !b.dead);
    this.enemies = this.enemies.filter(e => !e.dead);
    
    this.draw();
  }

  shoot() {
    this.bullets.push({
      x: this.player.x + this.player.w / 2 - 3,
      y: this.player.y,
      w: 6,
      h: 12
    });
  }

  startLoop() {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => this.update(), 20);
  }

  draw() {
    this.clear();
    this.ctx.fillStyle = '#1a1a2e';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    this.enemies.forEach(enemy => {
      this.ctx.fillStyle = '#e74c3c';
      this.ctx.beginPath();
      this.ctx.moveTo(enemy.x + enemy.w / 2, enemy.y);
      this.ctx.lineTo(enemy.x + enemy.w, enemy.y + enemy.h);
      this.ctx.lineTo(enemy.x, enemy.y + enemy.h);
      this.ctx.closePath();
      this.ctx.fill();
    });
    
    this.bullets.forEach(bullet => {
      this.ctx.fillStyle = '#f1c40f';
      this.ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h);
    });
    
    this.ctx.fillStyle = '#3498db';
    this.ctx.beginPath();
    this.ctx.moveTo(this.player.x + this.player.w / 2, this.player.y);
    this.ctx.lineTo(this.player.x + this.player.w, this.player.y + this.player.h);
    this.ctx.lineTo(this.player.x, this.player.y + this.player.h);
    this.ctx.closePath();
    this.ctx.fill();
    
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '16px sans-serif';
    this.ctx.textAlign = 'left';
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
    this.touchStartX = e.changedTouches[0].clientX;
  }

  onTouchMove(e) {
    if (this.gameOver) return;
    const touch = e.touches[0];
    this.player.x = touch.clientX - this.player.w / 2;
    this.player.x = Math.max(0, Math.min(this.width - this.player.w, this.player.x));
  }

  onTouchEnd(e) {
    this.shoot();
  }

  cheat(action) {
    if (action === 'laser') {
      this.bullets.push({
        x: this.player.x + this.player.w / 2 - 10,
        y: this.player.y,
        w: 20,
        h: 30
      });
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

module.exports = Shooter;
