const app = getApp()

// API
// 特定某一日的所有开奖结果
const getHistoryData = (siteName, date) => {
  return `https://data.caibaike.info/lottery-data/happy10/${siteName}/bidaily/bidaily-${date}.json`
}

// 快十： 今日所有开奖结果 API
const getLatestData = (siteName, fetched) => {
  return `${app.globalData.serverHostWins}/open-results/latest?fetched=${fetched}&site-name=${siteName}`
}
// 快十： 统计近期开奖结果 API
const getHotnData = (siteName, curIssue) => {
  return `${app.globalData.serverHostWins}/open-results/stat-top-hot?until=${curIssue}&site-name=${siteName}`
}

module.exports = {
  getHistoryData,
  getLatestData,
  getHotnData,
}
