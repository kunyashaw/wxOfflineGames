const Game = require('../base/Game');

class Pipe extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.gridSize = 5;
    this.cellSize = Math.min(55, (this.width - 30) / this.gridSize);
    this.offsetX = (this.width - this.cellSize * this.gridSize) / 2;
    this.offsetY = 40;
    this.pipes = [];
    this.connected = [];
    this.score = 0;
    this.pipeTypes = ['│', '─', '┐', '┌', '┘', '└', '┼'];
    this.flowStart = null;
  }

  init() {
    this.generatePipes();
    this.score = 0;
    this.updateScore(0);
    this.connectAll();
    this.draw();
  }

  generatePipes() {
    this.pipes = [];
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        const typeIdx = Math.floor(Math.random() * this.pipeTypes.length);
        this.pipes.push({
          row: i,
          col: j,
          type: this.pipeTypes[typeIdx],
          rotated: 0,
          connected: false
        });
      }
    }
    this.flowStart = { row: 0, col: 0 };
  }

  getPipe(row, col) {
    return this.pipes.find(p => p.row === row && p.col === col);
  }

  rotate(pipe) {
    pipe.rotated = (pipe.rotated + 1) % 4;
    this.connectAll();
    this.score += 1;
    this.updateScore(this.score);
    this.draw();
  }

  connectAll() {
    this.pipes.forEach(p => p.connected = false);
    const visited = new Set();
    const queue = [this.flowStart];
    
    while (queue.length > 0) {
      const curr = queue.shift();
      const key = `${curr.row},${curr.col}`;
      if (visited.has(key)) continue;
      visited.add(key);
      
      const pipe = this.getPipe(curr.row, curr.col);
      if (!pipe) continue;
      pipe.connected = true;
      
      const dirs = this.getConnections(pipe);
      dirs.forEach(([dr, dc]) => {
        const nr = curr.row + dr;
        const nc = curr.col + dc;
        if (nr >= 0 && nr < this.gridSize && nc >= 0 && nc < this.gridSize) {
          const nextPipe = this.getPipe(nr, nc);
          if (nextPipe && this.canConnect(pipe, nextPipe, dr, dc)) {
            queue.push({ row: nr, col: nc });
          }
        }
      });
    }
  }

  getConnections(pipe) {
    const r = pipe.rotated;
    const maps = {
      '│': [[-1, 0], [1, 0]],
      '─': [[0, -1], [0, 1]],
      '┐': [[-1, 0], [0, 1]],
      '┌': [[-1, 0], [0, -1]],
      '┘': [[1, 0], [0, 1]],
      '└': [[1, 0], [0, -1]],
      '┼': [[-1, 0], [1, 0], [0, -1], [0, 1]]
    };
    return maps[pipe.type].map(([dr, dc]) => {
      if (r === 1) return [dc, -dr];
      if (r === 2) return [-dr, -dc];
      if (r === 3) return [-dc, dr];
      return [dr, dc];
    });
  }

  canConnect(from, to, dr, dc) {
    const backDirs = this.getConnections(to);
    return backDirs.some(([rdc, cdc]) => rdc === -dr && cdc === -dc);
  }

  draw() {
    this.clear();
    this.drawRect(0, 0, this.width, this.height, '#2c3e50');
    
    this.pipes.forEach(pipe => {
      const x = this.offsetX + pipe.col * this.cellSize;
      const y = this.offsetY + pipe.row * this.cellSize;
      
      this.drawRect(x + 1, y + 1, this.cellSize - 2, this.cellSize - 2, pipe.connected ? '#27ae60' : '#34495e', 4);
      
      this.ctx.save();
      this.ctx.translate(x + this.cellSize / 2, y + this.cellSize / 2);
      this.ctx.rotate(pipe.rotated * Math.PI / 2);
      
      this.ctx.strokeStyle = pipe.connected ? '#fff' : '#7f8c8d';
      this.ctx.lineWidth = 6;
      this.ctx.lineCap = 'round';
      
      if (pipe.type === '│' || pipe.type === '┼') {
        this.ctx.beginPath();
        this.ctx.moveTo(0, -this.cellSize / 3);
        this.ctx.lineTo(0, this.cellSize / 3);
        this.ctx.stroke();
      }
      if (pipe.type === '─' || pipe.type === '┼') {
        this.ctx.beginPath();
        this.ctx.moveTo(-this.cellSize / 3, 0);
        this.ctx.lineTo(this.cellSize / 3, 0);
        this.ctx.stroke();
      }
      if (pipe.type === '┐') {
        this.ctx.beginPath();
        this.ctx.moveTo(0, -this.cellSize / 3);
        this.ctx.lineTo(0, 0);
        this.ctx.lineTo(this.cellSize / 3, 0);
        this.ctx.stroke();
      }
      if (pipe.type === '┌') {
        this.ctx.beginPath();
        this.ctx.moveTo(0, -this.cellSize / 3);
        this.ctx.lineTo(0, 0);
        this.ctx.lineTo(-this.cellSize / 3, 0);
        this.ctx.stroke();
      }
      if (pipe.type === '┘') {
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.cellSize / 3);
        this.ctx.lineTo(0, 0);
        this.ctx.lineTo(this.cellSize / 3, 0);
        this.ctx.stroke();
      }
      if (pipe.type === '└') {
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.cellSize / 3);
        this.ctx.lineTo(0, 0);
        this.ctx.lineTo(-this.cellSize / 3, 0);
        this.ctx.stroke();
      }
      
      this.ctx.restore();
    });
    
    const connectedCount = this.pipes.filter(p => p.connected).length;
    this.drawText(`已连接: ${connectedCount}/${this.gridSize * this.gridSize}`, this.width / 2, 20, 14, '#fff');
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
    const touch = e.changedTouches[0];
    const col = Math.floor((touch.clientX - this.offsetX) / this.cellSize);
    const row = Math.floor((touch.clientY - this.offsetY) / this.cellSize);
    
    const pipe = this.getPipe(row, col);
    if (pipe) {
      this.rotate(pipe);
    }
  }

  cheat(action) {
    if (action === 'all') {
      this.pipes.forEach(p => p.connected = true);
      this.draw();
    }
  }

  getState() {
    return { score: this.score };
  }

  restart() {
    this.init();
  }
}

module.exports = Pipe;
