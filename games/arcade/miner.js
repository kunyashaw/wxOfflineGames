const Game = require('../base/Game');

class Miner extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.player = { x: 0, y: 0, w: 24, h: 24 };
    this.gold = [];
    this.rocks = [];
    this.score = 0;
    this.gameOver = false;
    this.dy = 0;
    this.onGround = false;
  }

  init() {
    this.player.x = this.width / 2;
    this.player.y = 50;
    this.dy = 0;
    this.gold = [];
    this.rocks = [];
    this.score = 0;
    this.gameOver = false;
    
    for (let i = 0; i < 20; i++) {
      this.gold.push({
        x: Math.random() * (this.width - 20),
        y: 100 + Math.random() * (this.height - 150),
        r: 10
      });
    }
    for (let i = 0; i < 10; i++) {
      this.rocks.push({
        x: Math.random() * (this.width - 30),
        y: 100 + Math.random() * (this.height - 150),
        w: 30,
        h: 25
      });
    }
    
    this.startLoop();
    this.updateScore(0);
    this.draw();
  }

  update() {
    if (this.gameOver) return;
    
    this.dy += 0.4;
    this.player.y += this.dy;
    
    if (this.player.y > this.height - 40) {
      this.player.y = this.height - 40;
      this.dy = -8;
    }
    
    this.gold = this.gold.filter(g => {
      const dx = this.player.x - g.x;
      const dy = this.player.y - g.y;
      if (Math.sqrt(dx * dx + dy * dy) < g.r + 15) {
        this.score += 100;
        this.updateScore(this.score);
        return false;
      }
      return true;
    });
    
    this.rocks.forEach(rock => {
      rock.y += 1;
      if (rock.y > this.height) {
        rock.y = -25;
        rock.x = Math.random() * (this.width - 30);
      }
      
      if (this.player.x < rock.x + rock.w &&
          this.player.x + this.player.w > rock.x &&
          this.player.y < rock.y + rock.h &&
          this.player.y + this.player.h > rock.y) {
        this.gameOver = true;
        clearInterval(this.interval);
      }
    });
    
    if (this.gold.length === 0) {
      this.gold.push({
        x: Math.random() * (this.width - 20),
        y: -20,
        r: 10
      });
    }
    
    this.draw();
  }

  startLoop() {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => this.update(), 20);
  }

  draw() {
    this.clear();
    this.ctx.fillStyle = '#2c3e50';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    this.ctx.fillStyle = '#f39c12';
    this.gold.forEach(g => {
      this.ctx.beginPath();
      this.ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    this.ctx.fillStyle = '#7f8c8d';
    this.rocks.forEach(rock => {
      this.ctx.fillRect(rock.x, rock.y, rock.w, rock.h);
    });
    
    this.ctx.fillStyle = '#e74c3c';
    this.ctx.fillRect(this.player.x, this.player.y, this.player.w, this.player.h);
    
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '16px sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`得分: ${this.score}`, 10, 25);
    
    if (this.gameOver) {
      this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
      this.ctx.fillRect(0, this.height / 2 - 40, this.width, 80);
      this.ctx.fillStyle = '#fff';
      this.ctx.font = '24px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('游戏结束', this.width / 2, this.height / 2);
    }
  }

  onTouchStart(e) {
    if (this.gameOver) return;
    this.dy = -8;
  }

  onTouchMove(e) {
    if (this.gameOver) return;
    const touch = e.touches[0];
    this.player.x = touch.clientX - this.player.w / 2;
    this.player.x = Math.max(0, Math.min(this.width - this.player.w, this.player.x));
  }

  cheat(action) {
    if (action === 'magnet') {
      this.gold.forEach(g => {
        g.x += (this.player.x - g.x) * 0.05;
        g.y += (this.player.y - g.y) * 0.05;
      });
    }
  }

  getState() {
    return { score: this.score };
  }

  restart() {
    clearInterval(this.interval);
    this.init();
  }
}

module.exports = Miner;
