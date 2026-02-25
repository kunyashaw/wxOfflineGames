const Game = require('../base/Game');

class BubbleShooter extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.bubbles = [];
    this.shooter = { x: 0, y: 0, angle: -Math.PI / 2, nextBubble: 0 };
    this.score = 0;
    this.gridSize = 30;
    this.colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'];
  }

  init() {
    this.bubbles = [];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 10; c++) {
        this.bubbles.push({ x: c * this.gridSize + this.gridSize / 2 + (r % 2) * this.gridSize / 2, y: r * this.gridSize * 0.85 + this.gridSize / 2, color: Math.floor(Math.random() * this.colors.length), row: r, col: c });
      }
    }
    this.shooter = { x: this.width / 2, y: this.height - 40, angle: -Math.PI / 2, nextBubble: Math.floor(Math.random() * this.colors.length) };
    this.score = 0;
    this.updateScore(0);
    this.startLoop();
    this.draw();
  }

  update() {
    this.draw();
  }

  startLoop() {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => this.update(), 100);
  }

  shoot() {
    const bubble = { x: this.shooter.x, y: this.shooter.y, dx: Math.cos(this.shooter.angle) * 8, dy: Math.sin(this.shooter.angle) * 8, color: this.shooter.nextBubble };
    this.shooter.nextBubble = Math.floor(Math.random() * this.colors.length);
    
    const animate = () => {
      bubble.x += bubble.dx;
      bubble.y += bubble.dy;
      if (bubble.x < 15 || bubble.x > this.width - 15) bubble.dx *= -1;
      if (bubble.y < 15) { this.attachBubble(bubble); return; }
      
      for (const b of this.bubbles) {
        if (Math.hypot(bubble.x - b.x, bubble.y - b.y) < this.gridSize * 0.9) { this.attachBubble(bubble); return; }
      }
      this.draw();
      requestAnimationFrame(animate);
    };
    animate();
  }

  attachBubble(bubble) {
    const row = Math.round(bubble.y / (this.gridSize * 0.85));
    const col = Math.round((bubble.x - (row % 2) * this.gridSize / 2) / this.gridSize);
    this.bubbles.push({ x: col * this.gridSize + this.gridSize / 2 + (row % 2) * this.gridSize / 2, y: row * this.gridSize * 0.85 + this.gridSize / 2, color: bubble.color, row, col });
    this.score += 10;
    this.updateScore(this.score);
    this.draw();
  }

  draw() {
    this.clear();
    this.drawRect(0, 0, this.width, this.height, '#1a1a2e');
    this.bubbles.forEach(b => { this.drawCircle(b.x, b.y, 12, this.colors[b.color]); });
    this.drawCircle(this.shooter.x, this.shooter.y, 15, this.colors[this.shooter.nextBubble]);
    this.drawText(`得分: ${this.score}`, this.width / 2, 20, 14, '#fff');
  }

  drawRect(x, y, w, h, color) { this.ctx.fillStyle = color; this.ctx.fillRect(x, y, w, h); }
  drawCircle(x, y, r, color) { this.ctx.fillStyle = color; this.ctx.beginPath(); this.ctx.arc(x, y, r, 0, Math.PI * 2); this.ctx.fill(); }
  drawText(text, x, y, size, color) { this.ctx.fillStyle = color; this.ctx.font = `${size}px sans-serif`; this.ctx.textAlign = 'center'; this.ctx.fillText(text, x, y); }

  onTouchStart(e) { this.tx = e.changedTouches[0].clientX; this.ty = e.changedTouches[0].clientY; }
  onTouchEnd(e) {
    const dx = e.changedTouches[0].clientX - this.tx;
    const dy = e.changedTouches[0].clientY - this.ty;
    if (Math.abs(dx) > 20 || Math.abs(dy) > 20) {
      this.shooter.angle = Math.atan2(dy, dx);
    } else { this.shoot(); }
  }

  cheat(action) { if (action === 'clear') { this.bubbles = []; this.score += 100; this.updateScore(100); this.draw(); } }
  getState() { return { score: this.score }; }
  restart() { clearInterval(this.interval); this.init(); }
}

module.exports = BubbleShooter;
