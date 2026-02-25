const Game = require('../base/Game');

class ClickMatch extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.grid = [];
    this.score = 0;
    this.cellSize = 45;
    this.colors = ['#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6'];
  }

  init() {
    this.grid = Array(6).fill(null).map(() => 
      Array(6).fill(null).map(() => ({
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        removed: false
      }))
    );
    this.score = 0;
    this.updateScore(0);
    this.draw();
  }

  draw() {
    this.clear();
    this.ctx.fillStyle = '#2c3e50';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    const offsetX = (this.width - this.cellSize * 6) / 2;
    const offsetY = (this.height - this.cellSize * 6) / 2;
    
    this.grid.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (!cell.removed) {
          this.ctx.fillStyle = cell.color;
          this.ctx.fillRect(offsetX + c * this.cellSize + 2, offsetY + r * this.cellSize + 2, 
            this.cellSize - 4, this.cellSize - 4);
        }
      });
    });
    
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '16px sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`得分: ${this.score}`, 10, 25);
  }

  onTouchEnd(e) {
    const touch = e.changedTouches[0];
    const offsetX = (this.width - this.cellSize * 6) / 2;
    const offsetY = (this.height - this.cellSize * 6) / 2;
    const c = Math.floor((touch.clientX - offsetX) / this.cellSize);
    const r = Math.floor((touch.clientY - offsetY) / this.cellSize);
    
    if (r >= 0 && r < 6 && c >= 0 && c < 6 && !this.grid[r][c].removed) {
      this.grid[r][c].removed = true;
      this.score += 10;
      this.updateScore(this.score);
      this.draw();
    }
  }

  cheat(action) { if (action === 'all') { this.grid.forEach(row => row.forEach(c => c.removed = true)); this.draw(); } }
  getState() { return { score: this.score }; }
  restart() { this.init(); }
}

module.exports = ClickMatch;
