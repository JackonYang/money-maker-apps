// const routers = require('../../utils/routers.js')
const app = getApp()

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
    nextPageType: {
      type: String,
      value: 'null',
      // observer(newVal, oldVal, changedPath) {
      //   // this.navigateTo(newVal)
      // },
    },
  },
  data: {
    // 这里是一些组件内部数据
    linkGroups: [
      {
        'group_key': 'siteNameChoices',
        'links': app.globalData.siteNameChoices,
      }
    ],
  },
  methods: {
    onCreated() {
    },

    onLinkItemSelect: function (e) {
      const site_name = e.currentTarget.dataset.site_name;
      // app.globalData.activeSiteName = site_name;
      console.log('app-activeSiteName',site_name)
      this.triggerEvent('selectedChange', site_name);
      // const url = routers.getTrendPageUrl(this.data.nextPageType, site_name)
      // this.goToPage(url)
    },

    goToPage: function (url) {
      wx.navigateTo({
        url: url,
        success: function(res) {
          console.log('success navigateTo', res)
        }
      })
    },

  }
})
