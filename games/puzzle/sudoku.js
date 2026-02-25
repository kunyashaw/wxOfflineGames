const Game = require('../base/Game');

class Sudoku extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.cellSize = Math.min(36, (this.width - 40) / 9);
    this.offsetX = (this.width - this.cellSize * 9) / 2;
    this.offsetY = 40;
    this.board = [];
    this.solution = [];
    this.selected = null;
    this.score = 0;
  }

  init() {
    this.generateSudoku();
    this.score = 0;
    this.selected = null;
    this.draw();
  }

  generateSudoku() {
    this.solution = Array(9).fill(null).map(() => Array(9).fill(0));
    this.fillDiagonal();
    this.solveSudoku(this.solution);
    this.board = this.solution.map(row => [...row]);
    this.removeNumbers(40);
  }

  fillDiagonal() {
    for (let i = 0; i < 9; i += 3) {
      this.fillBox(i, i);
    }
  }

  fillBox(row, col) {
    let num;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        do {
          num = Math.floor(Math.random() * 9) + 1;
        } while (!this.isSafeBox(row, col, num));
        this.solution[row + i][col + j] = num;
      }
    }
  }

  isSafeBox(rowStart, colStart, num) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.solution[rowStart + i][colStart + j] === num) return false;
      }
    }
    return true;
  }

  isSafe(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num || board[x][col] === num) return false;
    }
    const startRow = row - row % 3, startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[startRow + i][startCol + j] === num) return false;
      }
    }
    return true;
  }

  solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (this.isSafe(board, row, col, num)) {
              board[row][col] = num;
              if (this.solveSudoku(board)) return true;
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  removeNumbers(count) {
    let attempts = count;
    while (attempts > 0) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (this.board[row][col] !== 0) {
        this.board[row][col] = 0;
        attempts--;
      }
    }
  }

  draw() {
    this.clear();
    this.drawRect(0, 0, this.width, this.height, '#f5f6fa');
    this.drawBoard();
    this.drawSelected();
  }

  drawBoard() {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const x = this.offsetX + j * this.cellSize;
        const y = this.offsetY + i * this.cellSize;
        const val = this.board[i][j];
        
        this.drawRect(x, y, this.cellSize, this.cellSize, '#fff');
        this.drawRect(x, y, this.cellSize, this.cellSize, '#333', 0.5);
        
        if (i % 3 === 0) this.drawRect(x, y, this.cellSize, 1, '#000', 2);
        if (j % 3 === 0) this.drawRect(x, y, 1, this.cellSize, '#000', 2);
        
        if (val > 0) {
          const color = this.solution[i][j] === val ? '#2c3e50' : '#3498db';
          this.drawText(val, x + this.cellSize / 2, y + this.cellSize / 2, 16, color);
        }
      }
    }
  }

  drawRect(x, y, w, h, color, lw = 1) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, w, h);
  }

  drawSelected() {
    if (this.selected) {
      const { row, col } = this.selected;
      const x = this.offsetX + col * this.cellSize;
      const y = this.offsetY + row * this.cellSize;
      this.ctx.strokeStyle = '#e74c3c';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(x + 2, y + 2, this.cellSize - 4, this.cellSize - 4);
    }
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
    
    if (row >= 0 && row < 9 && col >= 0 && col < 9) {
      this.selected = { row, col };
      this.draw();
    }
  }

  cheat(action) {
    if (action === 'show') {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (this.board[i][j] === 0) {
            this.board[i][j] = this.solution[i][j];
          }
        }
      }
      this.draw();
    }
  }

  getState() {
    return { score: this.score, board: this.board };
  }

  restart() {
    this.init();
  }
}

module.exports = Sudoku;
