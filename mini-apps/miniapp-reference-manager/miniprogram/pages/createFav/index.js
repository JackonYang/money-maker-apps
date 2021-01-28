const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    loaded: false,
    url: '',
    mathCount: 250,
    nextUrl: '/pages/bucketViewer/index',
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.bucketName = options.bucket
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
  },

  textChanged: function (e) {
    this.setData({
      url: e.detail.value
    })
  },

  postReq: function (urlValue) {
    const self = this
    const config = app.globalData.config
    const host = `${config.api_refs_host}`
    const url = `${host}${config.api_new_favs}`

    wx.request({
      url: url,
      method: 'POST',
      data: {
        userid: app.globalData.openid,
        url: urlValue,
      },
      success: function () {
      },
      fail: function (e) {
        wx.showModal({
          title: '数据加载失败',
          content: '请重试',
        })
      },
      complete: function (e) {
        // wx.hideLoading()
      }
    })
  },

  submit: function (e) {
    this.postReq(this.data.url)
    this.setData({
      url: '',
      length: 0,
    })

    wx.showToast({
      title: '后台处理中',
    })

    this.goToNextPage(this.data.nextUrl)

    // wx.showLoading({
    //   title: '后台处理中',
    //   mask: true,
    // })
  },

  goToNextPage: function (url) {
    wx.navigateTo({
      url: url,
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

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})