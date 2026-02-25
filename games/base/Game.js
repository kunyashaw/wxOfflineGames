class Game {
  constructor(canvas, ctx, options = {}) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = options.width || 375;
    this.height = options.height || 500;
    this.score = 0;
    this.state = {};
    this.running = false;
    this.onScoreUpdate = null;
  }
  
  start() {
    this.running = true;
    this.init();
    this.loop();
  }
  
  stop() {
    this.running = false;
  }
  
  restart() {
    this.score = 0;
    this.state = {};
    this.init();
  }
  
  init() {}
  loop() {}
  onTouchStart(e) {}
  onTouchMove(e) {}
  onTouchEnd(e) {}
  getState() { return { score: this.score, ...this.state }; }
  cheat(action) {}
  
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
  
  drawRect(x, y, w, h, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, w, h);
  }
  
  drawCircle(x, y, r, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  drawText(text, x, y, size, color, align = 'center') {
    this.ctx.fillStyle = color;
    this.ctx.font = `${size}px sans-serif`;
    this.ctx.textAlign = align;
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, x, y);
  }
  
  updateScore(score) {
    this.score = score;
    if (this.onScoreUpdate) {
      this.onScoreUpdate(score);
    }
  }
}

module.exports = Game;
