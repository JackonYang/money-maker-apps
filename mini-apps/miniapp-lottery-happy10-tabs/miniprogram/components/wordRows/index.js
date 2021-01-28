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
    wordListings: {
      type: Array,
      value: [],
    },
  },
  data: {
  },
  methods: {
    onCreated() {

    },

    onAttached() {

    },

    tapWord(e) {
      const eventDetail = e.currentTarget.dataset
      this.triggerEvent('tapword', eventDetail)
      // console.log('triggered', eventDetail)
    },
  }
})
