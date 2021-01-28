const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
    const word = 'auction'
    const sentence = 'A spokeswoman said it was hoped that the auction would raise money for future conservation work.'
    const choices = [
      'a.惯例的,常规的',
      'n.会话,谈话',
      'ad.相反地',
      'n.转变,转换;信仰的改变;',
    ]

    this.setData({
      word,
      word_display: word,
      sentence,
      choices,
      audioUrl: `${app.globalData.config.recite_audio_prefix}${word}.mp3`,
      volumeImgUrl: app.globalData.config.recite_audio_icon_url,
    })
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

  playAudio: function () {
    console.log(this.data.audioUrl)
    wx.playBackgroundAudio({
      dataUrl: this.data.audioUrl,
      title: 'reading word!',
      success: function(e) {
        console.log('read sucess')
      },
      fail: function (e) {
        console.log(e)
      },
      complete: function (e) {
        console.log('done')
      },
    })
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})