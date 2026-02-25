const Game = require('../base/Game');

class Game2048 extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.gridSize = 4;
    this.cellSize = Math.min(70, (this.width - 40) / 4);
    this.gap = 8;
    this.offsetX = (this.width - (this.cellSize * 4 + this.gap * 3)) / 2;
    this.offsetY = 50;
    this.grid = [];
  }
  
  init() {
    this.grid = Array(4).fill(null).map(() => Array(4).fill(0));
    this.score = 0;
    this.addRandomTile();
    this.addRandomTile();
    this.draw();
  }
  
  addRandomTile() {
    const empty = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.grid[i][j] === 0) empty.push({ i, j });
      }
    }
    if (empty.length > 0) {
      const { i, j } = empty[Math.floor(Math.random() * empty.length)];
      this.grid[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
  }
  
  draw() {
    this.clear();
    this.drawBackground();
    this.drawGrid();
  }
  
  drawBackground() {
    this.drawRect(0, 0, this.width, this.height, '#bbada0');
  }
  
  drawGrid() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const x = this.offsetX + j * (this.cellSize + this.gap);
        const y = this.offsetY + i * (this.cellSize + this.gap);
        const value = this.grid[i][j];
        
        this.drawRect(x, y, this.cellSize, this.cellSize, this.getTileColor(value));
        
        if (value > 0) {
          const fontSize = value > 100 ? 20 : 26;
          this.drawText(value, x + this.cellSize / 2, y + this.cellSize / 2, fontSize, this.getTextColor(value));
        }
      }
    }
  }
  
  getTileColor(value) {
    const colors = {
      0: '#cdc1b4',
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e'
    };
    return colors[value] || '#3c3a32';
  }
  
  getTextColor(value) {
    return value <= 4 ? '#776e65' : '#f9f6f2';
  }
  
  onTouchEnd(e) {
    const touch = e.changedTouches[0];
    const startX = this.touchStartX || touch.clientX;
    const startY = this.touchStartY || touch.clientY;
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
      this.move(dx > 0 ? 'right' : 'left');
    } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 30) {
      this.move(dy > 0 ? 'down' : 'up');
    }
  }
  
  onTouchStart(e) {
    this.touchStartX = e.changedTouches[0].clientX;
    this.touchStartY = e.changedTouches[0].clientY;
  }
  
  move(direction) {
    const oldGrid = JSON.stringify(this.grid);
    
    if (direction === 'left') {
      for (let i = 0; i < 4; i++) {
        const row = this.grid[i].filter(v => v !== 0);
        const merged = this.merge(row);
        this.grid[i] = [...merged, ...Array(4 - merged.length).fill(0)];
      }
    } else if (direction === 'right') {
      for (let i = 0; i < 4; i++) {
        const row = this.grid[i].filter(v => v !== 0).reverse();
        const merged = this.merge(row);
        this.grid[i] = [...Array(4 - merged.length).fill(0), ...merged.reverse()];
      }
    } else if (direction === 'up') {
      for (let j = 0; j < 4; j++) {
        let col = [];
        for (let i = 0; i < 4; i++) col.push(this.grid[i][j]);
        const filtered = col.filter(v => v !== 0);
        const merged = this.merge(filtered);
        for (let i = 0; i < 4; i++) {
          this.grid[i][j] = merged[i] || 0;
        }
      }
    } else if (direction === 'down') {
      for (let j = 0; j < 4; j++) {
        let col = [];
        for (let i = 0; i < 4; i++) col.push(this.grid[i][j]);
        const filtered = col.filter(v => v !== 0).reverse();
        const merged = this.merge(filtered);
        for (let i = 0; i < 4; i++) {
          this.grid[i][j] = merged[3 - i] || 0;
        }
      }
    }
    
    if (JSON.stringify(this.grid) !== oldGrid) {
      this.addRandomTile();
      this.draw();
      this.updateScore(this.score);
    }
  }
  
  merge(row) {
    const result = [];
    for (let i = 0; i < row.length; i++) {
      if (i < row.length - 1 && row[i] === row[i + 1]) {
        result.push(row[i] * 2);
        this.score += row[i] * 2;
        i++;
      } else {
        result.push(row[i]);
      }
    }
    return result;
  }
  
  loop() {
    if (this.running) {
      requestAnimationFrame(() => this.loop());
    }
  }
  
  cheat(action) {
    if (action === 'to2048') {
      this.grid = Array(4).fill(null).map(() => Array(4).fill(0));
      this.grid[0][0] = 2048;
      this.score = 2048;
      this.draw();
      this.updateScore(this.score);
    }
  }
  
  getState() {
    return { score: this.score, grid: this.grid };
  }
}

module.exports = Game2048;
