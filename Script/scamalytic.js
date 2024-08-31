// 获取参数
var apiHost = $argument.arg1; // 获取 API 主机名
var username = $argument.arg2; // 获取用户名
var apiKey = $argument.arg3; // 获取 API 密钥

// 检查是否成功获取到所有必要的参数
if (apiHost && username && apiKey) {
    console.log("API Host:", apiHost);
    console.log("Username:", username);
    console.log("API Key:", apiKey);

    // 显示结果到界面
    var message = `
        <p>API Host: ${apiHost}</p>
        <p>Username: ${username}</p>
        <p>API Key: ${apiKey}</p>
    `;
    $done({ "title": "参数测试", "htmlMessage": message });
} else {
    // 如果有参数为空，则显示错误消息
    var message = "<p>🔴 参数未配置或读取失败，请检查输入的参数。</p>";
    $done({ "title": "参数测试", "htmlMessage": message });
}
