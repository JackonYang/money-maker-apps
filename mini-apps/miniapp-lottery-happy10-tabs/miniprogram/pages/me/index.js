const app = getApp()
// const routes = require('../../app.json');

Page({

  /**
   * Page initial data
   */
  data: {
    historyUrls: [],
    // {
    //   _id: xx
    //   openid: xx
    //   url: 'aaaa'
    //   displayName: ',
    // },
    favUrls: [],
    sortFavUrls: [],
    showFavAll: false,
  },
  onLoad(options) {
    // globalData 是否完成初始化
    if (app.globalData.loaded) {
      this.doInit()
    } else {
      // 由于 globalData 初始化 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.configLoadedCallback = () => {
        this.doInit()
      }
    }
  },
  onShow() {
    this.doInit();
  },
  doInit(options) {
    this.initHistory();
    this.initFavs();
  },
  initHistory() {
    this.setData({
      historyUrls: app.globalData.historyRoutes,
    });
  },
  initFavs() {
    wx.cloud.callFunction({
      name: 'getFavorite',
    }).then((resp) => {
      this.setData({
        favUrls: resp.result.reverse(),
        showFavAll: false,
      });
      if (resp.result.length > 5) {
        this.setData({
          sortFavUrls: this.data.favUrls.slice(0, 5),
        });
      }
      console.log('resp', this.data.favUrls, this.data.sortFavUrls);

    }).catch((err) => {
      console.error('get favorite 失败', err);
    });
  },
  showAllToggle() {
    console.log('show all toggle', this.data.showFavAll);
    this.setData({
      showFavAll: !this.data.showFavAll,
    });
  },
  goToPage(e) {
    const { url } = e.currentTarget.dataset;
    const reg = /pages\/tab/;
    if (reg.test(url)) {
      wx.switchTab({
        url: `/${url}`,
      });
    } else {
      wx.navigateTo({
        url: `/${url}`,
      });
    }
  }
})
