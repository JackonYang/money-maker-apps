Component({
  lifetimes: {
    created() {
      this.onCreated()
    },
    attached() {
      this.onAttached();
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
  attached() {
    this.onAttached();
  },
  detached() {
    // 在组件实例被从页面节点树移除时执行
  },
  created() {
    this.onCreated()
  },
  properties: {
    records: {
      type: Array,
      value: [],
      observer(newVal, oldVal, changedPath) {
        this.updateKjData(newVal)
      },
    },
    freqWindow: {
      type: Number,
      value: 20,
      observer(newVal, oldVal, changedPath) {
        this.setData({
          freqWindow: newVal,
        })
      },
    },
    fitWindow: {
      type: Boolean,
      value: true,
      observer(newVal, oldVal, changedPath) {
        this.setData({
          fitWindow: newVal,
        })
      },
    },
    page_type: {
      type: String,
      value: 'history',
    },
  },
  data: {
    // 这里是一些组件内部数据
    pixelRatio: NaN,
    windowWidth: NaN,
    windowHeight: NaN,
    tableMode: 'non-fixed-table',
    fitWindow: true,
    displayCnt : 40,
    tableData: [],
    freqWindow: 20,
    freqCnts: Array(20).fill({
      cnt: 0,
      order: 'middle',
    }),
  },
  methods: {
    onCreated() {
      const that = this;
      wx: wx.getSystemInfo({
        success: function (res) {
          const floatCnt = (res.windowHeight - 27 - 20 - 14) / 14
          that.setData({
            pixelRatio: res.pixelRatio,
            windowWidth: res.windowWidth,
            windowHeight: res.windowHeight,
            floatCnt,
          })
        }
      })
    },
    onAttached() {
    },
    updateKjData: function (records) {
      // TODO: why records could be undefined
      if (records === undefined || records.length === 0) {
        console.log('no new udpate from data source.')
        return
      }
      console.log('data changed. Refreshing freq-table...')
      const tableData = this.rebuildTableData(records)
      const freqCnts = this.calcNumFreq(records, this.data.freqWindow)

      let displayCnt;
      if (this.data.page_type == 'latest') {
        displayCnt = Math.floor(this.data.floatCnt) - 1
      } else {
        displayCnt = records[records.length - 1]['issue']
      }
      console.log(this.data.page_type, displayCnt)

      let sliceIdx = 1
      let tableMode = 'fixed-table'
      if (this.data.fitWindow) {
        // sliceIdx = -this.data.displayCnt
        sliceIdx = -displayCnt
        tableMode = 'non-fixed-table'
      }

      this.setData({
        tableData: tableData.slice(sliceIdx),
        freqCnts,
        tableMode,
        displayCnt,
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
    rebuildTableData: function(records) {
      let lastShow = Array(20).fill(0)  // temp variable to calc repeatCnt

      return records.map(r => {
        const head3 = r.win_num.slice(0, 3)
        const currentShow = Array(20).fill(1).map((x, y) => x + y).map(num => {
          let color = 'blue'
          if (head3.includes(num)) {
            color = 'red'
          }

          return {
            shouldShow: r.win_num.includes(num),
            color: color,
          }
        })

        let repeatCnt = 0
        for (let i = 0; i < 20; i++) {
          if (currentShow[i].shouldShow & lastShow[i].shouldShow) {
            repeatCnt += 1
          }
        }

        let oddCnt = 0
        for (let i = 0; i < 20; i += 2) {
          if (currentShow[i].shouldShow) {
            oddCnt += 1
          }
        }

        lastShow = currentShow

        return {
          issue: r.issue,
          win_num: r.win_num,
          head3: r.win_num.slice(0, 3),
          shouldShowSmall10: currentShow.slice(0, 10),
          shouldShowBig10: currentShow.slice(10),
          repeatCnt: repeatCnt,
          oddCnt: oddCnt,
        }
      })
    },
    calcNumFreq: function(records, freqWindow) {
      const freqs = Array(20).fill(0)

      records.slice(-freqWindow).forEach(ele => {
        ele.win_num.forEach(function (num) {
          freqs[num - 1] += 1
        })
      })

      const sortedFreqs = [...new Set(freqs)].sort(function (a, b) {
        return a - b;
      })

      const min1 = sortedFreqs[0]
      const min2 = sortedFreqs[1]
      const max1 = sortedFreqs.slice(-1)[0]
      const max2 = sortedFreqs.slice(-2, -1)[0]

      return freqs.map(function (ele, index) {
        let order = 'middle'
        if (ele === min1) {
          order = 'min1'
        } else if (ele === min2) {
          order = 'min2'
        } else if (ele === max1) {
          order = 'max1'
        } else if (ele === max2) {
          order = 'max2'
        }
        return {
          cnt: ele,
          order: order,
        }
      })
    },
  }
})
