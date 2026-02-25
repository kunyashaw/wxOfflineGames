const Game = require('../base/Game');

class Hunt extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.cellSize = Math.min(40, (this.width - 40) / 10);
    this.offsetX = (this.width - this.cellSize * 10) / 2;
    this.offsetY = 40;
    this.grid = [];
    this.hunter = { x: 0, y: 0 };
    this.prey = [];
    this.score = 0;
  }

  init() {
    this.grid = Array(10).fill(null).map(() => Array(10).fill(0));
    this.hunter = { x: 0, y: 0 };
    this.grid[0][0] = 1;
    this.prey = [];
    for (let i = 0; i < 8; i++) {
      let x, y;
      do { x = Math.floor(Math.random() * 10); y = Math.floor(Math.random() * 10); } while (this.grid[y][x] || (x === 0 && y === 0));
      this.grid[y][x] = 2;
      this.prey.push({ x, y });
    }
    this.score = 0;
    this.updateScore(0);
    this.draw();
  }

  draw() {
    this.clear();
    this.drawRect(0, 0, this.width, this.height, '#2c3e50');
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const px = this.offsetX + x * this.cellSize;
        const py = this.offsetY + y * this.cellSize;
        this.drawRect(px + 1, py + 1, this.cellSize - 2, this.cellSize - 2, '#34495e', 4);
        if (this.grid[y][x] === 1) {
          this.drawCircle(px + this.cellSize / 2, py + this.cellSize / 2, this.cellSize * 0.35, '#e74c3c');
        } else if (this.grid[y][x] === 2) {
          this.drawCircle(px + this.cellSize / 2, py + this.cellSize / 2, this.cellSize * 0.35, '#2ecc71');
        }
      }
    }
    this.drawText(`捕获: ${8 - this.prey.length}/8`, this.width / 2, 20, 14, '#fff');
    if (this.prey.length === 0) {
      this.score = 1000;
      this.updateScore(1000);
      this.drawRect(0, this.height / 2 - 40, this.width, 80, 'rgba(0,0,0,0.7)');
      this.drawText('恭喜获胜!', this.width / 2, this.height / 2, 24, '#fff');
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

  move(dx, dy) {
    const nx = this.hunter.x + dx, ny = this.hunter.y + dy;
    if (nx >= 0 && nx < 10 && ny >= 0 && ny < 10) {
      this.grid[this.hunter.y][this.hunter.x] = 0;
      this.hunter = { x: nx, y: ny };
      this.grid[ny][nx] = 1;
      const idx = this.prey.findIndex(p => p.x === nx && p.y === ny);
      if (idx !== -1) {
        this.prey.splice(idx, 1);
        this.score += 100;
        this.updateScore(this.score);
      } else {
        this.score -= 1;
        this.updateScore(this.score);
      }
      this.draw();
    }
  }

  onTouchStart(e) { this.tx = e.changedTouches[0].clientX; this.ty = e.changedTouches[0].clientY; }
  onTouchEnd(e) {
    const dx = e.changedTouches[0].clientX - this.tx;
    const dy = e.changedTouches[0].clientY - this.ty;
    if (Math.abs(dx) > Math.abs(dy)) this.move(dx > 0 ? 1 : -1, 0);
    else this.move(0, dy > 0 ? 1 : -1);
  }

  cheat(action) {
    if (action === 'teleport' && this.prey.length > 0) {
      this.hunter = { ...this.prey[0] };
      this.grid[this.hunter.y][this.hunter.x] = 1;
      this.prey.shift();
      this.score += 100;
      this.updateScore(this.score);
      this.draw();
    }
  }
  getState() { return { score: this.score }; }
  restart() { this.init(); }
}

module.exports = Hunt;
