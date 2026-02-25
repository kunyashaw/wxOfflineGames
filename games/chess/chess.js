const Game = require('../base/Game');

class Chess extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.boardSize = 8;
    this.cellSize = Math.min(40, (this.width - 40) / this.boardSize);
    this.offsetX = (this.width - this.cellSize * this.boardSize) / 2;
    this.offsetY = 40;
    this.board = [];
    this.turn = 'white';
    this.score = 0;
    this.pieces = { 'K': 10, 'Q': 9, 'R': 5, 'B': 3, 'N': 3, 'P': 1 };
  }

  init() {
    const setup = [
      ['R','N','B','Q','K','B','N','R'],
      ['P','P','P','P','P','P','P','P'],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['p','p','p','p','p','p','p','p'],
      ['r','n','b','q','k','b','n','r']
    ];
    this.board = setup.map(row => row.map(p => p === '' ? null : { type: p, color: p === p.toUpperCase() ? 'white' : 'black' }));
    this.turn = 'white';
    this.score = 0;
    this.updateScore(0);
    this.draw();
  }

  draw() {
    this.clear();
    this.drawRect(0, 0, this.width, this.height, '#ecf0f1');
    for (let r = 0; r < this.boardSize; r++) {
      for (let c = 0; c < this.boardSize; c++) {
        const x = this.offsetX + c * this.cellSize;
        const y = this.offsetY + r * this.cellSize;
        this.drawRect(x, y, this.cellSize, this.cellSize, (r + c) % 2 === 0 ? '#bdc3c7' : '#fff', 2);
        const p = this.board[r][c];
        if (p) {
          const cx = x + this.cellSize / 2, cy = y + this.cellSize / 2;
          const icon = { 'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙', 'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟' }[p.type];
          this.drawText(icon, cx, cy, 24, p.color === 'white' ? '#fff' : '#000', '#e74c3c');
        }
      }
    }
    this.drawText(`回合: ${this.turn === 'white' ? '白方' : '黑方'}`, this.width / 2, 20, 14, '#2c3e50');
  }

  drawRect(x, y, w, h, color, r = 0) {
    this.ctx.fillStyle = color;
    if (r > 0) { this.ctx.beginPath(); this.ctx.roundRect(x, y, w, h, r); this.ctx.fill(); }
    else this.ctx.fillRect(x, y, w, h);
  }

  drawText(text, x, y, size, color, stroke) {
    if (stroke) { this.ctx.strokeStyle = stroke; this.ctx.lineWidth = 3; this.ctx.beginPath(); this.ctx.strokeText(text, x, y); }
    this.ctx.fillStyle = color; this.ctx.font = `${size}px sans-serif`;
    this.ctx.textAlign = 'center'; this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, x, y);
  }

  onTouchEnd(e) {
    const touch = e.changedTouches[0];
    const c = Math.floor((touch.clientX - this.offsetX) / this.cellSize);
    const r = Math.floor((touch.clientY - this.offsetY) / this.cellSize);
    if (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize) {
      const p = this.board[r][c];
      if (p && p.color === this.turn) {
        this.board[r][c] = null;
        this.turn = this.turn === 'white' ? 'black' : 'white';
        this.score += 1;
        this.updateScore(this.score);
      } else if (!p) {
        this.turn = this.turn === 'white' ? 'black' : 'white';
      }
      this.draw();
    }
  }

  cheat(action) {
    if (action === 'win') { this.board.forEach(row => row.forEach((p, i) => { if (p && p.color === this.turn) row[i] = null; })); this.score = 100; this.updateScore(100); this.draw(); }
  }
  getState() { return { score: this.score }; }
  restart() { this.init(); }
}

module.exports = Chess;
