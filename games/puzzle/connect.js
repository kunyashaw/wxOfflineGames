const Game = require('../base/Game');

class Connect extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.numbers = [];
    this.connections = [];
    this.currentPath = [];
    this.completed = [];
    this.cellSize = 45;
    this.offsetX = (this.width - this.cellSize * 4) / 2;
    this.offsetY = 50;
    this.score = 0;
  }

  init() {
    const nums = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
    this.numbers = nums.sort(() => Math.random() - 0.5).map((n, i) => ({
      num: n,
      row: Math.floor(i / 4),
      col: i % 4,
      connected: false
    }));
    this.connections = [];
    this.currentPath = [];
    this.completed = [];
    this.score = 0;
    this.updateScore(0);
    this.draw();
  }

  draw() {
    this.clear();
    this.drawRect(0, 0, this.width, this.height, '#1a1a2e');
    
    this.connections.forEach(conn => {
      if (conn.from && conn.to) {
        const x1 = this.offsetX + conn.from.col * this.cellSize + this.cellSize / 2;
        const y1 = this.offsetY + conn.from.row * this.cellSize + this.cellSize / 2;
        const x2 = this.offsetX + conn.to.col * this.cellSize + this.cellSize / 2;
        const y2 = this.offsetY + conn.to.row * this.cellSize + this.cellSize / 2;
        
        this.ctx.strokeStyle = '#2ecc71';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
      }
    });
    
    this.numbers.forEach(n => {
      const x = this.offsetX + n.col * this.cellSize;
      const y = this.offsetY + n.row * this.cellSize;
      const color = n.connected ? '#27ae60' : '#3498db';
      
      this.drawRect(x + 2, y + 2, this.cellSize - 4, this.cellSize - 4, color, 8);
      this.drawText(n.num, x + this.cellSize / 2, y + this.cellSize / 2, 20, '#fff');
    });
    
    if (this.checkWin()) {
      this.drawRect(0, this.height / 2 - 40, this.width, 80, 'rgba(0,0,0,0.7)');
      this.drawText('恭喜通关!', this.width / 2, this.height / 2, 24, '#fff');
    }
  }

  drawRect(x, y, w, h, color, r = 0) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, w, h, r);
    this.ctx.fill();
  }

  drawText(text, x, y, size, color) {
    this.ctx.fillStyle = color;
    this.ctx.font = `bold ${size}px sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, x, y);
  }

  onTouchStart(e) {
    const touch = e.changedTouches[0];
    const num = this.getNumberAt(touch.clientX, touch.clientY);
    
    if (num && !num.connected) {
      const matching = this.numbers.find(n => n.num === num.num && n !== num && !n.connected);
      if (matching) {
        this.currentPath = [num, matching];
        num.connected = true;
        matching.connected = true;
        this.completed.push({ from: num, to: matching, num: num.num });
        this.score += 10;
        this.updateScore(this.score);
      }
      this.draw();
    }
  }

  getNumberAt(x, y) {
    const col = Math.floor((x - this.offsetX) / this.cellSize);
    const row = Math.floor((y - this.offsetY) / this.cellSize);
    return this.numbers.find(n => n.row === row && n.col === col);
  }

  checkWin() {
    return this.completed.length === 8;
  }

  cheat(action) {
    if (action === 'solve') {
      for (let i = 1; i <= 8; i++) {
        const pair = this.numbers.filter(n => n.num === i);
        if (pair.length === 2) {
          pair[0].connected = true;
          pair[1].connected = true;
          this.completed.push({ from: pair[0], to: pair[1], num: i });
        }
      }
      this.score = 80;
      this.updateScore(this.score);
      this.draw();
    }
  }

  getState() {
    return { score: this.score, completed: this.completed.length };
  }

  restart() {
    this.init();
  }
}

module.exports = Connect;
