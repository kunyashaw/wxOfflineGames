const Game = require('../base/Game');

class TicTacToe extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.board = ['', '', '', '', '', '', '', '', ''];
    this.currentPlayer = 'X';
    this.winner = null;
    this.score = 0;
    this.cellSize = Math.min(80, (this.width - 40) / 3);
    this.offsetX = (this.width - this.cellSize * 3) / 2;
    this.offsetY = 60;
  }

  init() {
    this.board = ['', '', '', '', '', '', '', '', ''];
    this.currentPlayer = 'X';
    this.winner = null;
    this.score = 0;
    this.updateScore(0);
    this.draw();
  }

  checkWin() {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (const [a,b,c] of wins) {
      if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
        return this.board[a];
      }
    }
    if (!this.board.includes('')) return 'D';
    return null;
  }

  draw() {
    this.clear();
    this.drawRect(0, 0, this.width, this.height, '#ecf0f1');
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const x = this.offsetX + j * this.cellSize;
        const y = this.offsetY + i * this.cellSize;
        this.drawRect(x, y, this.cellSize, this.cellSize, '#fff', 2);
        this.drawRect(x, y, this.cellSize, 2, '#bdc3c7');
        this.drawRect(x, y, 2, this.cellSize, '#bdc3c7');
        
        const idx = i * 3 + j;
        if (this.board[idx]) {
          const color = this.board[idx] === 'X' ? '#3498db' : '#e74c3c';
          this.drawText(this.board[idx], x + this.cellSize / 2, y + this.cellSize / 2, 36, color);
        }
      }
    }
    
    this.drawRect(this.offsetX, this.offsetY + this.cellSize * 3, this.cellSize * 3, 2, '#bdc3c7');
    for (let j = 1; j < 3; j++) {
      this.drawRect(this.offsetX + j * this.cellSize, this.offsetY, 2, this.cellSize * 3, '#bdc3c7');
    }
    
    const status = this.winner ? (this.winner === 'D' ? '平局!' : `${this.winner}获胜!`) : `当前: ${this.currentPlayer}`;
    this.drawText(status, this.width / 2, 30, 18, this.winner ? '#27ae60' : '#2c3e50');
  }

  drawRect(x, y, w, h, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, w, h);
  }

  drawText(text, x, y, size, color) {
    this.ctx.fillStyle = color;
    this.ctx.font = `bold ${size}px sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, x, y);
  }

  onTouchEnd(e) {
    if (this.winner) return;
    
    const touch = e.changedTouches[0];
    const col = Math.floor((touch.clientX - this.offsetX) / this.cellSize);
    const row = Math.floor((touch.clientY - this.offsetY) / this.cellSize);
    const idx = row * 3 + col;
    
    if (row >= 0 && row < 3 && col >= 0 && col < 3 && !this.board[idx]) {
      this.board[idx] = this.currentPlayer;
      this.winner = this.checkWin();
      if (!this.winner) {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
      } else if (this.winner !== 'D') {
        this.score = this.currentPlayer === 'O' ? 100 : 50;
        this.updateScore(this.score);
      }
      this.draw();
    }
  }

  cheat(action) {
    if (action === 'win') {
      this.board = ['X','X','X','','','','','',''];
      this.winner = 'X';
      this.score = 100;
      this.updateScore(100);
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

module.exports = TicTacToe;
