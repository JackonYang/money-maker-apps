const app = getApp()

Component({
  lifetimes: {
    created() {
      this.onCreated()
    },
    attached() {
      this.onAttached()
      // 在组件实例进入页面节点树时执行
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
  attached() {
    this.onAttached()
    // 在组件实例进入页面节点树时执行
  },
  detached() {
    // 在组件实例被从页面节点树移除时执行
  },
  created() {
    this.onCreated()
  },
  properties: {
    tranId: {
      type: String,
      value: null,
      observer(newVal, oldVal, changedPath) {
        const {
          dataLoaded,
        } = this.data

        if (dataLoaded) {
          this.updateStarStatus(newVal)
        } else {
          this.dataLoadedCallback = () => {
            this.updateStarStatus(newVal)
          }
        }
      }
    },
  },
  data: {
    dataLoaded: false,
    // starIconUrl: 
  },
  methods: {
    onCreated() {
      this.requestPool = {}
      this.starCache = {}

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

    doInit(options) {
      this.fetch_words_group()
    },

    updateStarStatus(tranId) {
      this.setStarStatus(tranId, this.starCache[tranId] || false)
    },

    setStarStatus(tranId, isStared) {
      let starIconUrl = this.data.starFalseIconUrl
      if (isStared) {
        starIconUrl = this.data.starTrueIconUrl
      }

      this.starCache[tranId] = isStared
      this.setData({
        isStared,
        starIconUrl,
      })
    },

    onAttached() {
      const {
        starTrueIconUrl,
        starFalseIconUrl,
      } = app.globalData.config

      this.setData({
        starTrueIconUrl,
        starFalseIconUrl,
        starIconUrl: starFalseIconUrl,
      })
    },

    taggleStar: function (e) {
      const {
        tranId,
      } = e.currentTarget.dataset

      const isStared = !(this.starCache[tranId] || false)
      this.setStarStatus(tranId, isStared)

      if (!this.requestPool.hasOwnProperty(tranId)) {
        this.requestPool[tranId] = 1
      } else {
        this.requestPool[tranId]++
      }

      this.submitStarStatus(tranId, this.requestPool[tranId], isStared)
    },

    submitStarStatus(tranId, seqId, isStared) {
      const self = this
      setTimeout(() => {
        if (self.requestPool[tranId] > seqId) {
          return
        }
        self.postRequest(tranId, isStared)
      }, 500)
    },

    postRequest(tranId, isStared) {
      // submit to server side
      const config = app.globalData.config
      const url = `${config.api_corpus_protocol}://${config.api_corpus_domain}${config.api_uri_set_star_status}`

      wx.request({
        url: url,
        method: 'POST',
        data: {
          openid: app.globalData.openid,
          tranId,
          isStared,
        },
        success: function () {
          let title = '加星'
          if (!isStared) {
            title = '取消加星'
          }
          wx.showToast({
            title: `${title} 已保存`,
            icon: 'success',
            duration: 1000,
          })
        },
        fail: function (e) {
          wx.showModal({
            title: '星标保存至云端失败',
            content: '请重试',
          })
        }
      })
    },

    fetch_words_group() {
      const self = this
      const config = app.globalData.config
      const url = `${config.api_corpus_protocol}://${config.api_corpus_domain}${config.api_uri_user_bucket_word_ids}`
      wx.request({
        url: url,
        data: {
          openid: app.globalData.openid,
          bucket: 'stared',
        },
        success: function (rsp) {
          self.setData({
            dataLoaded: true,
          })
          const staredIds = rsp.data.ids

          staredIds.forEach(tranId => {
            self.starCache[tranId] = true
          })

          if (self.dataLoadedCallback) {
            self.dataLoadedCallback()
          }
        },
        fail: function (e) {
          wx.showModal({
            title: '数据加载失败',
            content: '请重试',
          })
        }
      })
    },
  }
})
