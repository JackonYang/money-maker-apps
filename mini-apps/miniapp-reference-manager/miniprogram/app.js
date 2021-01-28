//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env: 'prod-bbcf7d',
        env: 'dev-22c5bf',
        traceUser: true,
      })
    }

    this.globalData = {
      loaded: false,
    }

    const self = this

    wx.cloud.callFunction({
      name: 'getConfig',
      success: rsp => {
        self.globalData = {
          ...self.globalData,
          ...rsp.result,
          loaded: true,
        }
        if (self.configLoadedCallback) {
          self.configLoadedCallback()
        }
      },
      fail(res) {
        console.log(res)
        wx.showModal({
          title: '出问题了 囧',
          content: '请退出重试，或联系 wx: kunth002',
        })
      }
    })
  }
})
