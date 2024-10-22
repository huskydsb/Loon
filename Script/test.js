// 获取环境参数
var inputParams = $environment.params || {}; // 确保 params 存在
var nodeName = inputParams.node || "N/A"; // 获取节点名称

// 第一步：获取外部 IP 地址信息
var ipApiParams = {
    "url": "http://ip-api.com/json/",
    "node": nodeName
};

$httpClient.get(ipApiParams, function(error, response, data) {
    if (error) {
        console.error("Error fetching IP info:", error);
        $done(); // 结束请求
        return;
    }

    // 尝试解析 JSON 数据
    let ipInfo;
    try {
        ipInfo = JSON.parse(data);
    } catch (e) {
        console.error("Error parsing IP info JSON:", e);
        $done(); // 结束请求
        return;
    }

    if (ipInfo.status === "success") {
        let ipValue = ipInfo.query; // 获取查询的 IP 地址
        let city = ipInfo.city || "N/A";
        let country = ipInfo.country || "N/A";
        let isp = ipInfo.isp || "N/A";
        let org = ipInfo.org || "N/A";
        let as = ipInfo.as || "N/A";

        // 请求参数
        var requestParams = {
            "url": `https://scamalytics.com/search?ip=${ipValue}`,
            "node": nodeName
        };

        // 第二步：使用获取到的 IP 进行请求
        $httpClient.get(requestParams, function(error, response, data) {
            if (error) {
                console.error("Error fetching the IP details:", error);
                $done(); // 结束请求
                return;
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
                        console.error("Error parsing JSON:", e);
                    }
                }
            }

            // 控制台输出查询结果
            console.log("查询结果 ：");
            console.log(`节点名称：${nodeName}`);
            console.log(`IP地址：${ipValue}`);
            console.log(`IP欺诈分数：${score}`);
            console.log(`IP风险等级：${risk}`);
            console.log(`IP城市：${city}`);
            console.log(`IP国家：${country}`);
            console.log(`ISP：${isp}`);
            console.log(`ORG：${org}`);
            console.log(`AS：${as}`);

            // 确定风险等级的 emoji 和描述
            var riskemoji;
            var riskDescription;
            if (risk === 'very high') {
                riskemoji = '🔴'; // 代表非常高风险
                riskDescription = '非常高风险';
            } else if (risk === 'high') {
                riskemoji = '🟠'; // 代表高风险
                riskDescription = '高风险';
            } else if (risk === 'medium') {
                riskemoji = '🟡'; // 代表中等风险
                riskDescription = '中等风险';
            } else if (risk === 'low') {
                riskemoji = '🟢'; // 代表低风险
                riskDescription = '低风险';
            } else {
                riskemoji = '⚪'; // 未知风险
                riskDescription = '未知风险';
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
                as: as
            };

            // 创建结果 HTML
            var resultHtml = `
                -------------------------------
                <br><br> <!-- 空行 -->
                <span style="color: red;"><b>IP地址：</b></span><span style="color: red;">${scamInfo.ip}</span>
                <br><b>IP欺诈分数：</b>${scamInfo.score}
                <br><b>IP风险等级：</b>${riskemoji} ${riskDescription}
                <br><br> <!-- 空行 -->
                <br><b>IP城市：</b>${scamInfo.city}
                <br><b>IP国家：</b>${scamInfo.country}
                <br><br> <!-- 空行 -->
                <br><b>ISP：</b>${scamInfo.isp}
                <br><b>组织：</b>${scamInfo.org}
                <br><b>ASN：</b>${scamInfo.as}
                <br><br> <!-- 空行 -->
                <br>-------------------------------
                <br><font color="red"><b>节点：</b> ➟ ${nodeName}</font>
            `;

            // 调用 $done 结束请求并返回结果
            $done({ "title": "IP欺诈分查询", "htmlMessage": resultHtml });
        });
    } else {
        console.log("Failed to retrieve IP info.");
        $done(); // 结束请求
    }
});
