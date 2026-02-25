const Game = require('../base/Game');

class Sokoban extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.cellSize = Math.min(35, (this.width - 40) / 8);
    this.offsetX = (this.width - this.cellSize * 8) / 2;
    this.offsetY = 40;
    this.map = [];
    this.player = { x: 0, y: 0 };
    this.score = 0;
    this.moves = 0;
    this.levels = [
      {
        map: [
          "########",
          "#  @   #",
          "# $ #  #",
          "#  $#  #",
          "# .  # #",
          "# . ### #",
          "#   #",
          "######"
        ],
        boxes: []
      }
    ];
  }

  init() {
    this.loadLevel(0);
    this.score = 0;
    this.moves = 0;
    this.updateScore(0);
    this.draw();
  }

  loadLevel(levelIdx) {
    const level = this.levels[levelIdx] || this.levels[0];
    this.map = level.map.map(row => row.split(''));
    
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if (this.map[y][x] === '@') {
          this.player = { x, y };
          this.map[y][x] = ' ';
        }
      }
    }
  }

  draw() {
    this.clear();
    this.drawRect(0, 0, this.width, this.height, '#2c3e50');
    
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        const char = this.map[y][x];
        const px = this.offsetX + x * this.cellSize;
        const py = this.offsetY + y * this.cellSize;
        
        if (char === '#') {
          this.drawRect(px, py, this.cellSize, this.cellSize, '#95a5a6');
        } else if (char === '$') {
          this.drawRect(px + 2, py + 2, this.cellSize - 4, this.cellSize - 4, '#e74c3c', 4);
        } else if (char === '.') {
          this.drawCircle(px + this.cellSize / 2, py + this.cellSize / 2, 6, '#2ecc71');
        }
      }
    }
    
    const ppx = this.offsetX + this.player.x * this.cellSize;
    const ppy = this.offsetY + this.player.y * this.cellSize;
    this.drawRect(ppx + 4, ppy + 4, this.cellSize - 8, this.cellSize - 8, '#3498db', 6);
    
    this.checkWin();
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

  drawCircle(x, y, r, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI * 2);
    this.ctx.fill();
  }

  move(dx, dy) {
    const nx = this.player.x + dx;
    const ny = this.player.y + dy;
    
    if (this.map[ny] && (this.map[ny][nx] === ' ' || this.map[ny][nx] === '.')) {
      this.player = { x: nx, y: ny };
      this.moves++;
      this.score = this.moves;
      this.updateScore(this.score);
    } else if (this.map[ny] && this.map[ny][nx] === '$') {
      const nnx = nx + dx;
      const nny = ny + dy;
      if (this.map[nny] && (this.map[nny][nnx] === ' ' || this.map[nny][nnx] === '.')) {
        this.map[ny][nx] = ' ';
        this.map[nny][nnx] = '$';
        this.player = { x: nx, y: ny };
        this.moves++;
        this.score = this.moves;
        this.updateScore(this.score);
      }
    }
    this.draw();
  }

  checkWin() {
    let boxesOnGoal = 0;
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if (this.map[y][x] === '$') {
          const hasGoal = (y > 0 && this.map[y-1] && this.map[y-1][x] === '.') ||
                         (this.map[y+1] && this.map[y+1][x] === '.') ||
                         (x > 0 && this.map[y][x-1] === '.') ||
                         (this.map[y][x+1] === '.');
        }
      }
    }
  }

  onTouchStart(e) {
    this.touchStartX = e.changedTouches[0].clientX;
    this.touchStartY = e.changedTouches[0].clientY;
  }

  onTouchEnd(e) {
    const dx = e.changedTouches[0].clientX - this.touchStartX;
    const dy = e.changedTouches[0].clientY - this.touchStartY;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      this.move(dx > 0 ? 1 : -1, 0);
    } else {
      this.move(0, dy > 0 ? 1 : -1);
    }
  }

  cheat(action) {
    if (action === 'win') {
      for (let y = 0; y < this.map.length; y++) {
        for (let x = 0; x < this.map[y].length; x++) {
          if (this.map[y][x] === '$') this.map[y][x] = ' ';
        }
      }
      this.draw();
    }
  }

  getState() {
    return { score: this.score, moves: this.moves };
  }

  restart() {
    this.init();
  }
}

module.exports = Sokoban;
