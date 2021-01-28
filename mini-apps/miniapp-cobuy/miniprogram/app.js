const Api = require('/api/index.js');
const Const = require('./utils/const.js');

App({
  onLaunch () {
    this.globalData = {
      loaded: false,
      openid: '',
      // staging
      // production
      serverHostWins: 'http://127.0.0.1',
      serverHostStatic: 'https://127.0.0.1/',

      plans: [],
      userInfo: null,
      activeSite: {
        latest: Const.SITECHOICES[0].site_name,
        history: Const.SITECHOICES[0].site_name,
      },
      // activeSiteName: Const.SITECHOICES[0].site_name,
      siteNameChoices: Const.SITECHOICES,

      historyRoutes: [],
    };

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'prod-w2hrk',
        // env: 'dev-161608',
        traceUser: true,
      })

      wx.cloud.callFunction({
        name: 'getConfig',
        success: res => {
          const openid = res.result.openid;
          console.log('云函数获取到的openid: ', openid)
          this.globalData = { 
            ...this.globalData,
            openid,
          };  
          

          if (!openid) {
            this.globalData.loaded = true;
            return;
          };

          const self = this;
          wx.request({
            url: Api.getPlans(),
            data: {
              open_id: openid,
            },
            success (res) {
              self.globalData.plans = res.data.data;
              if (self.configLoadedCallback) {
                self.configLoadedCallback()
              }
            },
            complete() {
              self.globalData.loaded = true;
            },
          });
        },
        fail(res) {
            console.error('错误', res);
            wx.showModal({
              title: '出问题了 囧',
              content: '请退出重试，或联系 wx: kunth002',
            })
          }
      });

    }
  },

})
