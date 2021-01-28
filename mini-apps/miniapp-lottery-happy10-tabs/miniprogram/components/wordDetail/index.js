const app = getApp()


Component({
  lifetimes: {
    created () {
      this.onCreated ()
    },
    attached () {
      // 在组件实例进入页面节点树时执行
    },
    detached () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
  attached () {
    // 在组件实例进入页面节点树时执行
  },
  detached () {
    // 在组件实例被从页面节点树移除时执行
  },
  created () {
    this.onCreated ()
  },
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    wordInfo: {
      type: Object,
      value: {},
    },
  },
  data: {
  },
  methods: {
    onCreated () {

    },
  }
})
