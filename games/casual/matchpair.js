const Game = require('../base/Game');

class MatchPair extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.icons = ['🎀','🎁','🎄','🎆','🎇','🎈','🎉','🎊','🎋','🎍','🎎','🎏'];
    this.grid = [];
    this.selected = [];
    this.score = 0;
    this.matches = 0;
    this.cellSize = Math.min(45, (this.width - 30) / 5);
    this.offsetX = (this.width - this.cellSize * 5) / 2;
    this.offsetY = 50;
  }

  init() {
    const selected = this.icons.slice(0, 8);
    const tiles = [...selected, ...selected].sort(() => Math.random() - 0.5);
    this.grid = tiles.map((icon, idx) => ({
      icon,
      idx,
      flipped: false,
      removed: false,
      x: (idx % 5) * (this.cellSize + 3),
      y: Math.floor(idx / 5) * (this.cellSize + 3)
    }));
    this.selected = [];
    this.score = 0;
    this.matches = 0;
    this.updateScore(0);
    this.draw();
  }

  draw() {
    this.clear();
    this.drawRect(0, 0, this.width, this.height, '#9b59b6');
    
    this.grid.forEach(tile => {
      if (!tile.removed) {
        this.drawRect(this.offsetX + tile.x, this.offsetY + tile.y, this.cellSize, this.cellSize, 
          tile.flipped ? '#fff' : '#8e44ad', 6);
        if (tile.flipped) {
          this.drawText(tile.icon, this.offsetX + tile.x + this.cellSize / 2, 
            this.offsetY + tile.y + this.cellSize / 2, 20);
        }
      }
    });
    
    this.drawText(`得分: ${this.score}`, 50, 25, 14, '#fff');
    this.drawText(`${this.matches}/8`, this.width - 40, 25, 14, '#fff');
    
    if (this.matches === 8) {
      this.drawRect(0, this.height / 2 - 40, this.width, 80, 'rgba(0,0,0,0.7)');
      this.drawText('恭喜通关!', this.width / 2, this.height / 2, 24, '#fff');
    }
  }

  drawRect(x, y, w, h, color, r = 0) {
    this.ctx.fillStyle = color;
    if (r > 0) {
      this.ctx.beginPath();
      this.ctx.roundRect(x, y, w, h, r);
      this.ctx.fill();
    } else {
      this.ctx.fillRect(x, y, w, h);
    }
  }

  drawText(text, x, y, size, color) {
    this.ctx.fillStyle = color;
    this.ctx.font = `${size}px sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, x, y);
  }

  onTouchEnd(e) {
    if (this.matches === 8) return;
    
    const touch = e.changedTouches[0];
    const tile = this.grid.find(t => 
      !t.removed && !t.flipped &&
      touch.clientX > this.offsetX + t.x && touch.clientX < this.offsetX + t.x + this.cellSize &&
      touch.clientY > this.offsetY + t.y && touch.clientY < this.offsetY + t.y + this.cellSize
    );
    
    if (!tile) return;
    
    tile.flipped = true;
    this.selected.push(tile);
    this.draw();
    
    if (this.selected.length === 2) {
      setTimeout(() => {
        if (this.selected[0].icon === this.selected[1].icon) {
          this.selected[0].removed = true;
          this.selected[1].removed = true;
          this.matches++;
          this.score += 20;
          this.updateScore(this.score);
        } else {
          this.selected[0].flipped = false;
          this.selected[1].flipped = false;
        }
        this.selected = [];
        this.draw();
      }, 500);
    }
  }

  cheat(action) {
    if (action === 'show') {
      this.grid.forEach(t => t.flipped = true);
      this.draw();
    }
  }

  getState() { return { score: this.score }; }
  restart() { this.init(); }
}

module.exports = MatchPair;
