const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    displayCursor: 0,
    wordsPerPage: 6,
    loaded: false,
    buttonText: '好了',
    wordListings: [
      // {
      //   "word_key": "see",
      //   "word_display": "see",
      //   "trans_zh": "看见",
      //   "pron": "siː",
      //   "pos": "v.",
      //   "_id": "see_0"
      // },
    ],
    isShowWordDetail: false,
    selectedWordDetail: {},
    selectedWordId: null,
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
    this.fetch_words_group()
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

  showWordDetail: function (e) {
    const tranId = e.detail.tranId
    const wordDetail = this.data.wordListingFull[tranId]

    this.setData({
      isShowWordDetail: true,
      selectedWordDetail: wordDetail,
      selectedWordId: tranId,
      markChoices: app.globalData.config.markChoices,
    })
  },

  markWord: function (e) {
    const eventDetail = e.detail
    const tranId = eventDetail.wordId
    const markType = eventDetail.markType
    const newWordListing = this.data.wordListings.map(function(tran) {
      if (tran._id === tranId) {
        tran.markType = markType
      }
      return tran
    })
    this.setData({
      wordListings: newWordListing,
      isShowWordDetail: false,
      selectedWordDetail: {},
      selectedWordId: null,
    })
  },

  submitMarking: function () {
    const self = this
    const config = app.globalData.config
    const url = `${config.api_corpus_protocol}://${config.api_corpus_domain}${config.api_uri_submit_markings}`

    const {
      wordListings,
    } = this.data

    const wordSeen = wordListings.map(function (tran) {
      return tran._id
    })
    const wordIgnore = wordListings.filter(function (tran) {
      return tran.markType == 'ignore'
    }).map(function (tran) {
      return tran._id
    })
    const wordUnknown = wordListings.filter(function (tran) {
      return tran.markType == 'unknown'
    }).map(function (tran) {
      return tran._id
    })

    wx.request({
      url: url,
      method: 'POST',
      data: {
        openid: app.globalData.openid,
        wordSeen,
        wordIgnore,
        wordUnknown,
      },
      success: function () {
        self.showNextPage()
      },
      fail: function (e) {
        wx.showModal({
          title: '数据加载失败',
          content: '请重试',
        })
      }
    })
  },

  showNextPage: function () {
    const {
      wordListingFull,
      displayOrder,
      wordsPerPage,
      displayCursor,
      bucketRemain,
    } = this.data

    const endIdx = displayCursor + wordsPerPage
    if (endIdx < displayOrder.length) {
      const wordListings = displayOrder.slice(displayCursor, endIdx).map(tranId => {
        return wordListingFull[tranId]
      })
      this.setData({
        displayCursor: endIdx,
        bucketRemain: Math.max(0, bucketRemain - wordsPerPage),
        wordListings,
      })
    } else {
      this.fetch_words_group()
    }
  },

  initWordListings: function (rsp) {
    const {
      wordListingFull,
      displayOrder,
    } = rsp.data

    const {
      wordsPerPage,
    } = this.data

    const endIdx = 0 + wordsPerPage
    const wordListings = displayOrder.slice(0, endIdx).map(tranId => {
      return wordListingFull[tranId]
    })

    this.setData({
      ...rsp.data,
      loaded: true,
      displayCursor: endIdx,
      wordListings,
      wordListingFull,
      displayOrder,
    })
  },

  fetch_words_group: function () {
    const self = this
    const config = app.globalData.config
    const url = `${config.api_corpus_protocol}://${config.api_corpus_domain}${config.api_uri_words_to_tag}`
    wx.request({
      url: url,
      data: {
        openid: app.globalData.openid,
      },
      success: function (rsp) {
        self.initWordListings(rsp)
      },
      fail: function (e) {
        wx.showModal({
          title: '数据加载失败',
          content: '请重试',
        })
      }
    })
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})