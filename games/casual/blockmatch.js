const Game = require('../base/Game');

class BlockMatch extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.rows = 10;
    this.cols = 10;
    this.cellSize = Math.min(32, (this.width - 20) / this.cols);
    this.offsetX = (this.width - this.cellSize * this.cols) / 2;
    this.offsetY = 40;
    this.grid = [];
    this.score = 0;
    this.selected = [];
  }

  init() {
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'];
    this.grid = Array(this.rows).fill(null).map(() => Array(this.cols).fill(0).map(() => Math.floor(Math.random() * colors.length)));
    this.score = 0;
    this.selected = [];
    this.updateScore(0);
    this.draw();
  }

  findGroup(r, c, color, visited = new Set()) {
    const key = `${r},${c}`;
    if (visited.has(key)) return [];
    if (r < 0 || r >= this.rows || c < 0 || c >= this.cols || this.grid[r][c] !== color) return [];
    visited.add(key);
    let group = [{ r, c }];
    [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dr, dc]) => {
      group = group.concat(this.findGroup(r + dr, c + dc, color, visited));
    });
    return group;
  }

  draw() {
    this.clear();
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'];
    this.ctx.fillStyle = '#2c3e50';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const x = this.offsetX + c * this.cellSize;
        const y = this.offsetY + r * this.cellSize;
        if (this.grid[r][c] >= 0) {
          this.ctx.fillStyle = colors[this.grid[r][c]];
          this.ctx.fillRect(x + 1, y + 1, this.cellSize - 2, this.cellSize - 2);
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
    
    if (r >= 0 && r < this.rows && c >= 0 && c < this.cols && this.grid[r][c] >= 0) {
      const color = this.grid[r][c];
      const group = this.findGroup(r, c, color);
      
      if (group.length >= 2) {
        this.score += group.length * 10;
        this.updateScore(this.score);
        group.forEach(({ r, c }) => { this.grid[r][c] = -1; });
        
        for (let c = 0; c < this.cols; c++) {
          let empty = [];
          for (let r = this.rows - 1; r >= 0; r--) {
            if (this.grid[r][c] === -1) empty.push(r);
            else if (empty.length > 0) {
              this.grid[empty.shift()][c] = this.grid[r][c];
              this.grid[r][c] = -1;
              empty.push(r);
            }
          }
        }
      }
      this.draw();
    }
  }

  cheat(action) {
    if (action === 'clear') {
      this.score += 100;
      this.updateScore(100);
      this.grid = this.grid.map(row => row.map(() => -1));
      this.draw();
    }
  }

  getState() { return { score: this.score }; }
  restart() { this.init(); }
}

module.exports = BlockMatch;
