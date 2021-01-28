const app = getApp()

Component({
  properties: {
    plans: {
      type: Array,
    },
  },
  data: {
    confirmDialog: false,
    curConfirmPlan: null,
  },
  methods: {
    openConfrim(curPlan) {
      this.setData({
        confirmDialog: true,
        curConfirmPlan: curPlan.detail,
      });
    },
    onApplyConfirm() {
      console.log('确认报名x xx ');
    }
  }
})
