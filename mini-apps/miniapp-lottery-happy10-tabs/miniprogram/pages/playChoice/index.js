const app = getApp()

Page({
  /**
   * Page initial data
   */
  data: {
    linkGroups: [],
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
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

  doInit: function (options) {
    this.setData({
      linkGroups: [
        {
          'group_key': 'gameChoices',
          'links': app.globalData.gameChoices,
        }
      ],
    })
  },
})
