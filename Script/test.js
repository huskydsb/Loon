// 第一步：获取外部 IP 地址信息
$httpClient.get("http://ip-api.com/json/", function(error, response, data) {
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
        console.log("Fetched IP:", ipValue);

        // 获取环境参数
        var inputParams = $environment.params || {}; // 确保 params 存在
        var nodeName = inputParams.node || "N/A"; // 获取节点名称

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

            // 提取城市、国家、组织名称、ASN 编号
            let cityRegex = /<th>City<\/th>\s*<td>(.*?)<\/td>/;
            let countryRegex = /<th>Country Name<\/th>\s*<td>(.*?)<\/td>/;
            let organizationNameRegex = /<th>Organization Name<\/th>\s*<td>(.*?)<\/td>/;
            let asnNumberRegex = /<th>ASN<\/th>\s*<td>(.*?)<\/td>/;

            let cityMatch = data.match(cityRegex);
            let countryMatch = data.match(countryRegex);
            let organizationNameMatch = data.match(organizationNameRegex);
            let asnNumberMatch = data.match(asnNumberRegex);

            // 使用正则表达式提取 <pre> 标签中的内容
            let preRegex = /<pre[^>]*>([\s\S]*?)<\/pre>/;
            let preMatch = data.match(preRegex);
            let preContent = preMatch ? preMatch[1] : null;

            let ip, score, risk;
            if (preContent) {
                // 使用正则提取 JSON 字符串
                let jsonRegex = /({[\s\S]*?})/;
                let jsonMatch = preContent.match(jsonRegex);
                
                if (jsonMatch) {
                    let jsonData = jsonMatch[1];

                    // 尝试解析 JSON 数据
                    try {
                        let parsedData = JSON.parse(jsonData);
                        ip = parsedData.ip;
                        score = parsedData.score;
                        risk = parsedData.risk;
                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                    }
                }
            }

            // 组织最终结果
            let scamInfo = {
                ip: ip || ipValue || "N/A", // 使用从 IP API 获取的 IP
                score: score || "N/A",
                risk: risk || "N/A",
                ip_city: cityMatch ? cityMatch[1] : "N/A",
                country: countryMatch ? countryMatch[1] : "N/A",
                as_number: asnNumberMatch ? asnNumberMatch[1] : "N/A",
                organizationName: organizationNameMatch ? organizationNameMatch[1] : "N/A"
            };

            // 创建结果 HTML
            var resultHtml = `
                -------------------------------
                <br><br> <!-- 空行 -->
                <span style="color: red;"><b>IP地址：</b></span><span style="color: red;">${scamInfo.ip}</span>
                <br><br> <!-- 空行 -->
                <br><b>IP欺诈分数：</b>${scamInfo.score}
                <br><b>IP风险等级：</b>${scamInfo.risk}
                <br><br> <!-- 空行 -->
                <br><b>IP城市：</b>${scamInfo.ip_city}
                <br><b>IP国家：</b>${scamInfo.country}
                <br><br> <!-- 空行 -->
                <br><b>ASN编号：</b>${scamInfo.as_number}
                <br><b>ASN机构：</b>${scamInfo.organizationName}
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
