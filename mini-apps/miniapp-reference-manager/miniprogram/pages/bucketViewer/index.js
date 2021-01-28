const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    loaded: false,
    showBucketHeader: false,
    urlNewFav: '/pages/createFav/index',
    // bucketTitleDisplay: '',
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
    this.fetchListings()
  },

  goToNewFav: function (e) {
    wx.navigateTo({
      url: this.data.urlNewFav,
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

  showDetail: function (e) {
    const rowId = e.detail.rowId
    const rowDetail = this.data.listings[rowId]
    console.log(rowDetail)

    const oss_domain = app.globalData.config.api_favs_oss_host
    const ossUrl = `${oss_domain}/${rowDetail.ossKey}`

    wx.downloadFile({
      url: ossUrl,
      success(res) {
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath,
          success(res) {
            console.log('打开文档成功')
          }
        })
      }
    })
  },

  markWord: function (e) {
    const self = this

    const eventDetail = e.detail
    const tranId = eventDetail.wordId
    const markType = eventDetail.markType

    let oldMarkType = self.bucketName  // default value to avoid unexpected exceptions

    // ignore in display list
    const newWordListing = this.data.wordListings.map(function (tran) {
      if (tran._id === tranId) {
        oldMarkType = tran.realMarkType || self.bucketName
        tran.realMarkType = markType
        if (markType != self.bucketName) {
          // ignore in current bucket display
          tran.markType = 'ignore'
        } else {
          tran.markType = 'show'
        }
      }
      return tran
    })

    if (oldMarkType == markType) {
      wx.showToast({
        title: '您未修改标注',
        icon: 'none',
        duration: 1000,
      })

      this.setData({
        isShowWordDetail: false,
        selectedWordDetail: {},
        selectedWordId: null,
      })
      return
    }

    let bucketTotal = this.data.bucketTotal
    if (oldMarkType == this.bucketName) {
      bucketTotal--
    }
    else if (markType == this.bucketName) {
      bucketTotal++
    }

    this.setData({
      wordListings: newWordListing,
      bucketTotal,
      isShowWordDetail: false,
      selectedWordDetail: {},
      selectedWordId: null,
    })

    // submit to server side
    const config = app.globalData.config
    const url = `${config.api_corpus_protocol}://${config.api_corpus_domain}${config.api_uri_update_markings}`

    wx.request({
      url: url,
      method: 'POST',
      data: {
        openid: app.globalData.openid,
        tranId,
        oldMarkType,
        markType,
      },
      success: function () {
        wx.showToast({
          title: '标注已更新',
          icon: 'success',
          duration: 1000,
        })
      },
      fail: function (e) {
        wx.showModal({
          title: '数据加载失败',
          content: '请重试',
        })
      }
    })
  },

  initListings: function (rsp) {
    const {
      listings,
      displayOrder,
    } = rsp.data

    const listingDisplays = displayOrder.map(listingId => {
      return listings[listingId]
    })

    this.setData({
      ...rsp.data,
      loaded: true,
      listings,
      displayOrder,
      listingDisplays,
    })
    // console.log(listingDisplays)
  },

  fetchListings: function () {
    const self = this
    const config = app.globalData.config
    const host = `${config.api_refs_host}`
    const url = `${host}${config.api_my_favs}`

    wx.request({
      url: url,
      data: {
        userid: app.globalData.openid,
        // bucket: self.bucketName,
      },
      success: function (rsp) {
        self.initListings(rsp)
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