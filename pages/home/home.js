const { gameCategories } = require('../../utils/gameConfig');

Page({
  data: {
    categories: gameCategories
  },
  goToCategory(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/category/category?id=${id}`
    });
  }
});
