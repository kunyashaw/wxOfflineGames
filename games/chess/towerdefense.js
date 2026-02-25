const Game = require('../base/Game');

class TowerDefense extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.towers = [];
    this.enemies = [];
    this.projectiles = [];
    this.money = 100;
    this.lives = 20;
    this.wave = 1;
    this.score = 0;
    this.gameOver = false;
    this.cellSize = 40;
    this.cols = Math.floor(this.width / this.cellSize);
    this.rows = Math.floor((this.height - 80) / this.cellSize);
  }

  init() {
    this.towers = [];
    this.enemies = [];
    this.projectiles = [];
    this.money = 100;
    this.lives = 20;
    this.wave = 1;
    this.score = 0;
    this.gameOver = false;
    this.updateScore(0);
    this.startLoop();
    this.draw();
  }

  spawnEnemy() {
    const hp = this.wave * 10;
    this.enemies.push({ x: this.width / 2, y: 0, hp, maxHp: hp, speed: 1 + this.wave * 0.1 });
  }

  update() {
    if (this.gameOver) return;
    
    if (Math.random() < 0.02 * this.wave) this.spawnEnemy();
    
    this.enemies.forEach(e => { e.y += e.speed; });
    this.enemies = this.enemies.filter(e => {
      if (e.y > this.height - 80) { this.lives--; if (this.lives <= 0) { this.gameOver = true; clearInterval(this.interval); } return false; }
      return true;
    });
    
    this.towers.forEach(t => {
      if (!t.cooldown) t.cooldown = 0;
      if (t.cooldown > 0) t.cooldown--;
      else {
        const target = this.enemies.find(e => Math.hypot(e.x - t.x, e.y - t.y) < 150);
        if (target) {
          this.projectiles.push({ x: t.x, y: t.y, tx: target.x, ty: target.y, speed: 5 });
          t.cooldown = 30;
        }
      }
    });
    
    this.projectiles.forEach(p => {
      const dx = p.tx - p.x, dy = p.ty - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 10) {
        const enemy = this.enemies.find(e => Math.hypot(e.x - p.tx, e.y - p.ty) < 20);
        if (enemy) { enemy.hp -= 10; if (enemy.hp <= 0) { this.money += 5; this.score += 10; } }
        p.dead = true;
      } else { p.x += (dx / dist) * p.speed; p.y += (dy / dist) * p.speed; }
    });
    this.projectiles = this.projectiles.filter(p => !p.dead);
    this.enemies = this.enemies.filter(e => e.hp > 0);
    
    if (this.enemies.length === 0 && this.score > this.wave * 100) this.wave++;
    this.updateScore(this.score);
    this.draw();
  }

  startLoop() {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => this.update(), 50);
  }

  draw() {
    this.clear();
    this.drawRect(0, 0, this.width, this.height, '#2c3e50');
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        this.drawRect(c * this.cellSize, r * this.cellSize + 60, this.cellSize, this.cellSize, '#34495e', 1);
      }
    }
    this.towers.forEach(t => {
      this.drawCircle(t.x, t.y, 15, '#3498db');
      this.drawCircle(t.x, t.y, 8, '#2980b9');
    });
    this.enemies.forEach(e => {
      this.drawCircle(e.x, e.y, 10, '#e74c3c');
      this.drawRect(e.x - 10, e.y - 18, 20 * (e.hp / e.maxHp), 4, '#2ecc71');
    });
    this.projectiles.forEach(p => { this.drawCircle(p.x, p.y, 4, '#f1c40f'); });
    
    this.drawText(`💰 ${this.money}  ❤️ ${this.lives}  🌊 ${this.wave}  🏆 ${this.score}`, this.width / 2, 30, 14, '#fff');
    if (this.gameOver) {
      this.drawRect(0, this.height / 2 - 40, this.width, 80, 'rgba(0,0,0,0.7)');
      this.drawText('游戏结束!', this.width / 2, this.height / 2, 24, '#fff');
    }
  }

  drawRect(x, y, w, h, color, r = 0) {
    this.ctx.fillStyle = color;
    if (r > 0) { this.ctx.beginPath(); this.ctx.roundRect(x, y, w, h, r); this.ctx.fill(); }
    else this.ctx.fillRect(x, y, w, h);
  }

  drawCircle(x, y, r, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath(); this.ctx.arc(x, y, r, 0, Math.PI * 2); this.ctx.fill();
  }

  drawText(text, x, y, size, color) {
    this.ctx.fillStyle = color;
    this.ctx.font = `${size}px sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.fillText(text, x, y);
  }

  onTouchEnd(e) {
    if (this.gameOver) return;
    const touch = e.changedTouches[0];
    if (touch.clientY > 60 && this.money >= 50) {
      const cx = Math.floor(touch.clientX / this.cellSize) * this.cellSize + this.cellSize / 2;
      const cy = Math.floor((touch.clientY - 60) / this.cellSize) * this.cellSize + this.cellSize / 2 + 60;
      if (!this.towers.some(t => Math.hypot(t.x - cx, t.y - cy) < 30)) {
        this.towers.push({ x: cx, y: cy, cooldown: 0 });
        this.money -= 50;
      }
    }
  }

  cheat(action) {
    if (action === 'money') this.money += 100;
  }
  getState() { return { score: this.score }; }
  restart() { clearInterval(this.interval); this.init(); }
}

module.exports = TowerDefense;
