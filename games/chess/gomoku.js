const Game = require('../base/Game');

class Gomoku extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.boardSize = 15;
    this.cellSize = Math.min(22, (this.width - 40) / this.boardSize);
    this.offsetX = (this.width - this.cellSize * this.boardSize) / 2;
    this.offsetY = 40;
    this.board = [];
    this.currentPlayer = 1;
    this.winner = null;
    this.score = 0;
  }

  init() {
    this.board = Array(this.boardSize).fill(null).map(() => Array(this.boardSize).fill(0));
    this.currentPlayer = 1;
    this.winner = null;
    this.score = 0;
    this.updateScore(0);
    this.draw();
  }

  checkWin(row, col) {
    const player = this.board[row][col];
    const directions = [[1,0],[0,1],[1,1],[1,-1]];
    for (const [dr, dc] of directions) {
      let count = 1;
      for (let i = 1; i < 5; i++) {
        const r = row + dr * i, c = col + dc * i;
        if (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize && this.board[r][c] === player) count++;
        else break;
      }
      for (let i = 1; i < 5; i++) {
        const r = row - dr * i, c = col - dc * i;
        if (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize && this.board[r][c] === player) count++;
        else break;
      }
      if (count >= 5) return player;
    }
    return null;
  }

  draw() {
    this.clear();
    this.drawRect(0, 0, this.width, this.height, '#deb887');
    
    for (let i = 0; i < this.boardSize; i++) {
      const x = this.offsetX + i * this.cellSize;
      this.drawLine(x, this.offsetY, x, this.offsetY + (this.boardSize - 1) * this.cellSize);
      const y = this.offsetY + i * this.cellSize;
      this.drawLine(this.offsetX, y, this.offsetX + (this.boardSize - 1) * this.cellSize, y);
    }
    
    for (let r = 0; r < this.boardSize; r++) {
      for (let c = 0; c < this.boardSize; c++) {
        if (this.board[r][c]) {
          const x = this.offsetX + c * this.cellSize;
          const y = this.offsetY + r * this.cellSize;
          this.drawCircle(x, y, this.cellSize * 0.4, this.board[r][c] === 1 ? '#000' : '#fff');
        }
      }
    }
    
    const status = this.winner ? (this.winner === 1 ? '黑棋获胜!' : '白棋获胜!') : (this.currentPlayer === 1 ? '黑棋回合' : '白棋回合');
    this.drawText(status, this.width / 2, 20, 14, '#5d4037');
  }

  drawRect(x, y, w, h, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, w, h);
  }

  drawLine(x1, y1, x2, y2) {
    this.ctx.strokeStyle = '#5d4037';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  drawCircle(x, y, r, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI * 2);
    this.ctx.fill();
    if (color === '#000') {
      this.ctx.strokeStyle = '#000';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }
  }

  drawText(text, x, y, size, color) {
    this.ctx.fillStyle = color;
    this.ctx.font = `${size}px sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.fillText(text, x, y);
  }

  onTouchEnd(e) {
    if (this.winner) return;
    const touch = e.changedTouches[0];
    const col = Math.round((touch.clientX - this.offsetX) / this.cellSize);
    const row = Math.round((touch.clientY - this.offsetY) / this.cellSize);
    
    if (row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize && !this.board[row][col]) {
      this.board[row][col] = this.currentPlayer;
      this.winner = this.checkWin(row, col);
      if (this.winner) {
        this.score = 100;
        this.updateScore(100);
      }
      this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
      this.draw();
    }
  }

  cheat(action) {
    if (action === 'win') {
      for (let r = 0; r < this.boardSize; r++) {
        for (let c = 0; c < this.boardSize; c++) {
          if (!this.board[r][c]) {
            this.board[r][c] = this.currentPlayer;
            if (this.checkWin(r, c)) {
              this.winner = this.currentPlayer;
              this.draw();
              return;
            }
            this.board[r][c] = 0;
          }
        }
      }
    }
  }

  getState() { return { score: this.score }; }
  restart() { this.init(); }
}

module.exports = Gomoku;
