const STORAGE_KEY = 'userData';

function getUserData() {
  return wx.getStorageSync(STORAGE_KEY) || {
    favorites: [],
    highScores: {},
    settings: { sound: true, music: true }
  };
}

function saveUserData(data) {
  wx.setStorageSync(STORAGE_KEY, data);
}

function getGameSave(gameId) {
  const saves = wx.getStorageSync('gameSaves') || {};
  return saves[gameId] || null;
}

function saveGame(gameId, data) {
  const saves = wx.getStorageSync('gameSaves') || {};
  saves[gameId] = { ...data, timestamp: Date.now() };
  wx.setStorageSync('gameSaves', saves);
}

function addFavorite(gameId) {
  const data = getUserData();
  if (!data.favorites.includes(gameId)) {
    data.favorites.push(gameId);
    saveUserData(data);
  }
}

function removeFavorite(gameId) {
  const data = getUserData();
  data.favorites = data.favorites.filter(id => id !== gameId);
  saveUserData(data);
}

function updateHighScore(gameId, score) {
  const data = getUserData();
  if (!data.highScores[gameId] || score > data.highScores[gameId]) {
    data.highScores[gameId] = score;
    saveUserData(data);
  }
}

function getHighScore(gameId) {
  const data = getUserData();
  return data.highScores[gameId] || 0;
}

function isFavorite(gameId) {
  const data = getUserData();
  return data.favorites.includes(gameId);
}

module.exports = {
  getUserData,
  saveUserData,
  getGameSave,
  saveGame,
  addFavorite,
  removeFavorite,
  updateHighScore,
  getHighScore,
  isFavorite
};
