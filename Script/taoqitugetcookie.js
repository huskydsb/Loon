// 格式化日期时间为 YYYY-MM-DD HH:mm:ss 格式
function formatDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 检查请求方法
if ($request.method !== 'OPTIONS') {
  console.log(`[${formatDateTime(new Date())}] 🚀 脚本开始执行，URL: ${$request.url}, Method: ${$request.method}`);

  // 延时处理，等待一定时间再获取请求头
  setTimeout(() => {
    // 获取请求头中的authorization字段
    const headers = $request.headers;
    const authorization = headers['authorization'];

    // 记录日志：开始获取authorization
    console.log(`[${formatDateTime(new Date())}] 📝 开始获取请求头中的Authorization字段`);

    // 检查是否获取到authorization字段
    if (authorization) {
      // 存储authorization到$persistentStore
      $persistentStore.write(authorization, 'taoqitu_authorization');
      console.log(`[${formatDateTime(new Date())}] ✅ 获取成功：Authorization 字段已存储`);

      // 提示成功
      $notification.post('淘气兔签到获取cookie', 'Authorization 已存储', '🎉cookie获取成功');
    } else {
      console.log(`[${formatDateTime(new Date())}] ❌ 获取失败：未找到Authorization字段`);

      // 提示失败
      $notification.post('淘气兔签到获取cookie', '未找到Authorization', '👆请手动签到一次');
    }

    // 记录日志：脚本结束
    console.log(`[${formatDateTime(new Date())}] 🛑 脚本执行结束`);

    // 返回原始响应
    $done({});
  }, 2000);  // 延时 2 秒，您可以根据需要调整延时的时间（单位：毫秒）
} else {
  console.log(`[${formatDateTime(new Date())}] 🚫 跳过OPTIONS请求`);
  $done({});
}