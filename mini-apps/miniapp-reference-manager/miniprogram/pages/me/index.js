const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    linkGroups: [],
    actionMap: {},
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
    const { tabMeLinkGroups } = app.globalData.config

    const actionMap = {}
    let idCursor = 1

    const linkGroups = tabMeLinkGroups.map(group => {
      return group.map(nav => {
        const navId = idCursor++

        nav['id'] = navId
        actionMap[navId] = nav
        return nav
      })
    })
    this.setData({
      linkGroups,
      actionMap,
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  tapNav: function (e) {
    const { navId } = e.currentTarget.dataset
    const {
      url,
      display,
      desc,
    } = this.data.actionMap[navId]

    if (url) {
      this.goToPage(url)
    } else {
      wx.showModal({
        title: display,
        content: desc,
        showCancel: false,
      })
    }
  },

  goToPage: function (url) {
    wx.navigateTo({
      url: url,
    })
  },
  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})