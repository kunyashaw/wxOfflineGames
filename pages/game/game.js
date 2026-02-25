const storage = require('../../utils/storage');
const audio = require('../../utils/audio');
const { gameCategories } = require('../../utils/gameConfig');

const gameModules = {
  'puzzle_001': require('../../games/puzzle/2048'),
  'arcade_001': require('../../games/arcade/snake'),
};

Page({
  data: {
    gameId: '',
    gameName: '',
    score: 0,
    highScore: 0,
    showCheat: false,
    cheats: [],
    soundEnabled: true,
    isFavorite: false
  },
  onLoad(options) {
    const { id } = options;
    const game = this.findGame(id);
    const highScore = storage.getHighScore(id);
    const isFavorite = storage.isFavorite(id);
    const settings = storage.getUserData().settings;
    
    this.setData({
      gameId: id,
      gameName: game ? game.name : '游戏',
      highScore,
      cheats: this.getCheats(id),
      isFavorite,
      soundEnabled: settings.sound
    });
    
    this.initCanvas();
  },
  findGame(gameId) {
    for (const cat of gameCategories) {
      const game = cat.games.find(g => g.id === gameId);
      if (game) return game;
    }
    return null;
  },
  getCheats(gameId) {
    const cheatConfig = {
      'puzzle_001': [
        { name: '直接2048', action: 'to2048' },
        { name: '无限步数', action: 'infinite' }
      ],
      'arcade_001': [
        { name: '无敌模式', action: 'god' },
        { name: '加速模式', action: 'fast' }
      ]
    };
    return cheatConfig[gameId] || [];
  },
  initCanvas() {
    const query = wx.createSelectorQuery();
    query.select('#gameCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0] || !res[0].node) {
          console.error('Canvas init failed');
          return;
        }
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getSystemInfoSync().pixelRatio;
        
        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        ctx.scale(dpr, dpr);
        
        this.canvas = canvas;
        this.ctx = ctx;
        this.gameWidth = res[0].width;
        this.gameHeight = res[0].height;
        this.startGame();
      });
  },
  startGame() {
    const gameModule = gameModules[this.data.gameId];
    if (gameModule) {
      this.game = new gameModule(this.canvas, this.ctx, {
        width: this.gameWidth,
        height: this.gameHeight
      });
      this.game.onScoreUpdate = (score) => {
        this.setData({ score });
      };
      this.game.start();
    } else {
      this.showGameNotFound();
    }
  },
  showGameNotFound() {
    const ctx = this.ctx;
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
    ctx.fillStyle = '#fff';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('游戏开发中...', this.gameWidth / 2, this.gameHeight / 2);
  },
  onTouchStart(e) {
    if (this.game && this.game.onTouchStart) this.game.onTouchStart(e);
  },
  onTouchMove(e) {
    if (this.game && this.game.onTouchMove) this.game.onTouchMove(e);
  },
  onTouchEnd(e) {
    if (this.game && this.game.onTouchEnd) this.game.onTouchEnd(e);
  },
  goBack() {
    this.saveGame();
    wx.navigateBack();
  },
  saveGame() {
    if (this.game && this.game.getState) {
      const state = this.game.getState();
      storage.saveGame(this.data.gameId, {
        score: state.score || 0,
        ...state
      });
      storage.updateHighScore(this.data.gameId, state.score || 0);
    }
  },
  restartGame() {
    if (this.game && this.game.restart) {
      this.game.restart();
      this.setData({ score: 0 });
    }
  },
  toggleCheat() {
    this.setData({ showCheat: !this.data.showCheat });
  },
  applyCheat(e) {
    const cheat = e.currentTarget.dataset.cheat;
    if (this.game && this.game.cheat) {
      this.game.cheat(cheat.action);
      audio.playSound('success');
      wx.showToast({ title: '金手指已启用', icon: 'none' });
    }
  },
  toggleSound() {
    const enabled = !this.data.soundEnabled;
    audio.toggleSound(enabled);
    this.setData({ soundEnabled: enabled });
  },
  toggleFavorite() {
    const gameId = this.data.gameId;
    if (this.data.isFavorite) {
      storage.removeFavorite(gameId);
    } else {
      storage.addFavorite(gameId);
    }
    this.setData({ isFavorite: !this.data.isFavorite });
  },
  shareGame() {
    wx.showShareMenu();
  },
  onUnload() {
    this.saveGame();
  }
});
