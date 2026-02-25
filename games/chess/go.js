const Game = require('../base/Game');

class Go extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.boardSize = 9;
    this.cellSize = Math.min(35, (this.width - 40) / this.boardSize);
    this.offsetX = (this.width - this.cellSize * this.boardSize) / 2;
    this.offsetY = 40;
    this.board = [];
    this.turn = 1;
    this.captured = { 1: 0, 2: 0 };
    this.score = 0;
  }

  init() {
    this.board = Array(this.boardSize).fill(null).map(() => Array(this.boardSize).fill(0));
    this.turn = 1;
    this.captured = { 1: 0, 2: 0 };
    this.score = 0;
    this.updateScore(0);
    this.draw();
  }

  getGroup(r, c, color, visited = new Set()) {
    const key = `${r},${c}`;
    if (visited.has(key)) return [];
    if (r < 0 || r >= this.boardSize || c < 0 || c >= this.boardSize || this.board[r][c] !== color) return [];
    visited.add(key);
    let group = [{ r, c }];
    const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
    dirs.forEach(([dr, dc]) => { group = group.concat(this.getGroup(r + dr, c + dc, color, visited)); });
    return group;
  }

  countLiberties(group) {
    const liberties = new Set();
    group.forEach(({ r, c }) => {
      [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dr, dc]) => {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < this.boardSize && nc >= 0 && nc < this.boardSize && this.board[nr][nc] === 0) {
          liberties.add(`${nr},${nc}`);
        }
      });
    });
    return liberties.size;
  }

  removeDead(opponent) {
    let removed = 0;
    for (let r = 0; r < this.boardSize; r++) {
      for (let c = 0; c < this.boardSize; c++) {
        if (this.board[r][c] === opponent) {
          const group = this.getGroup(r, c, opponent);
          if (this.countLiberties(group) === 0) {
            group.forEach(({ r, c }) => { this.board[r][c] = 0; removed++; });
          }
        }
      }
    }
    return removed;
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
          this.drawCircle(x, y, this.cellSize * 0.45, this.board[r][c] === 1 ? '#000' : '#fff');
        }
      }
    }
    this.drawText(`黑:${this.captured[2]} 白:${this.captured[1]} ${this.turn === 1 ? '黑棋' : '白棋'}`, this.width / 2, 20, 14, '#5d4037');
  }

  drawRect(x, y, w, h, color) { this.ctx.fillStyle = color; this.ctx.fillRect(x, y, w, h); }
  drawLine(x1, y1, x2, y2) { this.ctx.strokeStyle = '#5d4037'; this.ctx.lineWidth = 1; this.ctx.beginPath(); this.ctx.moveTo(x1, y1); this.ctx.lineTo(x2, y2); this.ctx.stroke(); }
  drawCircle(x, y, r, color) { this.ctx.fillStyle = color; this.ctx.beginPath(); this.ctx.arc(x, y, r, 0, Math.PI * 2); this.ctx.fill(); if (color === '#000') { this.ctx.strokeStyle = '#000'; this.ctx.lineWidth = 1; this.ctx.stroke(); } }
  drawText(text, x, y, size, color) { this.ctx.fillStyle = color; this.ctx.font = `${size}px sans-serif`; this.ctx.textAlign = 'center'; this.ctx.fillText(text, x, y); }

  onTouchEnd(e) {
    const touch = e.changedTouches[0];
    const c = Math.round((touch.clientX - this.offsetX) / this.cellSize);
    const r = Math.round((touch.clientY - this.offsetY) / this.cellSize);
    if (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize && !this.board[r][c]) {
      this.board[r][c] = this.turn;
      const opponent = this.turn === 1 ? 2 : 1;
      this.captured[opponent] += this.removeDead(opponent);
      this.removeDead(this.turn);
      this.turn = this.turn === 1 ? 2 : 1;
      this.score = this.captured[1] + this.captured[2];
      this.updateScore(this.score);
      this.draw();
    }
  }

  cheat(action) {
    if (action === 'fill') {
      for (let r = 0; r < this.boardSize; r++) {
        for (let c = 0; c < this.boardSize; c++) {
          if (!this.board[r][c]) { this.board[r][c] = this.turn; this.draw(); return; }
        }
      }
    }
  }
  getState() { return { score: this.score }; }
  restart() { this.init(); }
}

module.exports = Go;
