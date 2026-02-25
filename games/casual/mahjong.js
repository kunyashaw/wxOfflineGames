const Game = require('../base/Game');

class MahjongMatch extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.tiles = [];
    this.selected = null;
    this.score = 0;
    this.matches = 0;
    this.tileSize = 35;
    this.mahjongChars = ['🀀','🀁','🀂','🀃','🀄','🀅','🀆','🀇','🀈','🀉','🀊','🀋','🀌','🀍','🀎','🀏','🀐','🀑','🀒','🀓','🀔','🀕','🀖','🀗','🀘','🀙','🀚','🀛','🀜','🀝','🀞','🀟'];
  }

  init() {
    const selected = this.mahjongChars.slice(0, 12);
    const tiles = [...selected, ...selected, ...selected, ...selected].sort(() => Math.random() - 0.5);
    
    this.tiles = tiles.map((char, idx) => ({
      char,
      idx,
      removed: false,
      x: (idx % 8) * (this.tileSize + 5) + 20,
      y: Math.floor(idx / 8) * (this.tileSize + 5) + 40
    }));
    
    this.selected = null;
    this.score = 0;
    this.matches = 0;
    this.updateScore(0);
    this.draw();
  }

  draw() {
    this.clear();
    this.drawRect(0, 0, this.width, this.height, '#2c3e50');
    
    this.tiles.forEach(tile => {
      if (!tile.removed) {
        const isSelected = this.selected && this.selected.idx === tile.idx;
        this.drawRect(tile.x, tile.y, this.tileSize, this.tileSize, isSelected ? '#f39c12' : '#ecf0f1', 5);
        this.drawText(tile.char, tile.x + this.tileSize / 2, tile.y + this.tileSize / 2, 20);
      }
    });
    
    this.drawText(`得分: ${this.score}`, 50, 20, 14, '#fff');
    this.drawText(`匹配: ${this.matches}/12`, this.width - 60, 20, 14, '#fff');
    
    if (this.matches === 12) {
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

  drawText(text, x, y, size, color = '#000') {
    this.ctx.fillStyle = color;
    this.ctx.font = `${size}px sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, x, y);
  }

  onTouchEnd(e) {
    if (this.matches === 12) return;
    
    const touch = e.changedTouches[0];
    const tile = this.tiles.find(t => 
      !t.removed && 
      touch.clientX > t.x && touch.clientX < t.x + this.tileSize &&
      touch.clientY > t.y && touch.clientY < t.y + this.tileSize
    );
    
    if (!tile) return;
    
    if (!this.selected) {
      this.selected = tile;
    } else if (this.selected.idx === tile.idx) {
      this.selected = null;
    } else if (this.selected.char === tile.char) {
      this.selected.removed = true;
      tile.removed = true;
      this.selected = null;
      this.matches++;
      this.score += 100;
      this.updateScore(this.score);
    } else {
      this.selected = tile;
    }
    
    this.draw();
  }

  cheat(action) {
    if (action === 'win') {
      this.tiles.forEach(t => t.removed = true);
      this.matches = 12;
      this.draw();
    }
  }

  getState() {
    return { score: this.score };
  }

  restart() {
    this.init();
  }
}

module.exports = MahjongMatch;
