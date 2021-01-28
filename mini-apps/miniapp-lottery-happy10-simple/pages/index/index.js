const util = require('../../utils/util.js')
const countdown = require('../../libs/countdown.js');

const app = getApp()

let timerId = null
let rewardedVideoAd = null

Page({
  data: {
    autoRefresh: true,
    records: [],
    fetched: 'v0.6',
    curIssue: 0,
    title: '走势图',
    tips: '',
    stopTime: null, // 截止
    stopTimeCountDown: null,  // 倒计时
    openTime: null, // 时间
    cntRewardedVideoAdSucc: 0,
    drop_update: false,
  },

  onPullDownRefresh: function() {
    // console.log('refreshing...')
    // this.fetchKjData()
  },

  fetchKjData: function() {
    const cntRewardedVideoAdSucc = this.data.cntRewardedVideoAdSucc
    const url = `${app.globalData.serverHostWins}/wins/latest?fetched=${this.data.fetched}&user_login_code=${app.globalData.user_login_code}&cntRewardedVideoAdSucc=${cntRewardedVideoAdSucc}&appid=caibaike`
    console.log(`loading ${url}`)
    wx.request({
      url: url,
      success: this.updateKjData,
    })
    if(this.data.autoRefresh) {
      setTimeout(this.fetchKjData, 7000)
    }
  },

  reRtartTimer: function(stopTime, openTime) {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    }

    if (openTime === undefined || openTime.length === 0) {
      return
    }

    let phase1Running = false

    const self = this
    timerId = countdown(
      function (ts) {
        let timeCountDown = '正在摇...'
        if (ts.value > 1000) {
          phase1Running = true
          timeCountDown = '倒计时: ' + ts.toString()
        }
        self.setData({
          stopTimeCountDown: timeCountDown,
        })
      },
      stopTime
    )

    if (!phase1Running) {
      clearInterval(timerId)

      timerId = countdown(
        function (ts) {
          let timeCountDown = '新结果获取中...'
          if (ts.value > 1000) {
            timeCountDown = '正在摇(' + ts.toString() + ')'
          }
          self.setData({
            stopTimeCountDown: timeCountDown,
          })
        },
        openTime
      )
    }
  },

  updateKjData: function(rsp) {
    if (this.data.drop_update) {
      return
    }
  
    const records = rsp.data.records
    // TODO: why records could be undefined
    const new_tips = rsp.data.tips
    const enableRewardedVideoAd = rsp.data.enableRewardedVideoAd
    const adTips = rsp.data.adTips || "看个 15 秒的小广告嘛 0.0"
    let cntRewardedVideoAdSucc = this.data.cntRewardedVideoAdSucc

    // console.log(new_tips)
    const new_title = rsp.data.title || this.data.title
    const that = this


    console.log('enableRewardedVideoAd', enableRewardedVideoAd, rewardedVideoAd)
    // 在页面onLoad回调事件中创建激励视频广告实例
    if (rewardedVideoAd && enableRewardedVideoAd && cntRewardedVideoAdSucc === 0) {
      console.log('showing ad. drop_update and disable autoRefresh', cntRewardedVideoAdSucc)
      that.setData({
        autoRefresh: false,
        drop_update: true,
      })

      wx.showModal({
        title: '提示',
        content: adTips,
        success (res) {
          if (res.confirm) {
            console.log('click confirm', cntRewardedVideoAdSucc)

            // 用户触发广告后，显示激励视频广告
            if (rewardedVideoAd) {
              console.log('showing rewardedVideoAd')
              rewardedVideoAd.show().catch(() => {
                // 失败重试
                videoAd.load()
                  .then(() => videoAd.show())
                  .catch(err => {
                    console.log('激励视频 广告显示失败')
                  })
              })
            } else {
              that.setData({
                autoRefresh: true,
                drop_update: false,
              })
            }
          } else if (res.cancel) {
            that.setData({
              autoRefresh: true,
              drop_update: false,
            })
          }
        }
      })
    }
  
    let tips_changed = false
    if (new_tips != this.data.tips) {
      tips_changed = true
    }
  
    if (records === undefined || records.length === 0) {
      console.log('no new udpate from data source.')
      if (tips_changed) {
        // console.log('tips changed');
        this.setData({
          tips: new_tips,
          title: new_title,
        })
      }
      return
    }
    console.log('data changed. Refreshing page...')

    // return
    const newFetchedCode = rsp.data.data_hash

    const curIssue = records[records.length - 1].issue
    // const nextDetail = {}
    const nextDetail = rsp.data.next_detail
    const openTime = util.formatDayTime(nextDetail.openTime)
    const stopTime = util.formatDayTime(nextDetail.stopTime)

    this.reRtartTimer(nextDetail.stopTime, nextDetail.openTime)

    wx.hideLoading()

    this.setData({
      records: records,
      fetched: newFetchedCode,
      curIssue: curIssue,
      stopTime: stopTime,
      openTime: openTime,
      tips: new_tips,
      title: new_title,
    })
    // console.log('render complete')

    // setTimeout(this.tableScrollToBottom, 500)
  },

  tableScrollToBottom: function () {
    // 使页面滚动到底部
    wx.pageScrollTo({
      scrollTop: 1000,
    })
  },

  onShareAppMessage: function(Object) {
    const that = this;
    return {
      title: that.data.title,
      path: 'pages/index/index',
    }
  },

  onLoad: function () {
    if (wx.createRewardedVideoAd) {
      rewardedVideoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-90fe2fd9f13b27f9'
      })
      rewardedVideoAd.onLoad(() => {
        console.log('rewardedVideoAd onLoad event emit')
      })
      rewardedVideoAd.onError((err) => {
        console.log('onError event emit', err)
      })
      rewardedVideoAd.onClose(res => {
        let cntRewardedVideoAdSucc = this.data.cntRewardedVideoAdSucc

        // 用户点击了【关闭广告】按钮
        if (res && res.isEnded) {
          cntRewardedVideoAdSucc = cntRewardedVideoAdSucc + 1
          // 正常播放结束，可以下发游戏奖励
        } else {
          console.log('closed. no reward')
          // 播放中途退出，不下发游戏奖励
        }
        this.setData({
          autoRefresh: true,
          drop_update: false,
          cntRewardedVideoAdSucc: cntRewardedVideoAdSucc,
        })
        this.fetchKjData()
      })
    }

    wx.showShareMenu({
      withShareTicket: true
    })
    wx.showLoading({
      title: '加载中...',
    })
    countdown.setLabels(
      '|秒|分|时|天||||||',
      '|秒|分|时|天||||||',
      '',
      '',
      '正在摇...');
  },

  onReady: function() {
    // this.fetchKjData()
  },

  onShow: function() {
    this.setData({
      autoRefresh: true,
    })
    this.fetchKjData()
  },

  onHide: function() {
    this.setData({
      autoRefresh: false,
    })
  },

  onUnload: function () {
    this.setData({
      autoRefresh: false,
    })
  },
})
