const app = getApp();
const Api = require('../../api/index.js');

Page({
  data: {
    pid: '',
    plan: {},
    confirmDialog: false,
  },
  onLoad(query) {
    if (query.pid) {
      this.setData({
        pid: query.pid,
      });
      if (app.globalData.plans && app.globalData.plans.length) {
        this.findPlanFromPlans();
      } else {
        this.fetchUpdatePlans();
      }
    }
  },
  findPlanFromPlans() {
    if (this.data.pid && app.globalData && app.globalData.plans.length) {
      const tempPlan = app.globalData.plans.find(p => p.pid === this.data.pid);

      if (tempPlan) {
        this.setData({
          plan: tempPlan,
        });
      }
    }
  },
  fetchUpdatePlans() {
    const self = this;
    wx.request({
      url: Api.getPlans(),
      data: {
        open_id: openid,
      },
      success(res) {
        app.globalData.plans = res.data.data;
        self.findPlanFromPlans.bind(this)();
      },
    });
  },
  openConfrim(curPlan) {
    this.setData({
      confirmDialog: true,
    });
  },
  onApplyConfirm() {
    console.log('确认报名x xx ');
  },
  onShareAppMessage(res) {
    return {
      title: this.data.plan.title,
      path: `/pages/detail/index?pid=${this.data.plan.pid}`,
    };
  },
  goToList() {
    wx.navigateBack({
      fail() {
        wx.switchTab({
          url: '/pages/square/index',
        });
      },
    });
    // wx.navigateTo({
    //   url: '/pages/square/index',
    // });
  },
})
