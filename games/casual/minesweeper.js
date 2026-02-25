const Game = require('../base/Game');

class Minesweeper extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.rows = 10;
    this.cols = 10;
    this.mines = 12;
    this.cells = [];
    this.revealed = [];
    this.flagged = [];
    this.gameOver = false;
    this.score = 0;
    this.cellSize = Math.min(32, (this.width - 20) / this.cols);
    this.offsetX = (this.width - this.cols * this.cellSize) / 2;
    this.offsetY = 40;
  }

  init() {
    this.cells = Array(this.rows).fill(null).map(() => Array(this.cols).fill(0));
    this.revealed = Array(this.rows).fill(null).map(() => Array(this.cols).fill(false));
    this.flagged = Array(this.rows).fill(null).map(() => Array(this.cols).fill(false));
    this.gameOver = false;
    this.score = 0;
    
    let placed = 0;
    while (placed < this.mines) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.cols);
      if (this.cells[r][c] !== -1) {
        this.cells[r][c] = -1;
        placed++;
      }
    }
    
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.cells[r][c] !== -1) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr, nc = c + dc;
              if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols && this.cells[nr][nc] === -1) {
                count++;
              }
            }
          }
          this.cells[r][c] = count;
        }
      }
    }
    
    this.updateScore(0);
    this.draw();
  }

  reveal(r, c) {
    if (r < 0 || r >= this.rows || c < 0 || c >= this.cols || this.revealed[r][c] || this.flagged[r][c]) {
      return;
    }
    
    this.revealed[r][c] = true;
    
    if (this.cells[r][c] === -1) {
      this.gameOver = true;
      this.revealed = this.cells.map(row => row.map(() => true));
      this.draw();
      return;
    }
    
    if (this.cells[r][c] === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          this.reveal(r + dr, c + dc);
        }
      }
    }
    
    this.score += this.cells[r][c] > 0 ? this.cells[r][c] : 1;
    this.updateScore(this.score);
    this.checkWin();
    this.draw();
  }

  checkWin() {
    let revealedCount = 0;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.revealed[r][c]) revealedCount++;
      }
    }
    if (revealedCount === this.rows * this.cols - this.mines) {
      this.gameOver = true;
    }
  }

  draw() {
    this.clear();
    this.drawRect(0, 0, this.width, this.height, '#ecf0f1');
    
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const x = this.offsetX + c * this.cellSize;
        const y = this.offsetY + r * this.cellSize;
        
        if (this.revealed[r][c]) {
          this.drawRect(x, y, this.cellSize - 1, this.cellSize - 1, '#bdc3c7');
          if (this.cells[r][c] > 0) {
            const colors = ['', '#3498db', '#2ecc71', '#e74c3c', '#9b59b6', '#f39c12', '#1abc9c', '#34495e'];
            this.drawText(this.cells[r][c], x + this.cellSize / 2, y + this.cellSize / 2, 14, colors[this.cells[r][c]] || '#000');
          } else if (this.cells[r][c] === -1) {
            this.drawText('💣', x + this.cellSize / 2, y + this.cellSize / 2, 14);
          }
        } else {
          this.drawRect(x, y, this.cellSize - 1, this.cellSize - 1, '#95a5a6');
          if (this.flagged[r][c]) {
            this.drawText('🚩', x + this.cellSize / 2, y + this.cellSize / 2, 14);
          }
        }
      }
    }
    
    this.drawText(`得分: ${this.score}`, 50, 20, 14, '#2c3e50');
    
    if (this.gameOver) {
      this.drawRect(0, this.height / 2 - 40, this.width, 80, 'rgba(0,0,0,0.7)');
      this.drawText(this.score >= (this.rows * this.cols - this.mines) ? '恭喜获胜!' : '游戏结束', 
        this.width / 2, this.height / 2, 20, '#fff');
    }
  }

  drawRect(x, y, w, h, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, w, h);
  }

  drawText(text, x, y, size, color = '#000') {
    this.ctx.fillStyle = color;
    this.ctx.font = `${size}px sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, x, y);
  }

  onTouchEnd(e) {
    if (this.gameOver) return;
    
    const touch = e.changedTouches[0];
    const c = Math.floor((touch.clientX - this.offsetX) / this.cellSize);
    const r = Math.floor((touch.clientY - this.offsetY) / this.cellSize);
    
    if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
      if (!this.revealed[r][c]) {
        this.flagged[r][c] = !this.flagged[r][c];
        this.draw();
      }
    }
  }

  cheat(action) {
    if (action === 'show') {
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          if (this.cells[r][c] === -1) {
            this.flagged[r][c] = true;
          }
        }
      }
      this.draw();
    }
  }

  getState() {
    return { score: this.score };
  }

  restart() {
    this.init();
  }
}

module.exports = Minesweeper;
