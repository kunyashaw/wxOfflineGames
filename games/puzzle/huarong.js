const Game = require('../base/Game');

class Huarong extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.cellWidth = Math.min(40, (this.width - 20) / 5);
    this.cellHeight = Math.min(50, (this.height - 80) / 4);
    this.offsetX = (this.width - this.cellWidth * 5) / 2;
    this.offsetY = 50;
    this.blocks = [];
    this.selected = null;
    this.score = 0;
    this.moves = 0;
  }

  init() {
    this.blocks = [
      { x: 0, y: 0, w: 2, h: 2, type: 'boss', name: '曹操' },
      { x: 2, y: 0, w: 1, h: 2, type: 'tall', name: '关羽' },
      { x: 3, y: 0, w: 1, h: 2, type: 'tall', name: '张飞' },
      { x: 0, y: 2, w: 1, h: 2, type: 'tall', name: '赵云' },
      { x: 1, y: 2, w: 1, h: 2, type: 'tall', name: '马超' },
      { x: 2, y: 2, w: 1, h: 1, type: 'small', name: '黄忠' },
      { x: 3, y: 2, w: 1, h: 1, type: 'small', name: '魏延' },
      { x: 4, y: 2, w: 1, h: 2, type: 'tall', name: '黄盖' },
      { x: 2, y: 3, w: 1, h: 1, type: 'small', name: '兵1' },
      { x: 3, y: 3, w: 1, h: 1, type: 'small', name: '兵2' },
      { x: 0, y: 3, w: 2, h: 1, type: 'horiz', name: '兵3' },
    ];
    this.targetY = 2;
    this.score = 0;
    this.moves = 0;
    this.updateScore(0);
    this.draw();
  }

  draw() {
    this.clear();
    this.drawRect(0, 0, this.width, this.height, '#f5f6fa');
    this.drawRect(this.offsetX - 5, this.offsetY - 5, this.cellWidth * 5 + 10, this.cellHeight * 4 + 10, '#333', 2);
    
    this.blocks.forEach(block => {
      const x = this.offsetX + block.x * this.cellWidth;
      const y = this.offsetY + block.y * this.cellHeight;
      const w = block.w * this.cellWidth - 2;
      const h = block.h * this.cellHeight - 2;
      
      const colors = { boss: '#e74c3c', tall: '#3498db', small: '#2ecc71', horiz: '#f39c12' };
      this.drawRect(x + 1, y + 1, w, h, colors[block.type], 4);
      this.drawText(block.name, x + w / 2, y + h / 2, 10, '#fff');
    });
    
    if (this.checkWin()) {
      this.drawRect(0, this.height / 2 - 40, this.width, 80, 'rgba(0,0,0,0.7)');
      this.drawText('恭喜通关!', this.width / 2, this.height / 2, 24, '#fff');
    }
  }

  drawRect(x, y, w, h, color, lw = 0) {
    if (lw > 0) {
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = lw;
      this.ctx.strokeRect(x, y, w, h);
    }
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, w, h, 4);
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
    const x = e.changedTouches[0].clientX;
    const y = e.changedTouches[0].clientY;
    this.selected = this.getBlockAt(x, y);
  }

  onTouchEnd(e) {
    if (!this.selected) return;
    
    const x = e.changedTouches[0].clientX;
    const y = e.changedTouches[0].clientY;
    const dx = x - (this.offsetX + this.selected.x * this.cellWidth + this.selected.w * this.cellWidth / 2);
    const dy = y - (this.offsetY + this.selected.y * this.cellHeight + this.selected.h * this.cellHeight / 2);
    
    let moveX = 0, moveY = 0;
    if (Math.abs(dx) > Math.abs(dy)) {
      moveX = dx > 0 ? 1 : -1;
    } else {
      moveY = dy > 0 ? 1 : -1;
    }
    
    this.moveBlock(this.selected, moveX, moveY);
    this.selected = null;
  }

  getBlockAt(x, y) {
    const col = Math.floor((x - this.offsetX) / this.cellWidth);
    const row = Math.floor((y - this.offsetY) / this.cellHeight);
    return this.blocks.find(b => col >= b.x && col < b.x + b.w && row >= b.y && row < b.y + b.h);
  }

  moveBlock(block, dx, dy) {
    const nx = block.x + dx;
    const ny = block.y + dy;
    
    if (nx < 0 || ny < 0 || nx + block.w > 5 || ny + block.h > 4) return;
    
    const occupied = this.blocks.some(b => b !== block && 
      nx < b.x + b.w && nx + block.w > b.x && ny < b.y + b.h && ny + block.h > b.y);
    
    if (!occupied) {
      block.x = nx;
      block.y = ny;
      this.moves++;
      this.score = this.moves;
      this.updateScore(this.score);
      this.draw();
    }
  }

  checkWin() {
    const boss = this.blocks.find(b => b.type === 'boss');
    return boss && boss.y === this.targetY;
  }

  cheat(action) {
    if (action === 'skip') {
      const boss = this.blocks.find(b => b.type === 'boss');
      if (boss) {
        boss.y = this.targetY;
        this.draw();
      }
    }
  }

  getState() {
    return { score: this.score, moves: this.moves };
  }

  restart() {
    this.init();
  }
}

module.exports = Huarong;
