
const app = getApp();

Component({
  lifetimes: {
    created() {
      this.onCreated()
    },
    attached() {
      // 在组件实例进入页面节点树时执行
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
  attached() {
    // 在组件实例进入页面节点树时执行
  },
  detached() {
    // 在组件实例被从页面节点树移除时执行
  },
  created() {
    this.onCreated()
  },
  properties: {
    curIssue: {
      type: Number,
      value: 0,
      observer(newVal, oldVal, changedPath) {
        this.fetchHotnData(newVal)
      },
    },
  },
  data: {
    // 这里是一些组件内部数据
    pixelRatio: NaN,
    windowWidth: NaN,
    windowHeight: NaN,
    playFreqs: [],
  },
  methods: {
    onCreated() {
      const that = this;
      wx: wx.getSystemInfo({
        success: function (res) {
          that.setData({
            pixelRatio: res.pixelRatio,
            windowWidth: res.windowWidth,
            windowHeight: res.windowHeight,
          })
        }
      })
    },
    fetchHotnData: function (curIssue) {
      const url = `${app.globalData.serverHostWins}/stats/hot?until=${curIssue}`
      // console.log(`loading ${url}`)
      const self = this
      wx.request({
        url: url,
        success: function (rsp) {
          const playFreqs = rsp.data.play_freqs
          // TODO: why records could be undefined
          if (playFreqs === undefined || playFreqs.length === 0) {
            console.log('playFreqs are not fetched')
            return
          }
          self.setData({
            playFreqs: playFreqs,
          })
        },
      })
      // this.tableScrollToBottom()
    },
    // tableScrollToBottom: function () {
    //   wx.createSelectorQuery().select('.tfooter').boundingClientRect(function (rect) {
    //     console.log(rect)
    //     // // 使页面滚动到底部
    //     // wx.pageScrollTo({
    //     //   scrollTop: rect.bottom
    //     // })
    //   }).exec()
    // },
  }
})
