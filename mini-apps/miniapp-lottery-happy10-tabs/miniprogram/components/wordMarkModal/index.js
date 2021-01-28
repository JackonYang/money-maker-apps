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
    //是否显示modal
    show: {
      type: Boolean,
      value: false,
    },
    //modal的高度
    height: {
      type: String,
      value: '75%',
    },
    wordId: {
      type: String,
      value: null,
    },
    markChoices: {
      type: Array,
      value: [
      ]
    },
  },
  data: {
  },
  methods: {
    onCreated () {

    },

    clickMask() {
      this.setData({ show: false })
    },

    clickContent() {

    },

    markWord (e) {
      const eventDetail = e.currentTarget.dataset
      eventDetail.wordId = this.data.wordId
      this.triggerEvent('markword', eventDetail)
    },
  }
})
