const Game = require('../base/Game');

class Puzzle extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.gridSize = 3;
    this.tiles = [];
    this.emptyPos = { row: 2, col: 2 };
    this.cellSize = Math.min(80, (this.width - 40) / this.gridSize);
    this.offsetX = (this.width - this.cellSize * this.gridSize) / 2;
    this.offsetY = 50;
    this.score = 0;
    this.moves = 0;
  }

  init() {
    this.tiles = [];
    for (let i = 0; i < this.gridSize * this.gridSize - 1; i++) {
      this.tiles.push(i + 1);
    }
    this.tiles.push(0);
    this.shuffle();
    this.score = 0;
    this.moves = 0;
    this.draw();
  }

  shuffle() {
    for (let i = 0; i < 1000; i++) {
      const neighbors = this.getNeighbors(this.emptyPos);
      const random = neighbors[Math.floor(Math.random() * neighbors.length)];
      this.swap(random, this.emptyPos);
    }
  }

  getNeighbors(pos) {
    const neighbors = [];
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of dirs) {
      const nr = pos.row + dr, nc = pos.col + dc;
      if (nr >= 0 && nr < this.gridSize && nc >= 0 && nc < this.gridSize) {
        neighbors.push({ row: nr, col: nc });
      }
    }
    return neighbors;
  }

  swap(pos1, pos2) {
    const idx1 = pos1.row * this.gridSize + pos1.col;
    const idx2 = pos2.row * this.gridSize + pos2.col;
    [this.tiles[idx1], this.tiles[idx2]] = [this.tiles[idx2], this.tiles[idx1]];
  }

  draw() {
    this.clear();
    this.drawRect(0, 0, this.width, this.height, '#f5f6fa');
    
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        const val = this.tiles[i * this.gridSize + j];
        const x = this.offsetX + j * this.cellSize;
        const y = this.offsetY + i * this.cellSize;
        
        if (val > 0) {
          this.drawRect(x + 2, y + 2, this.cellSize - 4, this.cellSize - 4, '#3498db', 8);
          this.drawText(val, x + this.cellSize / 2, y + this.cellSize / 2, 28, '#fff');
        }
      }
    }
    
    this.checkWin();
  }

  drawRect(x, y, w, h, color, r = 0) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, w, h, r);
    this.ctx.fill();
  }

  drawText(text, x, y, size, color) {
    this.ctx.fillStyle = color;
    this.ctx.font = `bold ${size}px sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, x, y);
  }

  onTouchEnd(e) {
    const touch = e.changedTouches[0];
    const col = Math.floor((touch.clientX - this.offsetX) / this.cellSize);
    const row = Math.floor((touch.clientY - this.offsetY) / this.cellSize);
    
    const neighbors = this.getNeighbors(this.emptyPos);
    const isNeighbor = neighbors.some(n => n.row === row && n.col === col);
    
    if (isNeighbor && row >= 0 && row < this.gridSize && col >= 0 && col < this.gridSize) {
      this.swap({ row, col }, this.emptyPos);
      this.emptyPos = { row, col };
      this.moves++;
      this.score = this.moves;
      this.updateScore(this.score);
      this.draw();
    }
  }

  checkWin() {
    for (let i = 0; i < this.tiles.length - 1; i++) {
      if (this.tiles[i] !== i + 1) return;
    }
    this.drawRect(0, this.height / 2 - 40, this.width, 80, 'rgba(0,0,0,0.7)');
    this.drawText('恭喜通关!', this.width / 2, this.height / 2, 24, '#fff');
    this.drawText(`步数: ${this.moves}`, this.width / 2, this.height / 2 + 30, 16, '#fff');
  }

  cheat(action) {
    if (action === 'solve') {
      for (let i = 0; i < this.tiles.length - 1; i++) {
        this.tiles[i] = i + 1;
      }
      this.tiles[8] = 0;
      this.draw();
    }
  }

  getState() {
    return { score: this.score, tiles: this.tiles };
  }

  restart() {
    this.init();
  }
}

module.exports = Puzzle;
