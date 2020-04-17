
const backData = require('../../config/shop_backup');

Page({
  data: {
    shopImageColSkt: new Array(2),
    shopImageSkt: new Array(3),
    info: backData.info,
    shopImage: []
  },

  onShareAppMessage: function() {
    return {
      title: "百年傳承，匠心打造，德心經營，始記初心"
    }
  },

  onPullDownRefresh: function () {
    if (this.data.shopImage.length > 0) {
      wx.stopPullDownRefresh();
      return;
    };
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
      shopImage: []
    })
  },

  getData: function () {
    const app = getApp();
    if (!app.isConnected) {
      this.fetchError();
      return;
    }

    const db = wx.cloud.database();
    db.collection('shopImage').limit(10).get().then((res) => {
      wx.stopPullDownRefresh();
      this.setShopImageData(res.data)
    }).catch(() => {
      this.fetchError();
    });
  },

  setShopImageData: function (data) {
    this.setData({
      shopImage: data,
    });
  },

  fetchError: function () {
    wx.stopPullDownRefresh();
  },

  makePhoneCall: function (e) {
    const { phoneNumber } = e.currentTarget.dataset;
    if (!phoneNumber) return;

    wx.makePhoneCall({
      phoneNumber
    });
  },

  checkLocation: function(e) {
    wx.openLocation({
      latitude: 23.380989,
      longitude: 110.515777,
      name: '德記大安點心',
      address: '广西贵港市平南县大安镇镇新南路(吉祥窗帘)',
    });
  },

  setPreviewImage: function (current, urls) {
    if (!current || !urls || urls.length === 0) return;
    wx.previewImage({
      current,
      urls
    });
  },

  tapImage: function (e) {
    const shopImage = this.data.shopImage
    if (shopImage.length === 0) return

    const target = e.currentTarget
    const { dataset } = target || {}
    const { src } = dataset || {}
    let srcArr = []

    shopImage.forEach((item) => {
      const { srcs } = item || {}
      if (!srcs) return;

      srcs.forEach((item) => {
        srcArr.push(item.src)
      });
    })

    this.setPreviewImage(src, srcArr)
  }
})
