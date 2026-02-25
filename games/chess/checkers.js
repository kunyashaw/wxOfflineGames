const Game = require('../base/Game');

class Checkers extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.boardSize = 8;
    this.cellSize = Math.min(40, (this.width - 40) / this.boardSize);
    this.offsetX = (this.width - this.cellSize * this.boardSize) / 2;
    this.offsetY = 40;
    this.board = [];
    this.turn = 1;
    this.selected = null;
    this.score = 0;
  }

  init() {
    this.board = Array(this.boardSize).fill(null).map((_, r) => 
      Array(this.boardSize).fill(0).map((_, c) => 
        (r < 3 && (r + c) % 2 === 1) ? 1 : (r > 4 && (r + c) % 2 === 1) ? 2 : 0
      )
    );
    this.turn = 1;
    this.selected = null;
    this.score = 0;
    this.updateScore(0);
    this.draw();
  }

  getValidMoves(r, c, player) {
    const moves = [];
    const dirs = player === 1 ? [[1,-1],[1,1]] : [[-1,-1],[-1,1]];
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < this.boardSize && nc >= 0 && nc < this.boardSize && !this.board[nr][nc]) {
        moves.push({ r: nr, c: nc, jump: false });
      }
      const jr = r + dr * 2, jc = c + dc * 2;
      if (jr >= 0 && jr < this.boardSize && jc >= 0 && jc < this.boardSize && 
          this.board[jr][jc] === 0 && this.board[nr][nc] && this.board[nr][nc] !== player) {
        moves.push({ r: jr, c: jc, jump: true });
      }
    }
    return moves;
  }

  draw() {
    this.clear();
    this.drawRect(0, 0, this.width, this.height, '#ecf0f1');
    for (let r = 0; r < this.boardSize; r++) {
      for (let c = 0; c < this.boardSize; c++) {
        const x = this.offsetX + c * this.cellSize;
        const y = this.offsetY + r * this.cellSize;
        this.drawRect(x, y, this.cellSize, this.cellSize, (r + c) % 2 === 0 ? '#bdc3c7' : '#fff', 2);
        if (this.board[r][c]) {
          const cx = x + this.cellSize / 2, cy = y + this.cellSize / 2;
          this.drawCircle(cx, cy, this.cellSize * 0.35, this.board[r][c] === 1 ? '#e74c3c' : '#2c3e50');
          if (this.selected && this.selected.r === r && this.selected.c === c) {
            this.drawCircle(cx, cy, this.cellSize * 0.4, null, '#f1c40f');
          }
        }
      }
    }
    this.drawText(`回合: ${this.turn === 1 ? '红方' : '黑方'}`, this.width / 2, 20, 14, '#2c3e50');
  }

  drawRect(x, y, w, h, color, r = 0) {
    this.ctx.fillStyle = color;
    if (r > 0) { this.ctx.beginPath(); this.ctx.roundRect(x, y, w, h, r); this.ctx.fill(); }
    else this.ctx.fillRect(x, y, w, h);
  }

  drawCircle(x, y, r, color, stroke = null) {
    if (stroke) {
      this.ctx.strokeStyle = stroke;
      this.ctx.lineWidth = 3;
      this.ctx.beginPath(); this.ctx.arc(x, y, r, 0, Math.PI * 2); this.ctx.stroke();
    }
    if (color) {
      this.ctx.fillStyle = color;
      this.ctx.beginPath(); this.ctx.arc(x, y, r, 0, Math.PI * 2); this.ctx.fill();
    }
  }

  drawText(text, x, y, size, color) {
    this.ctx.fillStyle = color; this.ctx.font = `bold ${size}px sans-serif`;
    this.ctx.textAlign = 'center'; this.ctx.fillText(text, x, y);
  }

  onTouchEnd(e) {
    const touch = e.changedTouches[0];
    const c = Math.floor((touch.clientX - this.offsetX) / this.cellSize);
    const r = Math.floor((touch.clientY - this.offsetY) / this.cellSize);
    if (r < 0 || r >= this.boardSize || c < 0 || c >= this.boardSize) return;
    
    if (this.selected) {
      const moves = this.getValidMoves(this.selected.r, this.selected.c, this.turn);
      const move = moves.find(m => m.r === r && m.c === c);
      if (move) {
        if (move.jump) {
          this.board[(this.selected.r + r) / 2][(this.selected.c + c) / 2] = 0;
        }
        this.board[r][c] = this.turn;
        this.board[this.selected.r][this.selected.c] = 0;
        this.turn = this.turn === 1 ? 2 : 1;
        this.score += 10;
        this.updateScore(this.score);
      }
      this.selected = null;
    } else if (this.board[r][c] === this.turn) {
      this.selected = { r, c };
    }
    this.draw();
  }

  cheat(action) {
    if (action === 'win') {
      this.board = this.board.map(row => row.map(c => c === this.turn ? this.turn : 0));
      this.score = 100;
      this.updateScore(100);
      this.draw();
    }
  }
  getState() { return { score: this.score }; }
  restart() { this.init(); }
}

module.exports = Checkers;
