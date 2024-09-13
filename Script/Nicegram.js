// Loon 脚本
let body = $response.body;

// 替换订阅状态
body = body.replace(/"store_subscription":false/g, '"store_subscription":true');
body = body.replace(/"lifetime_subscription":false/g, '"lifetime_subscription":true');
body = body.replace(/"subscription":false/g, '"subscription":true');

// 完成并返回修改后的 body
$done({ body });
