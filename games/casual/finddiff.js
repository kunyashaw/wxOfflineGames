const Game = require('../base/Game');

class FindDiff extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.score = 0;
    this.diffs = [];
    this.found = [];
    this.images1 = [];
    this.images2 = [];
  }

  init() {
    this.score = 0;
    this.found = [];
    this.diffs = [
      { x: 50, y: 80, r: 20 },
      { x: 150, y: 120, r: 15 },
      { x: 250, y: 200, r: 18 },
      { x: 80, y: 250, r: 15 },
      { x: 200, y: 300, r: 20 }
    ];
    this.updateScore(0);
    this.draw();
  }

  draw() {
    this.clear();
    this.ctx.fillStyle = '#f5f6fa';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    this.ctx.fillStyle = '#ecf0f1';
    this.ctx.fillRect(20, 40, this.width - 40, this.height - 100);
    this.ctx.fillRect(this.width / 2 + 10, 40, this.width / 2 - 50, this.height - 100);
    
    this.ctx.fillStyle = '#e74c3c';
    this.ctx.font = '20px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('A', this.width / 4, 70);
    this.ctx.fillText('B', this.width * 3 / 4, 70);
    
    const items = ['🌳', '🏠', '🌲', '☁️', '🌻'];
    let idx = 0;
    for (let y = 80; y < this.height - 120; y += 60) {
      for (let x = 30; x < this.width / 2 - 30; x += 60) {
        if (idx < items.length) {
          this.ctx.font = '30px sans-serif';
          this.ctx.fillText(items[idx], x, y);
          this.ctx.fillText(items[idx], x + this.width / 2, y);
        }
        idx++;
      }
    }
    
    this.ctx.font = '14px sans-serif';
    this.ctx.fillStyle = '#2c3e50';
    this.ctx.fillText(`得分: ${this.score}  已找: ${this.found.length}/5`, this.width / 2, 25);
    
    if (this.found.length === 5) {
      this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
      this.ctx.fillRect(0, this.height / 2 - 40, this.width, 80);
      this.ctx.fillStyle = '#fff';
      this.ctx.font = '24px sans-serif';
      this.ctx.fillText('恭喜找出所有不同!', this.width / 2, this.height / 2);
    }
  }

  onTouchEnd(e) {
    if (this.found.length >= 5) return;
    const touch = e.changedTouches[0];
    
    for (const diff of this.diffs) {
      if (this.found.includes(diff)) continue;
      const dx = touch.clientX - diff.x;
      const dy = touch.clientY - diff.y;
      if (Math.sqrt(dx * dx + dy * dy) < diff.r + 20) {
        this.found.push(diff);
        this.score += 20;
        this.updateScore(this.score);
        break;
      }
    }
    this.draw();
  }

  cheat(action) {
    if (action === 'show') {
      this.found = [...this.diffs];
      this.score = 100;
      this.updateScore(100);
      this.draw();
    }
  }

  getState() { return { score: this.score }; }
  restart() { this.init(); }
}

module.exports = FindDiff;
