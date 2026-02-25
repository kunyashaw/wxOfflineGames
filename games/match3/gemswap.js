const Game = require('../base/Game');

class GemSwap extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.rows = 8; this.cols = 8;
    this.cellSize = Math.min(40, (this.width - 20) / this.cols);
    this.offsetX = (this.width - this.cellSize * this.cols) / 2;
    this.offsetY = 40;
    this.grid = []; this.score = 0; this.selected = null;
    this.icons = ['💠', '💎', '💍', '🔷', '🔶', '💜'];
  }

  init() {
    this.grid = Array(this.rows).fill(null).map(() => Array(this.cols).fill(0).map(() => Math.floor(Math.random() * this.icons.length)));
    this.score = 0; this.selected = null;
    this.updateScore(0); this.draw();
  }

  findMatches() {
    const matches = new Set();
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols - 2; c++) {
        if (this.grid[r][c] === this.grid[r][c+1] && this.grid[r][c] === this.grid[r][c+2]) {
          matches.add(`${r},${c}`); matches.add(`${r},${c+1}`); matches.add(`${r},${c+2}`);
        }
      }
    }
    for (let c = 0; c < this.cols; c++) {
      for (let r = 0; r < this.rows - 2; r++) {
        if (this.grid[r][c] === this.grid[r+1][c] && this.grid[r][c] === this.grid[r+2][c]) {
          matches.add(`${r},${c}`); matches.add(`${r+1},${c}`); matches.add(`${r+2},${c}`);
        }
      }
    }
    return Array.from(matches).map(s => s.split(',').map(Number));
  }

  removeMatches(matches) {
    matches.forEach(([r, c]) => { this.grid[r][c] = 0; this.score += 10; });
    this.updateScore(this.score);
    this.drop();
  }

  drop() {
    for (let c = 0; c < this.cols; c++) {
      let empty = [];
      for (let r = this.rows - 1; r >= 0; r--) {
        if (this.grid[r][c] === 0) empty.push(r);
        else if (empty.length > 0) { this.grid[empty.shift()][c] = this.grid[r][c]; this.grid[r][c] = 0; empty.push(r); }
      }
      empty.forEach(r => { this.grid[r][c] = Math.floor(Math.random() * this.icons.length); });
    }
    const matches = this.findMatches();
    if (matches.length > 0) { setTimeout(() => this.removeMatches(matches), 300); }
    this.draw();
  }

  swap(r1, c1, r2, c2) {
    [this.grid[r1][c1], this.grid[r2][c2]] = [this.grid[r2][c2], this.grid[r1][c1]];
    const matches = this.findMatches();
    if (matches.length === 0) { [this.grid[r1][c1], this.grid[r2][c2]] = [this.grid[r2][c2], this.grid[r1][c1]]; return; }
    this.removeMatches(matches);
  }

  draw() {
    this.clear(); this.ctx.fillStyle = '#e8daef'; this.ctx.fillRect(0, 0, this.width, this.height);
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const x = this.offsetX + c * this.cellSize, y = this.offsetY + r * this.cellSize;
        this.ctx.font = '22px sans-serif'; this.ctx.textAlign = 'center'; this.ctx.textBaseline = 'middle';
        this.ctx.fillText(this.icons[this.grid[r][c]], x + this.cellSize / 2, y + this.cellSize / 2);
      }
    }
    this.ctx.fillStyle = '#8e44ad'; this.ctx.font = '14px sans-serif'; this.ctx.textAlign = 'center';
    this.ctx.fillText(`得分: ${this.score}`, this.width / 2, 20);
  }

  onTouchEnd(e) {
    const touch = e.changedTouches[0];
    const c = Math.floor((touch.clientX - this.offsetX) / this.cellSize);
    const r = Math.floor((touch.clientY - this.offsetY) / this.cellSize);
    if (!this.selected) { if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) this.selected = { r, c }; }
    else { if (Math.abs(this.selected.r - r) + Math.abs(this.selected.c - c) === 1) this.swap(this.selected.r, this.selected.c, r, c); this.selected = null; }
  }

  cheat(action) { if (action === 'shuffle') { this.grid = this.grid.map(row => row.map(() => Math.floor(Math.random() * this.icons.length))); this.draw(); } }
  getState() { return { score: this.score }; }
  restart() { this.init(); }
}

module.exports = GemSwap;
