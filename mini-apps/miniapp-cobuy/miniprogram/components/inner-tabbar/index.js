const app = getApp()
const Utils = require('../../utils/util.js');

Component({
  data: {
    tabbarList: [
      {
        text: '主页',
        iconPath: '../../images/tab/home.png',
        pagePath: '/pages/tabTrendLatest/index',
        pathType: 'tab',
        // selectedIconPath: '../../../images/tab/home_select.png',
      },
      {
        text: '我的',
        iconPath: '../../images/tab/wode.png',
        pagePath: '/pages/me/index',
        pathType: 'tab',
        // selectedIconPath: '../../images/tab/wode_select.png'
      },
      {
        text: '加入收藏',
        class: 'save-button',
        iconPath: '../../images/tab/save_white.png',
        // selectedIconPath: '../../images/tab/home_select.png'
      },
    ],
  },
  methods: {
    tabClick(e) {
      // console.log('点击11', e.currentTarget)
      if (e.currentTarget.dataset.index !== 0 && !e.currentTarget.dataset.index) return;

      const curTab = this.data.tabbarList[e.currentTarget.dataset.index];

      if (curTab.pathType === 'tab') {
        wx.switchTab({
          url: curTab.pagePath,
        });
      } else if (curTab.text === '加入收藏') {
        this.save();
      }
    },
    save() {
      const currentRoutes = getCurrentPages();
      const currentPageRoute = currentRoutes[currentRoutes.length - 1];
      let curUrl = currentPageRoute.route;
      let displayName = Utils.getRouteDisplayName(curUrl);

      if (currentPageRoute.options) {
        const queryKeys = Object.keys(currentPageRoute.options);

        queryKeys.forEach((k, idx) => {
          if (idx === 0) {
            curUrl = `${curUrl}?${k}=${currentPageRoute.options[k]}`;
          } else {
            curUrl = `${curUrl}&${k}=${currentPageRoute.options[k]}`;
          }
        });

        displayName = Utils.getRouteDisplayName(curUrl, {
          type: currentPageRoute.options['page_type'],
          site: currentPageRoute.options['site_name'],
        });
      }

      wx.cloud.callFunction({
        name: 'addFavorite',
        data: {
          url: curUrl,
          displayName,
        },
      }).then(res => {
        wx.showToast({
          title: '收藏成功',
          icon: 'success',
          duration: 2000,
        });
      }).catch(err => {
        console.error('add 失败', err);
        wx.showToast({
          title: '收藏失败',
          duration: 2000,
        });
      })
    }
  }
});
