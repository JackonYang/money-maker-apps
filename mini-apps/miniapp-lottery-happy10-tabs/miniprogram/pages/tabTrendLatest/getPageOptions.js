// latest  history
const app = getApp();
const Utils = require('../../utils/util.js');

export default function getPageOptions(type) {
  return {
    /**
     * Page initial data
     */
    data: {
      pageType: type,
    },
    onShow() {
      const displayName = Utils.getRouteDisplayName(this.route);

      Utils.addHistoryUrl(this.route, displayName);
    },
    onSelectedChange(e) {
      if (e.detail) {
        const newUrl = `/pages/trend/index?page_type=${this.data.pageType}&site_name=${e.detail}`;
        this.goToPage(newUrl);
      }
    },
    goToPage: function (url) {
      wx.redirectTo({
        url: url,
      })
    },
  };
}
