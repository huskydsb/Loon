// 获取环境参数
var inputParams = $environment.params || {}; // 确保 params 存在
var nodeName = inputParams.node || "N/A"; // 获取节点名称

// 第一步：获取响应数据
$httpClient.get("https://ping0.cc/", function(error, response, data) {
    if (error) {
        console.error("Error fetching the page:", error);
        $done(); // 结束请求
        return;
    }

    // 输出全部响应数据
    console.log("完整响应数据：", data);

    // 使用正则表达式提取 IP 地址
    let ipRegex = /<div class="name">\s*IP 地址\s*<\/div>\s*<div class="content">\s*([^<]+)\s*<span v-if="rdns.length>0">/;
    let ipMatch = data.match(ipRegex);
    let ipAddress = ipMatch ? ipMatch[1].trim() : "N/A";

    // 使用正则表达式提取 IP 位置
    let locationRegex = /<div class="name">\s*IP 位置\s*<\/div>\s*<div class="content">\s*<img[^>]*>\s*([^&]+)&mdash;/;
    let locationMatch = data.match(locationRegex);
    let ipLocation = locationMatch ? locationMatch[1].trim() : "N/A";

    // 控制台输出获取到的信息
    console.log("节点名称：", nodeName);
    console.log("获取到的 IP 地址：", ipAddress);
    console.log("获取到的 IP 位置：", ipLocation);

    // 创建结果 HTML
    var resultHtml = `
        <br>------------------------------------------------
        <br><b>节点名称：</b>${nodeName}
        <br><b>IP地址：</b>${ipAddress}
        <br><b>IP位置：</b>${ipLocation}
        <br>------------------------------------------------
    `;

    // 调用 $done 结束请求并返回结果
    $done({ "title": "IP地址查询", "htmlMessage": resultHtml });
});
