const app = getApp();
const Const = require('./const.js');

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

const formatDayTime = timestamp => {
  if (timestamp === undefined) {
    return ''
  }
  const date = new Date(timestamp)

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [hour, minute, second].map(formatNumber).join(':')
}

function getYesterdaysDate() {
  var date = new Date();
  date.setDate(date.getDate() - 1);
  return date;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getAllSiteName = (siteNameChoices = []) => {
  return siteNameChoices.map(c => c.site_name);
}

function getCurrentCnSiteName(enName) {

  const siteArr = Const.SITECHOICES.filter(site => site.site_name === enName);

  return (siteArr[0] && siteArr[0].site_name_cn) || '';
}

const ROUTE_NAME_MAP = {
  'pages/tabTrendLatest/index': {
    displayName: () => '最新走势图',
  },
  'pages/playChoice/index': {
    displayName: () => '地区选择',
  },
  'pages/trendHistory/index': {
    displayName: () => '历史走势图-地区选择',
  },
  'pages/tabUtils/index': {
    displayName: () => '选号工具',
  },
  'pages/fullScreenPlayChoice/index': {
    displayName: () => 'fullScreenPlayChoice',
  },
  'pages/trend/index': {
    displayName: (type, site) => {
      const curSiteName = getCurrentCnSiteName(site).replace('快乐10分', '');

      return `${type === 'latest' ? '最新' : '历史'}走势图-${curSiteName}`;
    },
  },
  'pages/me/index': {
    displayName: () => '我的',
  },
};

function getRouteDisplayName(url, params) {
  console.log('url display: ', url, params);
  if (!url) return '';

  const urlArr = url.split('?');
  const routeObj = ROUTE_NAME_MAP[urlArr[0]];

  if (!routeObj) return '';
  if ('pages/trend/index' === urlArr[0] && params) {
    return routeObj.displayName(params.type, params.site);
  }
  return routeObj.displayName();
}

function addHistoryUrl(url, displayName) {
  const allRoutes = app.globalData.historyRoutes;
  const hasCurUrl = allRoutes.some(route => route.url === url);

  if (hasCurUrl) return;

  app.globalData.historyRoutes.unshift({
    url,
    displayName,
  });
}

module.exports = {
  formatTime,
  formatDate,
  formatDayTime,
  getYesterdaysDate,
  getAllSiteName,
  getRouteDisplayName,
  addHistoryUrl,
}
