const skeletonsConfig = require('../../config/skeletons.js');

Page({
  data: {
    skeletonData: skeletonsConfig.post,
    post: [],
    isLoading: true,
    isLoadError: false,
  },

  onShareAppMessage: function() {
    return {
      title: "百年傳承，匠心打造，德心經營，始記初心"
    }
  },

  // 手动刷新拉取最新的文章
  onPullDownRefresh: function () {
    this.getData(); 
  },

  onLoad: function (query) {
    const { id, updateTime } = query || {}
    this.id = id;
    this.updateTime = updateTime;

    // 是否取本地数据
    wx.getStorage({
      key: `post_${id}`,
      success: function (res) {
        const { data, updateTime } = res.data
        if (this.updateTime <= updateTime) {
          this.setPostData(data);
        } else {
          this.getData(id);
        }
      }.bind(this),
      fail: function () {
        this.getData(id);
      }.bind(this)
    });

    wx.showShareMenu({
      withShareTicket: true
    });
  },

  onUnload: function () {
    this.setData({
      post: []
    })
  },

  errorReload: function () {
    this.getData();
  },

  setPostData: function (data) {
    this.setData({
      post: data,
      isLoading: false,
      isLoadError: false,
    })
  },

  setStorageData (data) {
    if (this.id) {
      wx.setStorage({
        key: `post_${this.id}`,
        data: {
          updateTime: this.updateTime,
          data
        }
      });
    }
  },

  fetchError: function () {
    wx.stopPullDownRefresh();
    this.setData({
      isLoadError: true,
      isLoading: false,
    });
  },

  getData: function (id) {
    const app = getApp();
    id = id || this.id;

    // 无ID或无网提示错误
    if (!id || !app.isConnected) {
      this.fetchError();
      return;
    };

    this.setData({
      isLoading: true,
      isLoadError: false
    });

    const db = wx.cloud.database();
    db.collection('post').doc(id).get().then((res) => {
      wx.stopPullDownRefresh();
      this.setPostData(res.data.data);
      this.setStorageData(res.data.data);
    }).catch(() => {
      this.fetchError();
    });
  },

  setPreviewImage: function (current, urls) {
    if (!current || !urls || urls.length === 0) return

    wx.previewImage({
      current,
      urls
    })
  },

  tapImage: function (e) {
    const postList = this.data.post
    if (postList.length === 0) return

    const target = e.currentTarget
    const { dataset } = target || {}
    const { src } = dataset || {}
    let srcArr = []

    postList.forEach((item) => {
      if (item.type === 'image') {
        srcArr.push(item.src)
      }
    })

    this.setPreviewImage(src, srcArr)
  }
})
