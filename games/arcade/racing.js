const Game = require('../base/Game');

class Racing extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.car = { x: 0, y: 0, w: 30, h: 50 };
    this.obstacles = [];
    this.score = 0;
    this.speed = 3;
    this.gameOver = false;
    this.laneWidth = 60;
    this.lanes = 3;
  }

  init() {
    this.car.x = this.width / 2 - this.car.w / 2;
    this.car.y = this.height - 120;
    this.obstacles = [];
    this.score = 0;
    this.speed = 3;
    this.gameOver = false;
    this.startLoop();
    this.updateScore(0);
    this.draw();
  }

  spawnObstacle() {
    const lane = Math.floor(Math.random() * this.lanes);
    const laneWidth = this.width / this.lanes;
    this.obstacles.push({
      x: laneWidth * lane + (laneWidth - 40) / 2,
      y: -60,
      w: 40,
      h: 60,
      type: Math.random() > 0.5 ? 'car' : 'rock'
    });
  }

  update() {
    if (this.gameOver) return;
    
    this.score += 1;
    if (this.score % 500 === 0) this.speed += 0.5;
    this.updateScore(Math.floor(this.score / 10));
    
    if (Math.random() < 0.02 + this.score / 10000) {
      this.spawnObstacle();
    }
    
    this.obstacles.forEach(obs => {
      obs.y += this.speed;
    });
    
    this.obstacles = this.obstacles.filter(obs => obs.y < this.height);
    
    this.obstacles.forEach(obs => {
      if (this.car.x < obs.x + obs.w &&
          this.car.x + this.car.w > obs.x &&
          this.car.y < obs.y + obs.h &&
          this.car.y + this.car.h > obs.y) {
        this.gameOver = true;
        clearInterval(this.interval);
      }
    });
    
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
    
    const laneWidth = this.width / this.lanes;
    for (let i = 1; i < this.lanes; i++) {
      this.ctx.strokeStyle = '#fff';
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([20, 20]);
      this.ctx.beginPath();
      this.ctx.moveTo(laneWidth * i, 0);
      this.ctx.lineTo(laneWidth * i, this.height);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }
    
    this.obstacles.forEach(obs => {
      this.ctx.fillStyle = obs.type === 'car' ? '#e74c3c' : '#7f8c8d';
      this.ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
    });
    
    this.ctx.fillStyle = '#3498db';
    this.ctx.fillRect(this.car.x, this.car.y, this.car.w, this.car.h);
    this.ctx.fillStyle = '#2980b9';
    this.ctx.fillRect(this.car.x + 5, this.car.y + 5, this.car.w - 10, 15);
    
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '16px sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`得分: ${Math.floor(this.score / 10)}`, 10, 25);
    
    if (this.gameOver) {
      this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
      this.ctx.fillRect(0, this.height / 2 - 40, this.width, 80);
      this.ctx.fillStyle = '#fff';
      this.ctx.font = '24px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('游戏结束', this.width / 2, this.height / 2);
    }
  }

  onTouchMove(e) {
    if (this.gameOver) return;
    const touch = e.touches[0];
    this.car.x = touch.clientX - this.car.w / 2;
    this.car.x = Math.max(0, Math.min(this.width - this.car.w, this.car.x));
  }

  cheat(action) {
    if (action === 'slow') {
      this.speed = 1;
    }
  }

  getState() {
    return { score: Math.floor(this.score / 10) };
  }

  restart() {
    clearInterval(this.interval);
    this.init();
  }
}

module.exports = Racing;
