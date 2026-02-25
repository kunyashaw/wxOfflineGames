const Game = require('../base/Game');

class ColorMatch extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'];
    this.targetColor = '';
    this.score = 0;
    this.round = 0;
    this.timeLeft = 0;
    this.gameOver = false;
    this.lastTap = 0;
  }

  init() {
    this.score = 0;
    this.round = 0;
    this.gameOver = false;
    this.nextRound();
    this.startTimer();
  }

  nextRound() {
    this.round++;
    this.targetColor = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.timeLeft = Math.max(10, 30 - this.round);
    this.displayColor = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.draw();
  }

  startTimer() {
    this.timer = setInterval(() => {
      if (this.gameOver) return;
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.gameOver = true;
        clearInterval(this.timer);
        this.draw();
      }
    }, 1000);
  }

  draw() {
    this.clear();
    this.drawRect(0, 0, this.width, this.height, '#1a1a2e');
    
    this.drawText(`回合: ${this.round}`, this.width / 2, 30, 18, '#fff');
    this.drawText(`分数: ${this.score}`, this.width / 2, 55, 16, '#fff');
    this.drawText(`时间: ${this.timeLeft}s`, this.width / 2, 80, 16, this.timeLeft <= 5 ? '#e74c3c' : '#fff');
    
    this.drawText('匹配颜色:', this.width / 2, 120, 16, '#ccc');
    this.drawRect(this.width / 2 - 40, 140, 80, 80, this.targetColor, 10);
    
    this.drawText('显示颜色:', this.width / 2, 260, 16, '#ccc');
    this.drawRect(this.width / 2 - 40, 280, 80, 80, this.displayColor, 10);
    
    this.drawText('是 否 相 同 ?', this.width / 2, 390, 20, '#fff');
    
    const btnW = 100, btnH = 40, btnY = 420;
    this.drawRect(this.width / 2 - btnW - 10, btnY, btnW, btnH, '#2ecc71', 8);
    this.drawText('相同', this.width / 2 - btnW / 2 - 10, btnY + btnH / 2, 16, '#fff');
    
    this.drawRect(this.width / 2 + 10, btnY, btnW, btnH, '#e74c3c', 8);
    this.drawText('不同', this.width / 2 + btnW / 2 + 10, btnY + btnH / 2, 16, '#fff');
    
    if (this.gameOver) {
      this.drawRect(0, this.height / 2 - 50, this.width, 100, 'rgba(0,0,0,0.8)');
      this.drawText('游戏结束!', this.width / 2, this.height / 2 - 10, 28, '#fff');
      this.drawText(`最终得分: ${this.score}`, this.width / 2, this.height / 2 + 25, 20, '#fff');
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
    if (this.gameOver) return;
    
    const now = Date.now();
    if (now - this.lastTap < 300) return;
    this.lastTap = now;
    
    const touch = e.changedTouches[0];
    const btnW = 100, btnH = 40, btnY = 420;
    
    if (touch.clientY > btnY && touch.clientY < btnY + btnH) {
      if (touch.clientX < this.width / 2) {
        this.check(true);
      } else {
        this.check(false);
      }
    }
  }

  check(selectedSame) {
    const isSame = this.targetColor === this.displayColor;
    if (selectedSame === isSame) {
      this.score += 10 + Math.floor(this.timeLeft / 2);
      this.updateScore(this.score);
    } else {
      this.gameOver = true;
      clearInterval(this.timer);
    }
    this.nextRound();
  }

  cheat(action) {
    if (action === 'slow') {
      this.timeLeft += 10;
      this.draw();
    }
  }

  getState() {
    return { score: this.score, round: this.round };
  }

  restart() {
    clearInterval(this.timer);
    this.init();
  }
}

module.exports = ColorMatch;
