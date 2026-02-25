const Game = require('../base/Game');

class FruitNinja extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.fruits = [];
    this.sliced = [];
    this.bombs = [];
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;
    this.fruitIcons = ['🍎', '🍊', '🍇', '🍌', '🍉', '🍓'];
    this.spawnTimer = 0;
  }

  init() {
    this.fruits = [];
    this.sliced = [];
    this.bombs = [];
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;
    this.updateScore(0);
    this.startLoop();
    this.draw();
  }

  update() {
    if (this.gameOver) return;
    
    this.spawnTimer++;
    if (this.spawnTimer > 60) {
      this.spawnTimer = 0;
      const isBomb = Math.random() < 0.15;
      if (isBomb) {
        this.bombs.push({ x: Math.random() * (this.width - 60) + 30, y: this.height + 20, vx: (Math.random() - 0.5) * 2, vy: -(Math.random() * 3 + 4), rot: 0 });
      } else {
        this.fruits.push({ x: Math.random() * (this.width - 60) + 30, y: this.height + 20, vx: (Math.random() - 0.5) * 2, vy: -(Math.random() * 3 + 4), icon: this.fruitIcons[Math.floor(Math.random() * this.fruitIcons.length)], rot: 0 });
      }
    }
    
    this.fruits.forEach(f => { f.x += f.vx; f.y += f.vy; f.vy += 0.1; f.rot += 0.1; });
    this.bombs.forEach(b => { b.x += b.vx; b.y += b.vy; b.vy += 0.1; b.rot += 0.1; });
    this.fruits = this.fruits.filter(f => f.y < this.height + 50);
    this.bombs = this.bombs.filter(b => b.y < this.height + 50);
    
    this.sliced = this.sliced.filter(s => s.y < this.height + 50);
    this.sliced.forEach(s => { s.y += s.vy; s.vy += 0.2; });
    
    if (this.fruits.length > 15 || this.bombs.length > 3) { this.gameOver = true; clearInterval(this.interval); }
    this.draw();
  }

  startLoop() {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => this.update(), 30);
  }

  draw() {
    this.clear();
    this.drawRect(0, 0, this.width, this.height, '#2c3e50');
    this.bombs.forEach(b => { this.drawText('💣', b.x, b.y, 30); });
    this.fruits.forEach(f => { this.ctx.save(); this.ctx.translate(f.x, f.y); this.ctx.rotate(f.rot); this.drawText(f.icon, 0, 0, 30); this.ctx.restore(); });
    this.sliced.forEach(s => { this.drawText(s.icon, s.x, s.y, 24); });
    this.drawText(`得分: ${this.score}  生命: ${this.lives}`, this.width / 2, 25, 16, '#fff');
    if (this.gameOver) {
      this.drawRect(0, this.height / 2 - 40, this.width, 80, 'rgba(0,0,0,0.7)');
      this.drawText('游戏结束!', this.width / 2, this.height / 2, 24, '#fff');
    }
  }

  drawRect(x, y, w, h, color) { this.ctx.fillStyle = color; this.ctx.fillRect(x, y, w, h); }
  drawText(text, x, y, size) { this.ctx.font = `${size}px sans-serif`; this.ctx.textAlign = 'center'; this.ctx.textBaseline = 'middle'; this.ctx.fillText(text, x, y); }

  onTouchMove(e) {
    if (this.gameOver) return;
    const touch = e.touches[0];
    this.fruits = this.fruits.filter(f => {
      if (Math.hypot(f.x - touch.clientX, f.y - touch.clientY) < 40) {
        this.sliced.push({ x: f.x, y: f.y, vx: f.vx, vy: f.vy, icon: f.icon });
        this.score += 10;
        this.updateScore(this.score);
        return false;
      }
      return true;
    });
    this.bombs = this.bombs.filter(b => {
      if (Math.hypot(b.x - touch.clientX, b.y - touch.clientY) < 40) { this.lives--; if (this.lives <= 0) { this.gameOver = true; clearInterval(this.interval); } return false; }
      return true;
    });
    this.draw();
  }

  cheat(action) { if (action === 'slow') { this.fruits.forEach(f => f.vy *= 0.5); } }
  getState() { return { score: this.score }; }
  restart() { clearInterval(this.interval); this.init(); }
}

module.exports = FruitNinja;
