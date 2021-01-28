const util = require('../../utils/util.js')
const routers = require('../../utils/routers.js')
const countdown = require('../../libs/countdown.js');
const Api = require('../../api/index.js')

const app = getApp();

const FETCH_INTERVAL = 7000;

let timerId = null

Component({
  properties: {
    type: {
      type: String,
      // value: '',
      optionalTypes: ['latest', 'history'],
    },
    siteName: {
      type: String,
      optionalTypes: () => {
        return Util.getAllSiteName(app.globalData.siteNameChoices);
      }
    }
  },
  data: {
    dataFrom: 'web.icaile.com',
    autoRefresh: true,
    records: [],
    fetched: Date.now(),
    curIssue: 0,
    tips: '',
    stopTime: null, // 投注截止
    stopTimeCountDown: null,  // 投注截止倒计时
    openTime: null, // 开奖时间
  },
  lifetimes: {
    attached: function() {
      this.onAttached();
    },
    detached: function() {
      this.onDetached();
    },
  },
  attached: function() {
    this.onAttached();
  },
  detached: function () {
    this.onDetached();
  },
  // 组件所在页面的生命周期
  pageLifetimes: {
    show() {
      this.setData({
        autoRefresh: true,
      });

      this.fetchKjData(this.data.siteName);
    },

    hide() {
      this.setData({
        autoRefresh: false,
      })
    },
  },
  methods: {
    onAttached() {
      this.initData();
    },
    onDetached() {
      this.setData({
        autoRefresh: false,
      })
    },
    initData() {
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
      )
    },
    onPullDownRefresh: function() {
      // console.log('refreshing...')
      // this.fetchKjData()
    },

    fetchKjData: function (activeSiteName) {
      if (!activeSiteName) {
        console.error('activeSiteName is null');
        return
      }

      if (this.data.type == 'history') {
        const date = util.formatDate(util.getYesterdaysDate())
        const url = Api.getHistoryData(activeSiteName, date)
        console.log(`获取 history 数据： ${url}`)
        wx.request({
          url: url,
          success: this.updateHisData.bind(this),
        })
        return
      }

      const url = Api.getLatestData(activeSiteName, this.data.fetched)
      console.log(`获取 latest 数据： ${url}`)
      wx.request({
        url: url,
        success: this.updateKjData.bind(this),
      })

      if(this.data.autoRefresh) {
        const self = this
        setTimeout(() => {
          self.fetchKjData(activeSiteName)
        }, FETCH_INTERVAL)
      }
    },

    restartTimer: function(stopTime, openTime) {
      if (timerId) {
        clearInterval(timerId)
        timerId = null
      }

      if (openTime === undefined || openTime.length === 0) {
        return
      }

      if (!this.countdownLottery(stopTime)) {
        clearInterval(timerId)
        this.countdownDraw(openTime);
      }
    },
    /**
    * 摇奖倒计时
    * ! 会改变全局 timerId
    * @return 摇奖是否结束，开始开奖
    */
    countdownLottery(stopTime) {
      const self = this;
      let phase1Running = false;
      timerId = countdown((ts) => {
          // console.log('countdown ts', ts);
          let timeCountDown = '摇奖中...'
          if (ts.value > 1000) {
            phase1Running = true
            timeCountDown = ts.toString()
          }
          self.setData({
            stopTimeCountDown: timeCountDown,
          })
        },
        stopTime
      );

      return phase1Running;
    },
    /**
    * 开奖倒计时
    * ! 会改变全局 timerId
    */
    countdownDraw(openTime) {
      const self = this;
      timerId = countdown((ts) => {
        self.setData({
          stopTimeCountDown: ts.value > 1000 ? `摇奖中(${ts.toString()})` : '开奖结果获取中',
        });
      }, openTime);
    },
    updateKjData: function(rsp) {
      // console.log('获取 数据', rsp);
      const { records, data_hash: newFetchedCode, next_detail: nextDetail } = rsp.data;
      // TODO: why records could be undefined
      if (!records || !records.length) {
        // console.log('no new udpate from data source.')
        return
      }
      console.log('data changed. Refreshing page...')

      const curIssue = records[records.length - 1].issue
      const openTime = util.formatDayTime(nextDetail.openTime)
      const stopTime = util.formatDayTime(nextDetail.stopTime)

      let tips = ''
      if (rsp.data.tips.length > 0) {
        tips = rsp.data.tips;
        console.log('tips from server: ' + tips)
      }

      this.restartTimer(nextDetail.stopTime, nextDetail.openTime)

      wx.hideLoading()

      this.setData({
        records: records,
        fetched: newFetchedCode,
        curIssue: curIssue,
        stopTime: stopTime,
        openTime: openTime,
        tips: tips,
      })

      // setTimeout(this.tableScrollToBottom, 500)
    },

    updateHisData: function (rsp) {
      // console.log('获取 数据', rsp);
      const records = rsp.data;

      // TODO: why records could be undefined
      if (!records || !records.length) {
        // console.log('no new udpate from data source.')
        return
      }

      const day = records[records.length - 1]['day']
      let tips = `${day} 全天开奖结果`

      wx.hideLoading()

      this.setData({
        records: records,
        tips: tips,
      })

      // setTimeout(this.tableScrollToBottom, 500)
    },

    tableScrollToBottom: function () {
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: 1000,
      })
    },

    onShareAppMessage: function(Object) {
      const url = routers.getTrendPageUrl('trendLatest', this.data.siteName);

      return {
        title: '快乐十分-最新走势图',
        path: url,
      }
    },
  },
})
