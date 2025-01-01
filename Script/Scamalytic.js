// 获取环境参数
var inputParams = $environment.params || {}; // 确保 params 存在
var nodeName = inputParams.node || "N/A"; // 获取节点名称

// 定义通用的错误处理函数
function handleError(message, error = null) {
    console.error(message, error || "");
    $done(); // 确保脚本资源释放
}

// 第一步：获取外部 IP 地址信息
var ipApiParams = {
    url: "http://ip-api.com/json/",
    timeout: 5000, // 增加超时时间
    node: nodeName,
};

$httpClient.get(ipApiParams, function (error, response, data) {
    if (error) {
        return handleError("Error fetching IP info:", error);
    }

    // 尝试解析 JSON 数据
    let ipInfo;
    try {
        ipInfo = JSON.parse(data);
    } catch (e) {
        return handleError("Error parsing IP info JSON:", e);
    }

    if (ipInfo.status === "success") {
        let ipValue = ipInfo.query; // 获取查询的 IP 地址
        let city = ipInfo.city || "N/A";
        let country = ipInfo.country || "N/A";
        let isp = ipInfo.isp || "N/A";
        let org = ipInfo.org || "N/A";
        let as = ipInfo.as || "N/A";

        // 第二步：使用获取到的 IP 进行请求
        var requestParams = {
            url: `https://scamalytics.com/search?ip=${ipValue}`,
            timeout: 5000, // 增加超时时间
            node: nodeName,
        };

        $httpClient.get(requestParams, function (error, response, data) {
            if (error) {
                return handleError("Error fetching the IP details:", error);
            }

            // 使用正则表达式提取 <pre> 标签中的内容
            let preRegex = /<pre[^>]*>([\s\S]*?)<\/pre>/;
            let preMatch = data.match(preRegex);
            let preContent = preMatch ? preMatch[1] : null;

            let score = "N/A";
            let risk = "N/A";
            if (preContent) {
                // 使用正则提取 JSON 字符串
                let jsonRegex = /({[\s\S]*?})/;
                let jsonMatch = preContent.match(jsonRegex);

                if (jsonMatch) {
                    let jsonData = jsonMatch[1];

                    // 尝试解析 JSON 数据
                    try {
                        let parsedData = JSON.parse(jsonData);
                        score = parsedData.score || "N/A";
                        risk = parsedData.risk || "N/A";
                    } catch (e) {
                        console.error("Error parsing JSON from Scamalytics:", e);
                    }
                }
            }

            // 控制台输出查询结果
            console.log("Scamalytics IP欺诈评分查询结果：");

            const logMessage = `
            节点名称：${nodeName}
            IP地址：${ipValue}
            IP欺诈分数：${score}
            IP风险等级：${risk}
            IP城市：${city}
            IP国家：${country}
            ISP：${isp}
            ORG：${org}
            ASN：${as}
            `;

            console.log(logMessage.trim());

            // 确定风险等级的 emoji 和描述
            var riskemoji;
            var riskDescription;
            if (risk === "very high") {
                riskemoji = "🔴";
                riskDescription = "非常高风险";
            } else if (risk === "high") {
                riskemoji = "🟠";
                riskDescription = "高风险";
            } else if (risk === "medium") {
                riskemoji = "🟡";
                riskDescription = "中等风险";
            } else if (risk === "low") {
                riskemoji = "🟢";
                riskDescription = "低风险";
            } else {
                riskemoji = "⚪";
                riskDescription = "未知风险";
            }

            // 组织最终结果
            let scamInfo = {
                ip: ipValue,
                score: score,
                risk: risk,
                city: city,
                country: country,
                isp: isp,
                org: org,
                as: as,
            };

            // 创建结果 HTML
            var resultHtml = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
            <br>------------------------------------------
            <span style="color: red;"><b>IP地址：</b></span><span style="color: red;">${scamInfo.ip}</span>
            <br><b>IP城市：</b>${scamInfo.city}
            <br><b>IP国家：</b>${scamInfo.country}
            <br><br>
            <br><b>IP欺诈分数：</b>${scamInfo.score}
            <br><b>IP风险等级：</b>${riskemoji} ${riskDescription}
            <br><br>
            <br><b>ISP：</b>${scamInfo.isp}
            <br><b>Org：</b>${scamInfo.org}
            <br><b>ASN：</b>${scamInfo.as}
            <br>------------------------------------------
            <br><font color="red"><b>当前节点：</b> ➟ ${nodeName}</font>
            </div>
            `;

            // 调用 $done 结束请求并返回结果
            $done({
                title: "Scamalytics IP欺诈评分查询",
                htmlMessage: resultHtml,
            });
        });
    } else {
        handleError("Failed to retrieve IP info. Status: " + ipInfo.status);
    }
});