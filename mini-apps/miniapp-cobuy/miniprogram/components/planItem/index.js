// const routers = require('../../utils/routers.js')
const app = getApp()

Component({
  properties: {
    planData: {
      type: Object,
      value: null,
      // observer(newVal, oldVal, changedPath) {
      //   // this.navigateTo(newVal)
      // },
    },
  },
  data: {
  },
  lifetimes: {
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
  methods: {
    onHandleApply(e) {
      this.triggerEvent('apply', this.data.planData);
    },
    goToDetail(e) {
      wx.navigateTo({
        url: `/pages/detail/index?pid=${this.data.planData.pid}`,
      });
      // wx.navigateTo({
      //   url: url,
      //   success: function(res) {
      //     console.log('success navigateTo', res)
      //   }
      // })
    },
  }
})
