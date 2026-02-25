const Game = require('../base/Game');

class ChineseChess extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.cellSize = Math.min(38, (this.width - 40) / 9);
    this.offsetX = (this.width - this.cellSize * 9) / 2;
    this.offsetY = 30;
    this.board = [];
    this.turn = 'red';
    this.score = 0;
  }

  init() {
    const setup = [
      ['R','N','B','A','K','A','B','N','R'],
      ['','','','','','','','',''],
      ['','C','','','','','','','C'],
      ['P','','','P','','','P','',''],
      ['','','','','','','','',''],
      ['','','','','','','','',''],
      ['p','','','p','','','p','',''],
      ['','c','','','','','','','c'],
      ['','','','','','','','',''],
      ['r','n','b','a','k','a','b','n','r']
    ];
    this.board = setup.map(row => row.map(p => p === '' ? null : { type: p, color: p === p.toUpperCase() ? 'red' : 'black' }));
    this.turn = 'red';
    this.score = 0;
    this.updateScore(0);
    this.draw();
  }

  draw() {
    this.clear();
    this.drawRect(0, 0, this.width, this.height, '#deb887');
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 9; c++) {
        const x = this.offsetX + c * this.cellSize;
        const y = this.offsetY + r * this.cellSize;
        this.drawLine(x, y, x + this.cellSize, y);
        this.drawLine(x, y, x, y + this.cellSize);
      }
    }
    this.drawRect(this.offsetX + this.cellSize * 3, this.offsetY, this.cellSize * 3, this.cellSize * 5, null, 2);
    this.drawRect(this.offsetX, this.offsetY + this.cellSize * 5, this.cellSize * 9, this.cellSize * 5, null, 2);
    
    const pieces = { 'K': '帥', 'k': '將', 'R': '車', 'r': '俥', 'N': '馬', 'n': '傌', 'B': '象', 'b': '相', 'A': '士', 'a': '仕', 'C': '炮', 'c': '砲', 'P': '兵', 'p': '卒' };
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 9; c++) {
        const p = this.board[r][c];
        if (p) {
          const x = this.offsetX + c * this.cellSize;
          const y = this.offsetY + r * this.cellSize;
          this.drawCircle(x + this.cellSize / 2, y + this.cellSize / 2, this.cellSize * 0.4, p.color === 'red' ? '#c0392b' : '#2c3e50');
          this.drawText(pieces[p.type], x + this.cellSize / 2, y + this.cellSize / 2 + 2, 14, '#fff');
        }
      }
    }
    this.drawText(`回合: ${this.turn === 'red' ? '紅方' : '黑方'}`, this.width / 2, 15, 14, '#5d4037');
  }

  drawRect(x, y, w, h, color, r = 0) {
    if (color) { this.ctx.fillStyle = color; this.ctx.fillRect(x, y, w, h); }
    if (r > 0) { this.ctx.strokeStyle = '#5d4037'; this.ctx.lineWidth = 2; this.ctx.strokeRect(x, y, w, h); }
  }

  drawLine(x1, y1, x2, y2) { this.ctx.strokeStyle = '#5d4037'; this.ctx.lineWidth = 1; this.ctx.beginPath(); this.ctx.moveTo(x1, y1); this.ctx.lineTo(x2, y2); this.ctx.stroke(); }

  drawCircle(x, y, r, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath(); this.ctx.arc(x, y, r, 0, Math.PI * 2); this.ctx.fill();
  }

  drawText(text, x, y, size, color) {
    this.ctx.fillStyle = color; this.ctx.font = `bold ${size}px sans-serif`;
    this.ctx.textAlign = 'center'; this.ctx.textBaseline = 'middle'; this.ctx.fillText(text, x, y);
  }

  onTouchEnd(e) {
    const touch = e.changedTouches[0];
    const c = Math.floor((touch.clientX - this.offsetX) / this.cellSize);
    const r = Math.floor((touch.clientY - this.offsetY) / this.cellSize);
    if (r >= 0 && r < 10 && c >= 0 && c < 9) {
      const p = this.board[r][c];
      if (p && p.color === this.turn) { this.board[r][c] = null; this.turn = this.turn === 'red' ? 'black' : 'red'; this.score++; this.updateScore(this.score); }
      else if (!p) { this.turn = this.turn === 'red' ? 'black' : 'red'; }
      this.draw();
    }
  }

  cheat(action) {
    if (action === 'win') { this.board.forEach((row, r) => row.forEach((p, c) => { if (p && p.color === this.turn) row[c] = null; })); this.score = 100; this.updateScore(100); this.draw(); }
  }
  getState() { return { score: this.score }; }
  restart() { this.init(); }
}

module.exports = ChineseChess;
