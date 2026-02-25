const Game = require('../base/Game');

class Reversi extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.boardSize = 8;
    this.cellSize = Math.min(40, (this.width - 40) / this.boardSize);
    this.offsetX = (this.width - this.cellSize * this.boardSize) / 2;
    this.offsetY = 40;
    this.board = [];
    this.currentPlayer = 1;
    this.score = 0;
  }

  init() {
    this.board = Array(this.boardSize).fill(null).map(() => Array(this.boardSize).fill(0));
    this.board[3][3] = 2; this.board[3][4] = 1;
    this.board[4][3] = 1; this.board[4][4] = 2;
    this.currentPlayer = 1;
    this.score = 0;
    this.updateScore(0);
    this.draw();
  }

  getValidMoves(player) {
    const moves = [];
    const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    for (let r = 0; r < this.boardSize; r++) {
      for (let c = 0; c < this.boardSize; c++) {
        if (this.board[r][c]) continue;
        for (const [dr, dc] of dirs) {
          let captured = 0;
          let nr = r + dr, nc = c + dc;
          while (nr >= 0 && nr < this.boardSize && nc >= 0 && nc < this.boardSize && this.board[nr][nc] === (player === 1 ? 2 : 1)) {
            captured++;
            nr += dr; nc += dc;
          }
          if (captured > 0 && nr >= 0 && nr < this.boardSize && nc >= 0 && nc < this.boardSize && this.board[nr][nc] === player) {
            moves.push({ r, c });
            break;
          }
        }
      }
    }
    return moves;
  }

  flip(r, c, player) {
    const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    let flipped = 0;
    for (const [dr, dc] of dirs) {
      let pieces = [];
      let nr = r + dr, nc = c + dc;
      while (nr >= 0 && nr < this.boardSize && nc >= 0 && nc < this.boardSize && this.board[nr][nc] === (player === 1 ? 2 : 1)) {
        pieces.push({ r: nr, c: nc });
        nr += dr; nc += dc;
      }
      if (pieces.length > 0 && nr >= 0 && nr < this.boardSize && nc >= 0 && nc < this.boardSize && this.board[nr][nc] === player) {
        pieces.forEach(p => { this.board[p.r][p.c] = player; flipped++; });
      }
    }
    return flipped;
  }

  draw() {
    this.clear();
    this.drawRect(0, 0, this.width, this.height, '#27ae60');
    for (let r = 0; r < this.boardSize; r++) {
      for (let c = 0; c < this.boardSize; c++) {
        const x = this.offsetX + c * this.cellSize;
        const y = this.offsetY + r * this.cellSize;
        this.drawRect(x, y, this.cellSize, this.cellSize, '#1e8449', 2);
        if (this.board[r][c]) {
          this.drawCircle(x + this.cellSize / 2, y + this.cellSize / 2, this.cellSize * 0.4, this.board[r][c] === 1 ? '#000' : '#fff');
        }
      }
    }
    const black = this.board.flat().filter(x => x === 1).length;
    const white = this.board.flat().filter(x => x === 2).length;
    this.drawText(`黑:${black} 白:${white} ${this.currentPlayer === 1 ? '黑棋' : '白棋'}回合`, this.width / 2, 20, 14, '#fff');
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
    this.ctx.fillStyle = color; this.ctx.font = `${size}px sans-serif`;
    this.ctx.textAlign = 'center'; this.ctx.fillText(text, x, y);
  }

  onTouchEnd(e) {
    const touch = e.changedTouches[0];
    const c = Math.floor((touch.clientX - this.offsetX) / this.cellSize);
    const r = Math.floor((touch.clientY - this.offsetY) / this.cellSize);
    if (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize && !this.board[r][c]) {
      const flipped = this.flip(r, c, this.currentPlayer);
      if (flipped > 0) {
        this.board[r][c] = this.currentPlayer;
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.score = this.board.flat().filter(x => x === this.currentPlayer).length * 10;
        this.updateScore(this.score);
        this.draw();
      }
    }
  }

  cheat(action) {
    if (action === 'win') {
      for (let r = 0; r < this.boardSize; r++) {
        for (let c = 0; c < this.boardSize; c++) {
          if (!this.board[r][c]) { this.board[r][c] = this.currentPlayer; this.draw(); return; }
        }
      }
    }
  }
  getState() { return { score: this.score }; }
  restart() { this.init(); }
}

module.exports = Reversi;
