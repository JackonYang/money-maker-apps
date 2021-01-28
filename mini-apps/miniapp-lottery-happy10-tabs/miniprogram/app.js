const Const = require('./utils/const.js')

App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'prod-w2hrk',
        // env: 'dev-161608',
        traceUser: true,
      })
    }

    this.globalData = {
      loaded: true,
      // staging
      // production
      serverHostWins: 'https://127.0.0.1/',
      serverHostStatic: 'https://127.0.0.1/',

      // debug

      userInfo: null,
      activeSite: {
        latest: Const.SITECHOICES[0].site_name,
        history: Const.SITECHOICES[0].site_name,
      },
      // activeSiteName: Const.SITECHOICES[0].site_name,
      siteNameChoices: Const.SITECHOICES,

      historyRoutes: [],
    }

    // const self = this

    // wx.cloud.callFunction({
    //   name: 'getConfig',
    //   success: rsp => {
    //     self.globalData = {
    //       ...self.globalData,
    //       ...rsp.result,
    //       loaded: true,
    //     }
    //     if (self.configLoadedCallback) {
    //       self.configLoadedCallback()
    //     }
    //   },
    //   fail(res) {
    //     console.log(res)
    //     wx.showModal({
    //       title: '出问题了 囧',
    //       content: '请退出重试，或联系 wx: kunth002',
    //     })
    //   }
    // })
  }
})
