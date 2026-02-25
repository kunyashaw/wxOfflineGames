const Game = require('../base/Game');

class Snake extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.gridSize = Math.max(15, Math.floor(this.width / 20));
    this.cols = Math.floor(this.width / this.gridSize);
    this.rows = Math.floor(this.height / this.gridSize);
    this.direction = 'right';
    this.nextDirection = 'right';
    this.snake = [];
    this.food = null;
    this.godMode = false;
    this.gameOver = false;
    this.speed = 150;
  }
  
  init() {
    this.snake = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 }
    ];
    this.direction = 'right';
    this.nextDirection = 'right';
    this.score = 0;
    this.gameOver = false;
    this.godMode = false;
    this.spawnFood();
    this.startLoop();
    this.draw();
    this.updateScore(0);
  }
  
  spawnFood() {
    let valid = false;
    while (!valid) {
      this.food = {
        x: Math.floor(Math.random() * this.cols),
        y: Math.floor(Math.random() * this.rows)
      };
      valid = !this.snake.some(s => s.x === this.food.x && s.y === this.food.y);
    }
  }
  
  startLoop() {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => this.update(), this.speed);
  }
  
  update() {
    if (this.gameOver) return;
    
    this.direction = this.nextDirection;
    const head = { ...this.snake[0] };
    
    switch (this.direction) {
      case 'up': head.y--; break;
      case 'down': head.y++; break;
      case 'left': head.x--; break;
      case 'right': head.x++; break;
    }
    
    if (head.x < 0 || head.x >= this.cols || head.y < 0 || head.y >= this.rows) {
      if (!this.godMode) {
        this.showGameOver();
        return;
      }
      head.x = (head.x + this.cols) % this.cols;
      head.y = (head.y + this.rows) % this.rows;
    }
    
    if (this.snake.some(s => s.x === head.x && s.y === head.y)) {
      if (!this.godMode) {
        this.showGameOver();
        return;
      }
    }
    
    this.snake.unshift(head);
    
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10;
      this.updateScore(this.score);
      this.spawnFood();
    } else {
      this.snake.pop();
    }
    
    this.draw();
  }
  
  draw() {
    this.clear();
    this.drawRect(0, 0, this.width, this.height, '#1a1a2e');
    
    this.snake.forEach((segment, i) => {
      const color = i === 0 ? '#2ecc71' : '#27ae60';
      this.drawRect(
        segment.x * this.gridSize + 1,
        segment.y * this.gridSize + 1,
        this.gridSize - 2,
        this.gridSize - 2,
        color
      );
    });
    
    if (this.food) {
      this.drawCircle(
        this.food.x * this.gridSize + this.gridSize / 2,
        this.food.y * this.gridSize + this.gridSize / 2,
        this.gridSize / 2 - 2,
        '#e74c3c'
      );
    }
    
    if (this.gameOver) {
      this.drawRect(0, this.height / 2 - 40, this.width, 80, 'rgba(0,0,0,0.7)');
      this.drawText('Game Over', this.width / 2, this.height / 2, 28, '#fff');
      this.drawText(`得分: ${this.score}`, this.width / 2, this.height / 2 + 30, 16, '#fff');
    }
  }
  
  showGameOver() {
    this.gameOver = true;
    clearInterval(this.interval);
    this.draw();
  }
  
  onTouchStart(e) {
    this.touchStartX = e.changedTouches[0].clientX;
    this.touchStartY = e.changedTouches[0].clientY;
  }
  
  onTouchEnd(e) {
    const dx = e.changedTouches[0].clientX - this.touchStartX;
    const dy = e.changedTouches[0].clientY - this.touchStartY;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0 && this.direction !== 'left') this.nextDirection = 'right';
      else if (dx < 0 && this.direction !== 'right') this.nextDirection = 'left';
    } else {
      if (dy > 0 && this.direction !== 'up') this.nextDirection = 'down';
      else if (dy < 0 && this.direction !== 'down') this.nextDirection = 'up';
    }
  }
  
  cheat(action) {
    if (action === 'god') {
      this.godMode = !this.godMode;
    } else if (action === 'fast') {
      this.speed = 50;
      this.startLoop();
    }
  }
  
  getState() {
    return { score: this.score, snake: this.snake };
  }
  
  restart() {
    clearInterval(this.interval);
    this.init();
  }
}

module.exports = Snake;
