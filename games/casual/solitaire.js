const Game = require('../base/Game');

class Solitaire extends Game {
  constructor(canvas, ctx, options) {
    super(canvas, ctx, options);
    this.deck = [];
    this.tableau = [[], [], [], [], [], [], []];
    this.foundations = [[], [], [], []];
    this.score = 0;
    this.selected = null;
    this.cardW = 35;
    this.cardH = 50;
  }

  init() {
    const suits = ['♥', '♦', '♠', '♣'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    this.deck = [];
    
    suits.forEach(suit => {
      ranks.forEach((rank, idx) => {
        this.deck.push({ suit, rank, value: idx + 1, color: (suit === '♥' || suit === '♦') ? 'red' : 'black' });
      });
    });
    
    this.deck.sort(() => Math.random() - 0.5);
    
    this.tableau = [[], [], [], [], [], [], []];
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j <= i; j++) {
        const card = this.deck.pop();
        if (j === i) card.flipped = true;
        else card.flipped = false;
        this.tableau[i].push(card);
      }
    }
    
    this.foundations = [[], [], [], []];
    this.score = 0;
    this.selected = null;
    this.updateScore(0);
    this.draw();
  }

  draw() {
    this.clear();
    this.drawRect(0, 0, this.width, this.height, '#1a472a');
    
    for (let i = 0; i < 4; i++) {
      const x = 20 + i * (this.cardW + 10);
      this.drawRect(x, 10, this.cardW, this.cardH, '#c9b896', 5);
      if (this.foundations[i].length > 0) {
        const card = this.foundations[i][this.foundations[i].length - 1];
        this.drawCard(card, x, 10);
      }
    }
    
    for (let col = 0; col < 7; col++) {
      const x = 15 + col * (this.cardW + 5);
      let y = 80;
      
      this.tableau[col].forEach((card, idx) => {
        if (card.flipped || idx === this.tableau[col].length - 1) {
          if (this.selected && this.selected.col === col && this.selected.idx === idx) {
            this.drawRect(x - 2, y - 2, this.cardW + 4, this.cardH + 4, '#f1c40f', 5);
          }
          if (card.flipped) {
            this.drawCard(card, x, y);
          } else {
            this.drawRect(x, y, this.cardW, this.cardH, '#2c3e50', 5);
          }
          y += 20;
        }
      });
    }
    
    this.drawText(`得分: ${this.score}`, this.width - 70, 30, 14, '#fff');
  }

  drawCard(card, x, y) {
    this.drawRect(x, y, this.cardW, this.cardH, '#fff', 5);
    this.drawText(card.suit, x + this.cardW / 2, y + this.cardH / 2, 18, card.color === 'red' ? '#e74c3c' : '#2c3e50');
    this.drawText(card.rank, x + 5, y + 12, 10, card.color === 'red' ? '#e74c3c' : '#2c3e50');
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

  drawText(text, x, y, size, color = '#000') {
    this.ctx.fillStyle = color;
    this.ctx.font = `${size}px sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, x, y);
  }

  onTouchEnd(e) {
    const touch = e.changedTouches[0];
    const y = touch.clientY;
    const x = touch.clientX;
    
    if (y < 70) {
      for (let i = 0; i < 4; i++) {
        const fx = 20 + i * (this.cardW + 10);
        if (x > fx && x < fx + this.cardW && y > 10 && y < 10 + this.cardH) {
          this.tapFoundation(i);
          return;
        }
      }
    }
    
    for (let col = 0; col < 7; col++) {
      const cx = 15 + col * (this.cardW + 5);
      let cy = 80;
      
      for (let idx = 0; idx < this.tableau[col].length; idx++) {
        const card = this.tableau[col][idx];
        if (card.flipped || idx === this.tableau[col].length - 1) {
          if (x > cx && x < cx + this.cardW && y > cy && y < cy + this.cardH) {
            this.tapTableau(col, idx);
            return;
          }
          cy += 20;
        }
      }
    }
  }

  tapTableau(col, idx) {
    if (this.selected) {
      const src = this.selected.col;
      const srcIdx = this.selected.idx;
      const card = this.tableau[src][srcIdx];
      const targetCard = this.tableau[col][idx];
      
      if (src !== col) {
        if (targetCard.color !== card.color && targetCard.value === card.value + 1) {
          this.tableau[col].push(this.tableau[src].pop());
          if (this.tableau[src].length > 0) {
            this.tableau[src][this.tableau[src].length - 1].flipped = true;
          }
          this.score += 5;
          this.updateScore(this.score);
        }
      }
      this.selected = null;
    } else {
      if (this.tableau[col][idx].flipped) {
        this.selected = { col, idx };
      }
    }
    this.draw();
  }

  tapFoundation(idx) {
    if (this.selected) {
      const card = this.tableau[this.selected.col][this.selected.idx];
      if (this.foundations[idx].length === 0) {
        if (card.value === 1) {
          this.foundations[idx].push(this.tableau[this.selected.col].pop());
          if (this.tableau[this.selected.col].length > 0) {
            this.tableau[this.selected.col][this.tableau[this.selected.col].length - 1].flipped = true;
          }
          this.score += 10;
          this.updateScore(this.score);
        }
      } else {
        const top = this.foundations[idx][this.foundations[idx].length - 1];
        if (top.suit === card.suit && card.value === top.value + 1) {
          this.foundations[idx].push(this.tableau[this.selected.col].pop());
          if (this.tableau[this.selected.col].length > 0) {
            this.tableau[this.selected.col][this.tableau[this.selected.col].length - 1].flipped = true;
          }
          this.score += 10;
          this.updateScore(this.score);
        }
      }
      this.selected = null;
      this.draw();
    }
  }

  cheat(action) {
    if (action === 'win') {
      this.foundations = this.deck.reduce((acc, card, i) => {
        acc[i % 4].push(card);
        return acc;
      }, [[], [], [], []]);
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

module.exports = Solitaire;
