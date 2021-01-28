const app = getApp();
const Utils = require('../../utils/util.js');

Page({
  /**
   * Page initial data
   */
  data: {
    utils: [
      {
        name: '昨日走势图',
        key: 'historyTrend',
      },
    ],
  },
  onUtilClick(e) {
    console.log('e', e);
    switch (e.currentTarget.dataset.key) {
      case 'historyTrend':
        this.onHistoryClick();
        break;
      default:
        break;
    }
  },
  onHistoryClick() {
    wx.navigateTo({
      url: '/pages/trendHistory/index',
    });
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    console.info('onLoad tabUtils');
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
    const displayName = Utils.getRouteDisplayName(this.route);
    Utils.addHistoryUrl(this.route, displayName);
  },

  doInit: function (options) {
    console.log('globalData loaded. Initing')
  },
})
