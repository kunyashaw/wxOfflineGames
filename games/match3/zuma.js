const Game = require('../base/Game');

class Zuma extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.track = [];
    this.balls = [];
    this.shooter = { x: 0, y: 0, angle: 0, nextBall: 0 };
    this.score = 0;
    this.gameOver = false;
    this.colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'];
  }

  init() {
    this.track = this.generateTrack();
    this.balls = [];
    for (let i = 0; i < 50; i++) {
      const t = i / 50;
      this.balls.push({ x: this.getTrackPoint(t).x, y: this.getTrackPoint(t).y, color: Math.floor(Math.random() * this.colors.length), t });
    }
    this.shooter = { x: this.width / 2, y: this.height - 50, angle: -Math.PI / 2, nextBall: Math.floor(Math.random() * this.colors.length) };
    this.score = 0;
    this.gameOver = false;
    this.updateScore(0);
    this.startLoop();
    this.draw();
  }

  generateTrack() {
    const points = [];
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const x = this.width / 2 + Math.sin(t * Math.PI * 4) * 100;
      const y = 50 + t * (this.height - 100);
      points.push({ x, y });
    }
    return points;
  }

  getTrackPoint(t) {
    const idx = Math.min(Math.floor(t * (this.track.length - 1)), this.track.length - 2);
    const localT = (t * (this.track.length - 1)) - idx;
    return { x: this.track[idx].x + (this.track[idx + 1].x - this.track[idx].x) * localT, y: this.track[idx].y + (this.track[idx + 1].y - this.track[idx].y) * localT };
  }

  update() {
    if (this.gameOver) return;
    this.balls.forEach(b => { b.t += 0.001; const p = this.getTrackPoint(b.t); b.x = p.x; b.y = p.y; });
    this.balls = this.balls.filter(b => b.t < 1);
    if (this.balls.length === 0) { this.gameOver = true; clearInterval(this.interval); }
    this.draw();
  }

  startLoop() {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => this.update(), 30);
  }

  shoot() {
    const ball = { x: this.shooter.x, y: this.shooter.y, dx: Math.cos(this.shooter.angle) * 8, dy: Math.sin(this.shooter.angle) * 8, color: this.shooter.nextBall };
    this.shooter.nextBall = Math.floor(Math.random() * this.colors.length);
    
    const animate = () => {
      ball.x += ball.dx;
      ball.y += ball.dy;
      if (ball.x < 20 || ball.x > this.width - 20 || ball.y < 20 || ball.y > this.height - 20) return;
      
      for (let i = 0; i < this.balls.length; i++) {
        if (Math.hypot(ball.x - this.balls[i].x, ball.y - this.balls[i].y) < 20) {
          this.balls.splice(i, 0, ball);
          this.score += 10;
          this.updateScore(this.score);
          
          let matches = [ball];
          let j = i - 1;
          while (j >= 0 && this.balls[j].color === ball.color) { matches.push(this.balls[j]); j--; }
          j = i + 1;
          while (j < this.balls.length && this.balls[j].color === ball.color) { matches.push(this.balls[j]); j++; }
          
          if (matches.length >= 3) {
            matches.forEach((_, idx) => { this.balls.splice(Math.min(i, this.balls.length - 1), 1); });
            this.score += matches.length * 20;
            this.updateScore(this.score);
          }
          this.draw();
          return;
        }
      }
      requestAnimationFrame(animate);
    };
    animate();
  }

  draw() {
    this.clear();
    this.drawRect(0, 0, this.width, this.height, '#1a1a2e');
    this.ctx.strokeStyle = '#34495e'; this.ctx.lineWidth = 20; this.ctx.lineCap = 'round';
    this.ctx.beginPath(); this.ctx.moveTo(this.track[0].x, this.track[0].y);
    for (let i = 1; i < this.track.length; i++) { this.ctx.lineTo(this.track[i].x, this.track[i].y); }
    this.ctx.stroke();
    
    this.balls.forEach(b => { this.drawCircle(b.x, b.y, 10, this.colors[b.color]); });
    this.drawCircle(this.shooter.x, this.shooter.y, 15, this.colors[this.shooter.nextBall]);
    this.drawText(`得分: ${this.score}`, this.width / 2, 25, 14, '#fff');
    
    if (this.gameOver) {
      this.drawRect(0, this.height / 2 - 40, this.width, 80, 'rgba(0,0,0,0.7)');
      this.drawText(this.balls.length === 0 ? '恭喜过关!' : '游戏结束!', this.width / 2, this.height / 2, 24, '#fff');
    }
  }

  drawRect(x, y, w, h, color) { this.ctx.fillStyle = color; this.ctx.fillRect(x, y, w, h); }
  drawCircle(x, y, r, color) { this.ctx.fillStyle = color; this.ctx.beginPath(); this.ctx.arc(x, y, r, 0, Math.PI * 2); this.ctx.fill(); }
  drawText(text, x, y, size, color) { this.ctx.fillStyle = color; this.ctx.font = `${size}px sans-serif`; this.ctx.textAlign = 'center'; this.ctx.fillText(text, x, y); }

  onTouchStart(e) {
    const touch = e.changedTouches[0];
    this.shooter.angle = Math.atan2(touch.clientY - this.shooter.y, touch.clientX - this.shooter.x);
  }

  onTouchEnd(e) { this.shoot(); }

  cheat(action) { if (action === 'clear') { this.balls = []; this.score += 1000; this.updateScore(1000); this.draw(); } }
  getState() { return { score: this.score }; }
  restart() { clearInterval(this.interval); this.init(); }
}

module.exports = Zuma;
