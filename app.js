App({
  onLaunch: function () {
    if (!wx.cloud) {
      // console.log('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env: 'release-x9bgs',
        env: 'dev-cuit8'
      });
    }

    wx.onNetworkStatusChange(function(res) {
      this.isConnected = res.isConnected
    }.bind(this));
  },

  isConnected: true,

  wxRequire: function (opt, success, fail) {
    if (!opt) return [];
    let ret = [];

    wx.request({
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (typeof success !== 'function') return;
        success(res);
      },
      fail: function () {
        if (typeof fail !== 'function') return;
        fail();
      },
      ...opt,
    });
  }
})