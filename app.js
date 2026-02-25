App({
  onLaunch() {
    this.initStorage();
  },
  initStorage() {
    const userData = wx.getStorageSync('userData') || {
      favorites: [],
      highScores: {},
      settings: { sound: true, music: true }
    };
    wx.setStorageSync('userData', userData);
  },
  globalData: {
    gameInstances: {}
  }
})
