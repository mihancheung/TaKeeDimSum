Page({
  data: {
    skeletonData: new Array(3),
    list: [],
    isLoading: true,
    isLoadError: false
  },

  onShareAppMessage: function() {
    return {
      title: "百年傳承，匠心打造，德心經營，始記初心"
    }
  },

  onPullDownRefresh: function () {
    this.getData(); 
  },

  onLoad: function () {
    this.getData();

    wx.showShareMenu({
      withShareTicket: true
    });
  },

  onUnload: function () {
    this.setData({
      list: []
    })
  },

  fetchError: function () {
    wx.stopPullDownRefresh();
    this.setData({
      isLoadError: true,
      isLoading: false,
    });
  },

  errorReload: function () {
    this.getData();
  },

  setListData: function (data) {
    this.setData({
      list: data,
      isLoading: false,
      isLoadError: false
    })
  },

  getData: function () {
    const app = getApp();
    if (!app.isConnected) {
      this.fetchError();
      return;
    }

    this.setData({
      isLoading: true,
      isLoadError: false
    });

    const db = wx.cloud.database();
    db.collection('story').where({
      isHide: false
    }).get().then((res) => {
      wx.stopPullDownRefresh();
      res.data.forEach((item) => {
        let dateStr = item.updateTime
        if (typeof dateStr !== 'string') {
          dateStr = JSON.stringify(item.updateTime).replace(/"/g, '');
        }
        item.updateTime = +new Date(dateStr);
      });
      this.setListData(res.data)
    }).catch(() => {
      this.fetchError();
    });
  }
})
