// 获取环境参数
var inputParams = $environment.params || {}; // 确保 params 存在
var nodeName = inputParams.node || "N/A"; // 获取节点名称

// 通用错误处理函数
function handleError(message, error = null) {
    console.error(message, error || "");
    $done();
}

// 第一步：获取外部 IP 地址信息
var ipApiParams = {
    url: "http://ip-api.com/json/",
    timeout: 5000, // 增加超时时间
    headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Mobile/15E148 Safari/604.1", // 添加请求头，避免接口拒绝请求
    },
    node: nodeName,
};

$httpClient.get(ipApiParams, function (error, response, data) {
    if (error) {
        return handleError("获取IP信息时出错:", error);
    }

    if (!data || data.trim() === "") {
        return handleError("IP信息返回内容为空，请检查网络连接或接口状态。");
    }

    // 尝试解析 JSON 数据
    let ipInfo;
    try {
        ipInfo = JSON.parse(data);
    } catch (e) {
        return handleError("解析IP信息JSON时出错:", e);
    }

    if (ipInfo.status === "success") {
        let ipValue = ipInfo.query; // 获取查询的 IP 地址
        let city = ipInfo.city || "N/A";
        let country = ipInfo.country || "N/A";
        let isp = ipInfo.isp || "N/A";
        let org = ipInfo.org || "N/A";
        let as = ipInfo.as || "N/A";

        // 控制台输出基础信息
        console.log("IP信息查询成功：");
        console.log(`IP地址: ${ipValue}`);
        console.log(`城市: ${city}`);
        console.log(`国家: ${country}`);
        console.log(`ISP: ${isp}`);
        console.log(`组织: ${org}`);
        console.log(`ASN: ${as}`);

        // 请求参数
        var requestParams = {
            url: `https://scamalytics.com/search?ip=${ipValue}`,
            timeout: 5000, // 增加超时时间
            headers: {
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Mobile/15E148 Safari/604.1", // 添加请求头
            },
            node: nodeName,
        };

        // 第二步：使用获取到的 IP 进行请求
        $httpClient.get(requestParams, function (error, response, data) {
            if (error) {
                return handleError("获取Scamalytics IP详情时出错:", error);
            }

            if (!data || data.trim() === "") {
                return handleError("Scamalytics返回内容为空，请检查接口是否有效。");
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
                        console.error("解析Scamalytics JSON时出错:", e);
                    }
                }
            }

            // 控制台输出查询结果
            console.log("Scamalytics IP欺诈评分查询结果：");
            console.log(`IP欺诈分数: ${score}`);
            console.log(`IP风险等级: ${risk}`);

            // 确定风险等级的 emoji 和描述
            var riskemoji;
            var riskDescription;
            if (risk === "very high") {
                riskemoji = "🔴"; // 代表非常高风险
                riskDescription = "非常高风险";
            } else if (risk === "high") {
                riskemoji = "🟠"; // 代表高风险
                riskDescription = "高风险";
            } else if (risk === "medium") {
                riskemoji = "🟡"; // 代表中等风险
                riskDescription = "中等风险";
            } else if (risk === "low") {
                riskemoji = "🟢"; // 代表低风险
                riskDescription = "低风险";
            } else {
                riskemoji = "⚪"; // 未知风险
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

            // 控制台输出完整信息
            console.log(`
                IP地址: ${scamInfo.ip}
                IP城市: ${scamInfo.city}
                IP国家: ${scamInfo.country}
                IP欺诈分数: ${scamInfo.score}
                IP风险等级: ${riskemoji} ${riskDescription}
                ISP: ${scamInfo.isp}
                组织: ${scamInfo.org}
                ASN: ${scamInfo.as}
            `);

            // 创建结果 HTML
            var resultHtml = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
            <br>------------------------------------------
            <span style="color: red;"><b>IP地址：</b></span><span style="color: red;">${scamInfo.ip}</span>
            <br><b>IP城市：</b>${scamInfo.city}
            <br><b>IP国家：</b>${scamInfo.country}
            <br><br> <!-- 空行 -->
            <br><b>IP欺诈分数：</b>       ${scamInfo.score}
            <br><b>IP风险等级：</b>${riskemoji} ${riskDescription}
            <br><br> <!-- 空行 -->
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
        return handleError("IP信息获取失败，请检查接口或网络状态。");
    }
});