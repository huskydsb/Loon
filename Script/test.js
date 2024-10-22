// 第一步：获取 IP 地址
$httpClient.get("https://scamalytics.com/", function(error, response, data) {
    if (error) {
        console.error("Error fetching the page:", error);
        return;
    }

    // 使用正则表达式提取 input 中的 value
    let regex = /<input[^>]+name="ip"[^>]+value='([^']+)'/;
    let match = data.match(regex);
    let ipValue = match ? match[1] : null;

    if (ipValue) {
        console.log("Fetched IP:", ipValue);

        // 获取环境参数
        var inputParams = $environment.params;
        var nodeName = inputParams.node;

        // 第二步：使用获取到的 IP 进行请求
        $httpClient.get(`https://scamalytics.com/search?ip=${ipValue}`, function(error, response, data) {
            if (error) {
                console.error("Error fetching the IP details:", error);
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
                ip: ip || "N/A",
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
                <br><b>IP风险等级：</b>${risk} <!-- 替换为 riskemoji 和 riskDescription -->
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

            // 输出结果为 JSON 格式或 HTML
            console.log(JSON.stringify(scamInfo, null, 2));
            // 可以选择将 resultHtml 发送到前端或进一步处理
        });
    } else {
        console.log("No IP found.");
    }
});
