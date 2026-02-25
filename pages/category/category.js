const { gameCategories } = require('../../utils/gameConfig');

Page({
  data: {
    category: null,
    categoryIndex: 0
  },
  onLoad(options) {
    const { id } = options;
    const index = gameCategories.findIndex(c => c.id === id);
    if (index !== -1) {
      this.setData({
        category: gameCategories[index],
        categoryIndex: index
      });
    }
  },
  goBack() {
    wx.navigateBack();
  },
  goToGame(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/game/game?id=${id}`
    });
  }
});
