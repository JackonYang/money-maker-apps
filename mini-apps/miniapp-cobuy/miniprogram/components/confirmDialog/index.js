const app = getApp();
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';


Component({
  properties: {
    curConfirmPlan: {
      type: Object,
    },
    visible: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    confirmDialog: false,
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
    onApply() {
      const wechat = this.data.curConfirmPlan.seller.wechat_id;
      wx.setClipboardData({
        data: wechat,
        success: (result)=>{
          Toast.success({
            context: this,
            message: '复制成功！',
          });
        },
      });
      this.triggerEvent('confirmApply', this.data.curConfirmPlan);
    }
  }
})
