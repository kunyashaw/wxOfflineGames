const storage = require('../../utils/storage');
const audio = require('../../utils/audio');
const { gameCategories } = require('../../utils/gameConfig');

Page({
  data: {
    favorites: [],
    scores: [],
    settings: { sound: true, music: true }
  },
  onShow() {
    this.loadData();
  },
  loadData() {
    const userData = storage.getUserData();
    const scores = Object.entries(userData.highScores).map(([game, score]) => {
      const gameInfo = this.findGame(game);
      return { game: gameInfo ? gameInfo.name : game, score };
    });
    scores.sort((a, b) => b.score - a.score);
    
    const favorites = userData.favorites.map(id => {
      const gameInfo = this.findGame(id);
      return gameInfo ? gameInfo.name : id;
    });
    
    this.setData({
      favorites: favorites,
      scores: scores.slice(0, 10),
      settings: userData.settings
    });
  },
  findGame(gameId) {
    for (const cat of gameCategories) {
      const game = cat.games.find(g => g.id === gameId);
      if (game) return game;
    }
    return null;
  },
  toggleSound(e) {
    audio.toggleSound(e.detail.value);
    const data = storage.getUserData();
    data.settings.sound = e.detail.value;
    storage.saveUserData(data);
  },
  toggleMusic(e) {
    audio.toggleMusic(e.detail.value);
    const data = storage.getUserData();
    data.settings.music = e.detail.value;
    storage.saveUserData(data);
  }
});
