Page({
  data: {
    isAct: false,
    isAct2: false,
    isAct3: false,
    stopAct: false
  },

  onShareAppMessage: function() {
    return {
      title: "百年傳承，匠心打造，德心經營，始記初心"
    }
  },

  onLoad: function () {
    wx.showShareMenu({
      withShareTicket: true
    });
  },

  onUnload: function () {
    clearTimeout(this.timer);
    this.setData({
      isAct: false,
      isAct2: false,
      isAct3: false,
      stopAct: true,
    })
  },

  onShow: function() {
    if (this.timer || this.data.stopAct) {
      return;
    };

    this.timer = setTimeout(() => {
      this.setData({
        isAct: true
      });
    },100);
  },

  transitionendAct1: function () {
    this.setData({
      isAct2: true
    });
  },

  transitionendAct2: function () {
    this.setData({
      isAct3: true
    });
  },

  onHide: function () {
    clearTimeout(this.timer);
    if (this.data.isAct && this.data.isAct2 && this.data.isAc3) return;

    this.setData({
      stopAct: true,
      isAct: true,
      isAct2: true,
      isAct3: true,
    });
  },

  tapGoBtn: function() {
    wx.switchTab({
      url: '/pages/shop/shop'
    })
  },

  tapLogo: function() {
    wx.switchTab({
      url: '/pages/story/story'
    })
  },
})
