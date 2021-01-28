const Api = require('../../api/index.js');
const app = getApp();

Page({
  data: {
    plans: [],
    isLoading: true,
  },
  onLoad(options) {
    // globalData 是否完成初始化
    if (app.globalData.loaded) {
      this.doInit()
    } else {
      // 由于 globalData 初始化 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.configLoadedCallback = () => {
        this.doInit.bind(this)();
      }
    }
  },
  onShow() {
    this.initPlansFromGlobal();
  },
  doInit(options) {
    this.initPlansFromGlobal();
    this.setData({
      isLoading: false,
    });

  },
  initPlansFromGlobal() {
    this.setData({
      plans: app.globalData.plans,
    });
  },
  fetchPlans() {
    this.setData({
      isLoading: true,
    });
    if (!app.globalData.openid) return;

    const self = this;
    const url = Api.getPlans();
    wx.request({
      url,
      data: {
        open_id: app.globalData.openid,
      },
      success(res) {
        self.setData({
          plans: res.data.data,
        });
      },
      complete() {
        this.setData({
          isLoading: false,
        });
      },
    });
  },
})