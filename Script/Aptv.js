let obj = {};

// 定义最大重试次数
const maxRetries = 3;
let retries = 0;

function modifyResponse() {
  // 检查 $response 是否定义
  if (typeof $response === "undefined") {
    // 删除请求头中的特定字段
    delete $request.headers["x-revenuecat-etag"];
    delete $request.headers["X-RevenueCat-ETag"];
    // 将修改后的请求头添加到 obj 中
    obj.headers = $request.headers;
  } else {
    try {
      // 解析响应体
      let body = JSON.parse($response.body || '{}');

      if (body && body.subscriber) {
        const name = "pro";
        const appid = "com.kimen.aptvpro.lifetime";
        const data = {
          "expires_date": "2999-01-01T00:00:00Z",
          "original_purchase_date": "2021-01-01T00:00:00Z",
          "purchase_date": "2021-01-01T00:00:00Z",
          "ownership_type": "PURCHASED",
          "store": "app_store"
        };

        let subscriber = body.subscriber;
        // 更新订阅数据
        subscriber.subscriptions[appid] = data;
        subscriber.entitlements[name] = { ...data, product_identifier: appid };

        // 将修改后的 body 添加到 obj 中
        obj.body = JSON.stringify(body);
      }
    } catch (error) {
      if (retries < maxRetries) {
        retries++;
        // 如果失败了，重试
        modifyResponse();
        return;
      } else {
        // 如果达到最大重试次数，记录错误
        console.error("修改响应体失败:", error);
        // 可以根据需要处理错误，例如返回未修改的响应
        obj.body = $response.body;
      }
    }
  }

  // 结束请求并返回 obj
  $done(obj);
}

// 执行修改
modifyResponse();
