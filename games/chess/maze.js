const Game = require('../base/Game');

class Maze extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.cols = 15;
    this.rows = 15;
    this.cellSize = Math.min(22, (this.width - 20) / this.cols);
    this.offsetX = (this.width - this.cellSize * this.cols) / 2;
    this.offsetY = 30;
    this.maze = [];
    this.player = { x: 0, y: 0 };
    this.exit = { x: 0, y: 0 };
    this.score = 0;
  }

  init() {
    this.generateMaze();
    this.player = { x: 0, y: 0 };
    this.exit = { x: this.cols - 1, y: this.rows - 1 };
    this.score = 0;
    this.updateScore(0);
    this.draw();
  }

  generateMaze() {
    this.maze = Array(this.rows).fill(null).map(() => Array(this.cols).fill(1));
    const stack = [{ x: 0, y: 0 }];
    this.maze[0][0] = 0;
    
    const dirs = [[0,-2],[0,2],[-2,0],[2,0]];
    while (stack.length) {
      const current = stack[stack.length - 1];
      const neighbors = [];
      for (const [dx, dy] of dirs) {
        const nx = current.x + dx, ny = current.y + dy;
        if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows && this.maze[ny][nx] === 1) {
          neighbors.push({ x: nx, y: ny, dx: dx / 2, dy: dy / 2 });
        }
      }
      if (neighbors.length) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        this.maze[current.y + next.dy][current.x + next.dx] = 0;
        this.maze[next.y][next.x] = 0;
        stack.push({ x: next.x, y: next.y });
      } else {
        stack.pop();
      }
    }
    this.maze[this.rows - 1][this.cols - 1] = 0;
  }

  draw() {
    this.clear();
    this.drawRect(0, 0, this.width, this.height, '#2c3e50');
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const px = this.offsetX + x * this.cellSize;
        const py = this.offsetY + y * this.cellSize;
        if (this.maze[y][x]) {
          this.drawRect(px, py, this.cellSize, this.cellSize, '#34495e');
        }
      }
    }
    const ex = this.offsetX + this.exit.x * this.cellSize + this.cellSize / 4;
    const ey = this.offsetY + this.exit.y * this.cellSize + this.cellSize / 4;
    this.drawRect(ex, ey, this.cellSize / 2, this.cellSize / 2, '#2ecc71');
    
    const px = this.offsetX + this.player.x * this.cellSize + 3;
    const py = this.offsetY + this.player.y * this.cellSize + 3;
    this.drawCircle(px + this.cellSize / 2, py + this.cellSize / 2, this.cellSize / 2 - 3, '#e74c3c');
    
    this.drawText(`步数: ${this.score}`, 50, 20, 14, '#fff');
  }

  drawRect(x, y, w, h, color) { this.ctx.fillStyle = color; this.ctx.fillRect(x, y, w, h); }
  drawCircle(x, y, r, color) { this.ctx.fillStyle = color; this.ctx.beginPath(); this.ctx.arc(x, y, r, 0, Math.PI * 2); this.ctx.fill(); }
  drawText(text, x, y, size, color) { this.ctx.fillStyle = color; this.ctx.font = `${size}px sans-serif`; this.ctx.textAlign = 'center'; this.ctx.fillText(text, x, y); }

  move(dx, dy) {
    const nx = this.player.x + dx, ny = this.player.y + dy;
    if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows && !this.maze[ny][nx]) {
      this.player = { x: nx, y: ny };
      this.score++;
      this.updateScore(this.score);
      if (nx === this.exit.x && ny === this.exit.y) {
        this.score = 1000 - this.score;
        this.updateScore(this.score);
      }
      this.draw();
    }
  }

  onTouchStart(e) { this.tx = e.changedTouches[0].clientX; this.ty = e.changedTouches[0].clientY; }
  onTouchEnd(e) {
    const dx = e.changedTouches[0].clientX - this.tx;
    const dy = e.changedTouches[0].clientY - this.ty;
    if (Math.abs(dx) > Math.abs(dy)) this.move(dx > 0 ? 1 : -1, 0);
    else this.move(0, dy > 0 ? 1 : -1);
  }

  cheat(action) {
    if (action === 'show') { this.player = { ...this.exit }; this.draw(); }
  }
  getState() { return { score: this.score }; }
  restart() { this.init(); }
}

module.exports = Maze;
