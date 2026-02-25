const storage = require('../../utils/storage');
const audio = require('../../utils/audio');
const { gameCategories } = require('../../utils/gameConfig');

const gameModules = {
  'puzzle_001': require('../../games/puzzle/2048'),
  'puzzle_002': require('../../games/puzzle/sudoku'),
  'puzzle_003': require('../../games/puzzle/puzzle'),
  'puzzle_004': require('../../games/puzzle/memory'),
  'puzzle_005': require('../../games/puzzle/sokoban'),
  'puzzle_006': require('../../games/puzzle/huarong'),
  'puzzle_007': require('../../games/puzzle/connect'),
  'puzzle_008': require('../../games/puzzle/color'),
  'puzzle_009': require('../../games/puzzle/pipe'),
  'arcade_001': require('../../games/arcade/snake'),
  'arcade_002': require('../../games/arcade/tetris'),
  'arcade_003': require('../../games/arcade/breakout'),
  'arcade_004': require('../../games/arcade/racing'),
  'arcade_005': require('../../games/arcade/pinball'),
  'arcade_006': require('../../games/arcade/copter'),
  'arcade_007': require('../../games/arcade/shooter'),
  'arcade_008': require('../../games/arcade/miner'),
  'arcade_009': require('../../games/arcade/brickjump'),
  'arcade_010': require('../../games/arcade/iceslide'),
  'casual_001': require('../../games/casual/minesweeper'),
  'casual_002': require('../../games/casual/solitaire'),
  'casual_003': require('../../games/casual/mahjong'),
  'casual_004': require('../../games/casual/matchpair'),
  'casual_005': require('../../games/casual/clickmatch'),
  'chess_001': require('../../games/chess/gomoku'),
  'chess_002': require('../../games/chess/reversi'),
  'chess_003': require('../../games/chess/chess'),
  'chess_004': require('../../games/chess/maze'),
  'chess_005': require('../../games/chess/checkers'),
  'chess_006': require('../../games/chess/chinesechess'),
  'chess_007': require('../../games/chess/go'),
  'chess_008': require('../../games/chess/hunt'),
  'chess_009': require('../../games/chess/towerdefense'),
  'match3_001': require('../../games/match3/gemmatch'),
  'match3_002': require('../../games/match3/bubble'),
  'match3_003': require('../../games/match3/candy'),
  'match3_004': require('../../games/match3/zuma'),
  'match3_005': require('../../games/match3/fruitninja'),
  'match3_006': require('../../games/match3/icematch'),
  'match3_007': require('../../games/match3/animalmatch'),
  'match3_008': require('../../games/match3/cookiematch'),
  'match3_009': require('../../games/match3/gemswap'),
  'match3_010': require('../../games/match3/farmmatch'),
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
      'puzzle_002': [
        { name: '显示答案', action: 'show' }
      ],
      'puzzle_003': [
        { name: '一键还原', action: 'solve' }
      ],
      'puzzle_004': [
        { name: '翻开全部', action: 'reveal' }
      ],
      'puzzle_005': [
        { name: '直接过关', action: 'win' }
      ],
      'puzzle_006': [
        { name: '跳到出口', action: 'skip' }
      ],
      'puzzle_007': [
        { name: '自动连接', action: 'solve' }
      ],
      'puzzle_008': [
        { name: '时间延长', action: 'slow' }
      ],
      'puzzle_009': [
        { name: '全部连通', action: 'all' }
      ],
      'arcade_001': [
        { name: '无敌模式', action: 'god' },
        { name: '加速模式', action: 'fast' }
      ],
      'arcade_002': [
        { name: '消除一行', action: 'clear' },
        { name: '慢速模式', action: 'slow' }
      ],
      'arcade_003': [
        { name: '一球过关', action: 'win' }
      ],
      'arcade_004': [
        { name: '减速模式', action: 'slow' }
      ],
      'arcade_005': [
        { name: '低重力', action: 'gravity' }
      ],
      'arcade_006': [
        { name: '减速模式', action: 'slow' }
      ],
      'arcade_007': [
        { name: '激光模式', action: 'laser' }
      ],
      'arcade_008': [
        { name: '磁铁模式', action: 'magnet' }
      ],
      'arcade_009': [
        { name: '飞行模式', action: 'fly' }
      ],
      'arcade_010': [
        { name: '减速模式', action: 'slow' }
      ],
      'casual_001': [
        { name: '显示地雷', action: 'show' }
      ],
      'casual_002': [
        { name: '自动获胜', action: 'win' }
      ],
      'casual_003': [
        { name: '直接获胜', action: 'win' }
      ],
      'casual_004': [
        { name: '翻开全部', action: 'show' }
      ],
      'casual_005': [
        { name: '消除全部', action: 'all' }
      ],
      'chess_001': [
        { name: '自动获胜', action: 'win' }
      ],
      'chess_002': [
        { name: '自动获胜', action: 'win' }
      ],
      'chess_003': [
        { name: '自动获胜', action: 'win' }
      ],
      'chess_004': [
        { name: '显示路径', action: 'show' }
      ],
      'chess_005': [
        { name: '自动获胜', action: 'win' }
      ],
      'chess_006': [
        { name: '自动获胜', action: 'win' }
      ],
      'chess_007': [
        { name: '一键占位', action: 'fill' }
      ],
      'chess_008': [
        { name: '传送猎物', action: 'teleport' }
      ],
      'chess_009': [
        { name: '加钱', action: 'money' }
      ],
      'match3_001': [
        { name: '打乱', action: 'shuffle' }
      ],
      'match3_002': [
        { name: '清除', action: 'clear' }
      ],
      'match3_003': [
        { name: '自动消除', action: 'auto' }
      ],
      'match3_004': [
        { name: '清除球', action: 'clear' }
      ],
      'match3_005': [
        { name: '减速', action: 'slow' }
      ],
      'match3_006': [
        { name: '打乱', action: 'shuffle' }
      ],
      'match3_007': [
        { name: '自动消除', action: 'auto' }
      ],
      'match3_008': [
        { name: '打乱', action: 'shuffle' }
      ],
      'match3_009': [
        { name: '打乱', action: 'shuffle' }
      ],
      'match3_010': [
        { name: '打乱', action: 'shuffle' }
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
