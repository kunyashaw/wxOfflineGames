const Game = require('../base/Game');

class GemMatch extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.rows = 8;
    this.cols = 8;
    this.cellSize = Math.min(40, (this.width - 20) / this.cols);
    this.offsetX = (this.width - this.cellSize * this.cols) / 2;
    this.offsetY = 40;
    this.grid = [];
    this.score = 0;
    this.selected = null;
    this.gems = ['💎', '💍', '🔮', '🎀', '🌟', '❤️'];
    this.colors = ['#3498db', '#9b59b6', '#1abc9c', '#e74c3c', '#f1c40f', '#2ecc71'];
  }

  init() {
    this.grid = Array(this.rows).fill(null).map(() => Array(this.cols).fill(0));
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        this.grid[r][c] = Math.floor(Math.random() * this.gems.length);
      }
    }
    this.score = 0;
    this.selected = null;
    this.updateScore(0);
    this.draw();
  }

  findMatches() {
    const matches = new Set();
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols - 2; c++) {
        if (this.grid[r][c] && this.grid[r][c] === this.grid[r][c + 1] && this.grid[r][c] === this.grid[r][c + 2]) {
          matches.add(`${r},${c}`); matches.add(`${r},${c + 1}`); matches.add(`${r},${c + 2}`);
        }
      }
    }
    for (let c = 0; c < this.cols; c++) {
      for (let r = 0; r < this.rows - 2; r++) {
        if (this.grid[r][c] && this.grid[r][c] === this.grid[r + 1][c] && this.grid[r][c] === this.grid[r + 2][c]) {
          matches.add(`${r},${c}`); matches.add(`${r + 1},${c}`); matches.add(`${r + 2},${c}`);
        }
      }
    }
    return Array.from(matches).map(s => s.split(',').map(Number));
  }

  removeMatches(matches) {
    matches.forEach(([r, c]) => { this.grid[r][c] = 0; });
    this.score += matches.length * 10;
    this.updateScore(this.score);
  }

  drop() {
    for (let c = 0; c < this.cols; c++) {
      let empty = [];
      for (let r = this.rows - 1; r >= 0; r--) {
        if (this.grid[r][c] === 0) empty.push(r);
        else if (empty.length > 0) {
          this.grid[empty.shift()][c] = this.grid[r][c];
          this.grid[r][c] = 0;
          empty.push(r);
        }
      }
      empty.forEach(r => { this.grid[r][c] = Math.floor(Math.random() * this.gems.length); });
    }
  }

  swap(r1, c1, r2, c2) {
    [this.grid[r1][c1], this.grid[r2][c2]] = [this.grid[r2][c2], this.grid[r1][c1]];
    const matches = this.findMatches();
    if (matches.length === 0) {
      [this.grid[r1][c1], this.grid[r2][c2]] = [this.grid[r2][c2], this.grid[r1][c1]];
      return false;
    }
    this.removeMatches(matches);
    this.drop();
    setTimeout(() => { const m = this.findMatches(); if (m.length) { this.removeMatches(m); this.drop(); } this.draw(); }, 200);
    return true;
  }

  draw() {
    this.clear();
    this.drawRect(0, 0, this.width, this.height, '#2c3e50');
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const x = this.offsetX + c * this.cellSize;
        const y = this.offsetY + r * this.cellSize;
        this.drawRect(x + 2, y + 2, this.cellSize - 4, this.cellSize - 4, this.colors[this.grid[r][c]], 6);
      }
    }
    this.drawText(`得分: ${this.score}`, this.width / 2, 20, 14, '#fff');
  }

  drawRect(x, y, w, h, color, r = 0) {
    this.ctx.fillStyle = color;
    if (r > 0) { this.ctx.beginPath(); this.ctx.roundRect(x, y, w, h, r); this.ctx.fill(); }
    else this.ctx.fillRect(x, y, w, h);
  }

  drawText(text, x, y, size, color) {
    this.ctx.fillStyle = color; this.ctx.font = `${size}px sans-serif`;
    this.ctx.textAlign = 'center'; this.ctx.fillText(text, x, y);
  }

  onTouchEnd(e) {
    const touch = e.changedTouches[0];
    const c = Math.floor((touch.clientX - this.offsetX) / this.cellSize);
    const r = Math.floor((touch.clientY - this.offsetY) / this.cellSize);
    if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
      if (!this.selected) this.selected = { r, c };
      else {
        const dr = Math.abs(this.selected.r - r), dc = Math.abs(this.selected.c - c);
        if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) this.swap(this.selected.r, this.selected.c, r, c);
        this.selected = null;
        this.draw();
      }
    }
  }

  cheat(action) {
    if (action === 'shuffle') {
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          this.grid[r][c] = Math.floor(Math.random() * this.gems.length);
        }
      }
      this.draw();
    }
  }
  getState() { return { score: this.score }; }
  restart() { this.init(); }
}

module.exports = GemMatch;
