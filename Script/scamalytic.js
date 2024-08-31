// 从持久化存储中读取参数
var apiHost = $persistentStore.read("apiHost");
var username = $persistentStore.read("username");
var apiKey = $persistentStore.read("apiKey");

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
    var message = "<p>🔴 参数未配置或读取失败，请检查保存的参数。</p>";
    $done({ "title": "参数测试", "htmlMessage": message });
}
