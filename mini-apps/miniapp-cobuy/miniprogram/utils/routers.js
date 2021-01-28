/**
 * 组成走势图的地址
 * @param {string} pageType 走势图页面的类型 trendLatest | trendHistory
 * @param {string} siteName 地区的 name 的字段，可查看 global.siteNameChoices 的 site_name
 */
const getTrendPageUrl = (pageType, siteName) => {
  return `/pages/${pageType}/index?site_name=${siteName}`
}

const getFullScreenPlayChoiceUrl = nextPageType => {
  return `/pages/fullScreenPlayChoice/index?nextPageType=${nextPageType}`
}

module.exports = {
  getTrendPageUrl,
  getFullScreenPlayChoiceUrl,
}
