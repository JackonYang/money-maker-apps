// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init()
const db = cloud.database();

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 *
 * event 参数包含小程序端调用传入的 data
 *
 */
exports.main = async (event, context) => {
  console.log('增加收藏', event)

  msg = 'ok'
  const wxContext = cloud.getWXContext()

  // 可执行其他自定义逻辑
  // console.log 的内容可以在云开发云函数调用日志查看
  // console.log(wxContext.OPENID);

  const params = {
    openid: wxContext.OPENID,
    url: event.url,
  }


  try {
    const currentUrls = await db.collection('user-fav').where(params).get();

    if (currentUrls.data.length === 0) {
      const res = await db.collection('user-fav').add({data: {
        ...params,
        displayName: event.displayName,
      }});

      return res;
    } else {
      return Promise.resolve(currentUrls);
    }

  } catch(err) {
    msg = 'failed' + err;
    console.error('新增 user fav 失败', err);
  }

  return {
    res: msg,
  }

  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）

  // return {
  //   event,
  //   config: configRes['data'],
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}
