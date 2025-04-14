// 定义日志函数
function log(message, data = "") {
  const time = new Date().toLocaleTimeString("zh-CN", { hour12: false });
  console.log(`[${time}] ${message} ${data}`);
}

// 获取存储的authorization
const authorization = $persistentStore.read('taoqitu_authorization');

// 记录获取存储的Authorization
log("🔑 获取存储的Authorization", authorization ? "成功" : "失败");

if (!authorization) {
  log("⚠️ 错误", "未找到有效的Authorization，请先获取并存储Authorization");
  $done();
  return;
}

// 设置请求参数
log("⚙️ 设置请求URL和请求头", `URL: https://api-cdn.taoqitu.me/gateway/tqt/cn/user/sign`);

let headers = {
  "accept-encoding": "gzip, deflate, br",
  "referer": "https://vip.taoqitu.pro/",
  "origin": "https://vip.taoqitu.pro",
  "authorization": authorization,  // 使用存储的authorization
  "sec-fetch-mode": "cors",
  "accept-language": "zh-CN,zh-Hans;q=0.9",
  "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/133.0.6943.33 Mobile/15E148 Safari/604.1",
  "sec-fetch-dest": "empty",
  "accept": "*/*",
  "sec-fetch-site": "cross-site",
};

// 记录请求头内容
log("📋 请求头设置", JSON.stringify(headers, null, 2));

var params = {
  url: "https://api-cdn.taoqitu.me/gateway/tqt/cn/user/sign",
  timeout: 5000,
  headers: headers,
  alpn: "h2",
};

// 发送请求并处理响应
log("🚀 开始发送签到请求", "等待响应...");

$httpClient.get(params, function (errormsg, response, data) {
  if (errormsg) {
    log("❌ 请求失败", errormsg);
    $notification.post("淘气兔签到", "请求失败", `错误: ${errormsg}`);
  } else {
    log("✅ 签到请求成功", `状态码: ${response.status}`);

    // 解析 JSON
    try {
      let result = JSON.parse(data);
      log("🔍 解析响应数据", `响应数据: ${JSON.stringify(result, null, 2)}`);

      if (result.message) {
        if (result.message.includes("今日已签")) {
          log("✔️ 签到结果", "今日已签到 ✅");
          $notification.post("淘气兔签到", "今日已签到", "请明天再来！");
        } else if (result.message.includes("成功")) {
          log("🎉 签到成功", result.message);
          $notification.post("淘气兔签到", "签到成功", result.message);
        } else {
          log("⚠️ 未知返回", result.message);
          $notification.post("淘气兔签到", "未知返回", result.message);
        }
      } else {
        log("⚠️ 返回格式异常", data);
        $notification.post("淘气兔签到", "返回格式异常", data);
      }
    } catch (e) {
      log("⚠️ JSON 解析失败", data);
      $notification.post("淘气兔签到", "JSON解析失败", data);
    }
  }
  log("⏹️ 签到请求结束", "脚本执行完毕");
  $done();
});