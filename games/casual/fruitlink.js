const Game = require('../base/Game');

class FruitLink extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.rows = 6;
    this.cols = 6;
    this.cellSize = Math.min(50, (this.width - 40) / this.cols);
    this.offsetX = (this.width - this.cellSize * this.cols) / 2;
    this.offsetY = 50;
    this.grid = [];
    this.score = 0;
    this.fruits = ['🍎','🍊','🍇','🍌','🍉','🍓','🍒','🥝'];
  }

  init() {
    this.grid = Array(this.rows).fill(null).map(() => Array(this.cols).fill(0).map(() => Math.floor(Math.random() * this.fruits.length)));
    this.score = 0;
    this.updateScore(0);
    this.draw();
  }

  findPath(r1, c1, r2, c2) {
    if (r1 === r2 && c1 === c2) return null;
    const visited = new Set();
    const queue = [{ r: r1, c: c1, path: [] }];
    
    while (queue.length) {
      const { r, c, path } = queue.shift();
      if (r === r2 && c === c2) return path;
      
      const key = `${r},${c}`;
      if (visited.has(key)) continue;
      visited.add(key);
      
      const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols && (nr === r2 && nc === c2)) {
          return [...path, { r: nr, c: nc }];
        }
        if (!visited.has(`${nr},${nc}`) && (nr === r1 || nc === c1 || nr === r2 || nc === c2 || !this.grid[nr][nc] || (nr === r && nc === c))) {
          queue.push({ r: nr, c: nc, path: [...path, { r: nr, c: nc }] });
        }
      }
    }
    return null;
  }

  draw() {
    this.clear();
    this.ctx.fillStyle = '#2c3e50';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const x = this.offsetX + c * this.cellSize;
        const y = this.offsetY + r * this.cellSize;
        this.ctx.fillStyle = '#34495e';
        this.ctx.fillRect(x + 2, y + 2, this.cellSize - 4, this.cellSize - 4);
        if (this.grid[r][c] !== -1) {
          this.ctx.font = '24px sans-serif';
          this.ctx.textAlign = 'center';
          this.ctx.textBaseline = 'middle';
          this.ctx.fillText(this.fruits[this.grid[r][c]], x + this.cellSize / 2, y + this.cellSize / 2);
        }
      }
    }
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '14px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`得分: ${this.score}`, this.width / 2, 25);
  }

  onTouchEnd(e) {
    const touch = e.changedTouches[0];
    const c = Math.floor((touch.clientX - this.offsetX) / this.cellSize);
    const r = Math.floor((touch.clientY - this.offsetY) / this.cellSize);
    
    if (r >= 0 && r < this.rows && c >= 0 && c < this.cols && this.grid[r][c] !== -1) {
      if (!this.selected) {
        this.selected = { r, c };
      } else {
        if (this.grid[this.selected.r][this.selected.c] === this.grid[r][c] && this.findPath(this.selected.r, this.selected.c, r, c)) {
          this.score += 10;
          this.updateScore(this.score);
          this.grid[this.selected.r][this.selected.c] = -1;
          this.grid[r][c] = -1;
        }
        this.selected = null;
      }
      this.draw();
    }
  }

  cheat(action) {
    if (action === 'hint') {
      for (let r1 = 0; r1 < this.rows; r1++) {
        for (let c1 = 0; c1 < this.cols; c1++) {
          if (this.grid[r1][c1] === -1) continue;
          for (let r2 = 0; r2 < this.rows; r2++) {
            for (let c2 = 0; c2 < this.cols; c2++) {
              if (this.grid[r2][c2] === -1 || (r1 === r2 && c1 === c2)) continue;
              if (this.grid[r1][c1] === this.grid[r2][c2] && this.findPath(r1, c1, r2, c2)) {
                this.selected = { r: r1, c: c1 };
                this.draw();
                return;
              }
            }
          }
        }
      }
    }
  }

  getState() { return { score: this.score }; }
  restart() { this.init(); }
}

module.exports = FruitLink;
