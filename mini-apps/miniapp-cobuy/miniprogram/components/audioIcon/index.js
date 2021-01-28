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
    wordId: {
      type: String,
      value: null,
    },
  },
  data: {
  },
  methods: {
    onCreated() {
      // // globalData 是否完成初始化
      // if (app.globalData.loaded) {
      //   this.doInit()
      // } else {
      //   // 由于 globalData 初始化 是网络请求，可能会在 Page.onLoad 之后才返回
      //   // 所以此处加入 callback 以防止这种情况
      //   app.configLoadedCallback = () => {
      //     this.doInit()
      //   }
      // }
    },

    onAttached() {
      const {
        audioIconUrl,
        audioUrlPrefix,
      } = app.globalData.config

      this.setData({
        audioIconUrl,
        audioUrlPrefix,
      })
    },

    // doInit() {
    //   const {
    //     audioIconUrl,
    //     audioUrlPrefix,
    //   } = app.globalData.config

    //   this.setData({
    //     audioIconUrl,
    //     audioUrlPrefix,
    //   })
    //   console.log(this.data)
    // },

    playAudio: function (e) {
      const {
        wordId,
      } = e.currentTarget.dataset

      wx.playBackgroundAudio({
        dataUrl: `${this.data.audioUrlPrefix}${wordId}.mp3`,
        title: 'reading word!',
        success: function (e) {
          // console.log(e)
          // 音频不存在也是 success
        },
        fail: function (e) {
          // wx.showToast({
          //   title: 'Sorry, 音频不存在',
          //   icon: 'none',
          //   duration: 2000,
          // })
        },
        complete: function (e) {
        },
      })
    },
  }
})
