const Game = require('../base/Game');

class Memory extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.gridSize = 4;
    this.icons = ['🍎', '🍊', '🍇', '🍌', '🍒', '🥝', '🍍', '🥭'];
    this.cards = [];
    this.flipped = [];
    this.matched = 0;
    this.cellSize = Math.min(60, (this.width - 40) / this.gridSize);
    this.offsetX = (this.width - this.cellSize * this.gridSize) / 2;
    this.offsetY = 50;
    this.canFlip = true;
  }

  init() {
    const selected = this.icons.slice(0, (this.gridSize * this.gridSize) / 2);
    this.cards = [...selected, ...selected].sort(() => Math.random() - 0.5);
    this.flipped = [];
    this.matched = 0;
    this.canFlip = true;
    this.score = 0;
    this.updateScore(0);
    this.draw();
  }

  draw() {
    this.clear();
    this.drawRect(0, 0, this.width, this.height, '#f5f6fa');
    
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        const idx = i * this.gridSize + j;
        const x = this.offsetX + j * this.cellSize;
        const y = this.offsetY + i * this.cellSize;
        const isFlipped = this.flipped.includes(idx) || this.isMatched(idx);
        
        this.drawRect(x + 2, y + 2, this.cellSize - 4, this.cellSize - 4, isFlipped ? '#fff' : '#3498db', 8);
        
        if (isFlipped) {
          this.drawText(this.cards[idx], x + this.cellSize / 2, y + this.cellSize / 2, 24);
        }
      }
    }
    
    if (this.matched === this.gridSize * this.gridSize / 2) {
      this.drawRect(0, this.height / 2 - 40, this.width, 80, 'rgba(0,0,0,0.7)');
      this.drawText('恭喜通关!', this.width / 2, this.height / 2, 24, '#fff');
    }
  }

  isMatched(idx) {
    const icon = this.cards[idx];
    return this.cards.filter((c, i) => c === icon && this.flipped.includes(i)).length === 2;
  }

  drawRect(x, y, w, h, color, r = 0) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, w, h, r);
    this.ctx.fill();
  }

  drawText(text, x, y, size, color = '#333') {
    this.ctx.font = `${size}px sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, x, y);
  }

  onTouchEnd(e) {
    if (!this.canFlip || this.matched === this.gridSize * this.gridSize / 2) return;
    
    const touch = e.changedTouches[0];
    const col = Math.floor((touch.clientX - this.offsetX) / this.cellSize);
    const row = Math.floor((touch.clientY - this.offsetY) / this.cellSize);
    
    if (row >= 0 && row < this.gridSize && col >= 0 && col < this.gridSize) {
      const idx = row * this.gridSize + col;
      if (!this.flipped.includes(idx) && this.flipped.length < 2) {
        this.flipped.push(idx);
        this.draw();
        
        if (this.flipped.length === 2) {
          this.canFlip = false;
          setTimeout(() => this.checkMatch(), 500);
        }
      }
    }
  }

  checkMatch() {
    const [i1, i2] = this.flipped;
    if (this.cards[i1] === this.cards[i2]) {
      this.matched++;
      this.score += 10;
      this.updateScore(this.score);
    }
    this.flipped = [];
    this.canFlip = true;
    this.draw();
  }

  cheat(action) {
    if (action === 'reveal') {
      for (let i = 0; i < this.cards.length; i++) {
        this.flipped.push(i);
      }
      this.draw();
    }
  }

  getState() {
    return { score: this.score, matched: this.matched };
  }

  restart() {
    this.init();
  }
}

module.exports = Memory;
