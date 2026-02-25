const Game = require('../base/Game');

class Tetris extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.cols = 10;
    this.rows = 20;
    this.cellSize = Math.min(16, (this.width - 20) / this.cols);
    this.offsetX = (this.width - this.cols * this.cellSize) / 2;
    this.offsetY = 20;
    this.board = [];
    this.score = 0;
    this.level = 1;
    this.gameOver = false;
    this.currentPiece = null;
    this.speed = 500;
    this.shapes = [
      [[1, 1, 1, 1]],
      [[1, 1], [1, 1]],
      [[1, 1, 1], [0, 1, 0]],
      [[1, 1, 1], [1, 0, 0]],
      [[1, 1, 1], [0, 0, 1]],
      [[1, 1, 0], [0, 1, 1]],
      [[0, 1, 1], [1, 1, 0]]
    ];
    this.colors = ['#00f0f0', '#f0f000', '#a000f0', '#00f000', '#f00000', '#00f0f0', '#f0a000'];
  }

  init() {
    this.board = Array(this.rows).fill(null).map(() => Array(this.cols).fill(0));
    this.score = 0;
    this.level = 1;
    this.gameOver = false;
    this.speed = 500;
    this.spawnPiece();
    this.startLoop();
    this.updateScore(0);
    this.draw();
  }

  spawnPiece() {
    const idx = Math.floor(Math.random() * this.shapes.length);
    this.currentPiece = {
      shape: this.shapes[idx].map(row => [...row]),
      color: this.colors[idx],
      x: Math.floor(this.cols / 2) - 1,
      y: 0
    };
    if (this.checkCollision(this.currentPiece.x, this.currentPiece.y, this.currentPiece.shape)) {
      this.gameOver = true;
      clearInterval(this.interval);
    }
  }

  checkCollision(x, y, shape) {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const nx = x + c, ny = y + r;
          if (nx < 0 || nx >= this.cols || ny >= this.rows || (ny >= 0 && this.board[ny][nx])) {
            return true;
          }
        }
      }
    }
    return false;
  }

  rotate() {
    const shape = this.currentPiece.shape;
    const rotated = shape[0].map((_, i) => shape.map(row => row[i]).reverse());
    if (!this.checkCollision(this.currentPiece.x, this.currentPiece.y, rotated)) {
      this.currentPiece.shape = rotated;
    }
  }

  move(dir) {
    if (!this.checkCollision(this.currentPiece.x + dir, this.currentPiece.y, this.currentPiece.shape)) {
      this.currentPiece.x += dir;
    }
  }

  drop() {
    if (!this.checkCollision(this.currentPiece.x, this.currentPiece.y + 1, this.currentPiece.shape)) {
      this.currentPiece.y++;
    } else {
      this.lockPiece();
      this.clearLines();
      this.spawnPiece();
    }
    this.draw();
  }

  lockPiece() {
    const { shape, color, x, y } = this.currentPiece;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] && y + r >= 0) {
          this.board[y + r][x + c] = color;
        }
      }
    }
  }

  clearLines() {
    let lines = 0;
    for (let r = this.rows - 1; r >= 0; r--) {
      if (this.board[r].every(c => c)) {
        this.board.splice(r, 1);
        this.board.unshift(Array(this.cols).fill(0));
        lines++;
        r++;
      }
    }
    if (lines > 0) {
      this.score += lines * 100 * lines;
      this.level = Math.floor(this.score / 1000) + 1;
      this.speed = Math.max(100, 500 - this.level * 30);
      clearInterval(this.interval);
      this.interval = setInterval(() => this.drop(), this.speed);
      this.updateScore(this.score);
    }
  }

  startLoop() {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => this.drop(), this.speed);
  }

  draw() {
    this.clear();
    this.drawRect(0, 0, this.width, this.height, '#1a1a2e');
    
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.board[r][c]) {
          const x = this.offsetX + c * this.cellSize;
          const y = this.offsetY + r * this.cellSize;
          this.drawRect(x, y, this.cellSize - 1, this.cellSize - 1, this.board[r][c]);
        }
      }
    }
    
    if (this.currentPiece) {
      const { shape, color, x, y } = this.currentPiece;
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (shape[r][c]) {
            const px = this.offsetX + (x + c) * this.cellSize;
            const py = this.offsetY + (y + r) * this.cellSize;
            this.drawRect(px, py, this.cellSize - 1, this.cellSize - 1, color);
          }
        }
      }
    }
    
    this.drawText(`得分: ${this.score}`, 50, 20, 12, '#fff');
    this.drawText(`关卡: ${this.level}`, 50, 35, 12, '#fff');
    
    if (this.gameOver) {
      this.drawRect(0, this.height / 2 - 40, this.width, 80, 'rgba(0,0,0,0.7)');
      this.drawText('Game Over', this.width / 2, this.height / 2, 24, '#fff');
    }
  }

  drawRect(x, y, w, h, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, w, h);
  }

  drawText(text, x, y, size, color) {
    this.ctx.fillStyle = color;
    this.ctx.font = `${size}px sans-serif`;
    this.ctx.textAlign = 'left';
    this.ctx.fillText(text, x, y);
  }

  onTouchStart(e) {
    this.touchStartX = e.changedTouches[0].clientX;
    this.touchStartY = e.changedTouches[0].clientY;
  }

  onTouchEnd(e) {
    const dx = e.changedTouches[0].clientX - this.touchStartX;
    const dy = e.changedTouches[0].clientY - this.touchStartY;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      this.move(dx > 0 ? 1 : -1);
    } else if (dy > 30) {
      this.drop();
    } else if (dy < -30) {
      this.rotate();
    }
    this.draw();
  }

  cheat(action) {
    if (action === 'clear') {
      this.clearLines();
    } else if (action === 'slow') {
      clearInterval(this.interval);
      this.interval = setInterval(() => this.drop(), 1000);
    }
  }

  getState() {
    return { score: this.score, level: this.level };
  }

  restart() {
    clearInterval(this.interval);
    this.init();
  }
}

module.exports = Tetris;
