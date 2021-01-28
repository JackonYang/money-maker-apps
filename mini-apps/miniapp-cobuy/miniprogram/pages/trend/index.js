const Utils = require('../../utils/util.js')
const Const = require('../../utils/const.js')

const app = getApp();
Page({
  data: {
    pageType: 'latest', // 'latest' | 'history'
    currentRegion: app.globalData.activeSite.latest,
  },
  TypeMap: {
    latest: '最新',
    history: '昨日',
  },
  onLoad(options) {
    const { page_type, site_name } = options;
    this.addRoute(page_type, site_name);

    let { pageType } = this.data;
    if (page_type) {
      pageType = page_type
    }

    if (site_name && site_name !== app.globalData.activeSite.latest) {
      app.globalData.activeSite.latest = site_name;
    }

    const currentRegion = app.globalData.activeSite.latest;
    const title = this.build_title(pageType, currentRegion);

    wx.setNavigationBarTitle({
      title,
    });

    this.setData({
      pageType,
      title,
      currentRegion,
    });

  },
  // onShow() {
    // app.globalData.historyRoutes.add(this.route);
  // },
  build_title(pageType, currentRegion) {
    const currentSiteInfo = Const.SITECHOICES.filter(choice => choice.site_name === currentRegion);

    let currentSiteName = '';
    if (currentSiteInfo.length > 0) {
      currentSiteName = currentSiteInfo[0].site_name_cn.replace(/快乐10分/g, '');
    }
    const title = `${currentSiteName}快乐十分-${this.TypeMap[pageType]}走势`;
    return title;
  },

  addRoute(pageType, siteName) {
    const newUrl = this.get_page_full_url(pageType, siteName);

    const displayName = Utils.getRouteDisplayName(this.route, {
      type: pageType,
      site: siteName,
    });

    Utils.addHistoryUrl(newUrl, displayName);
  },

  get_page_full_url(pageType, siteName) {
    return `${this.route}?page_type=${pageType}&site_name=${siteName}`;
  },

  onShareAppMessage: function (Object) {
    const { pageType, currentRegion, title } = this.data;
    const url = this.get_page_full_url(pageType, currentRegion);

    return {
      title,
      path: url,
    }
  },

})
