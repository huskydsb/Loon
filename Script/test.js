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

        // 第二步：使用获取到的 IP 进行请求
        $httpClient.get(`https://scamalytics.com/search?ip=${ipValue}`, function(error, response, data) {
            if (error) {
                console.error("Error fetching the IP details:", error);
                return;
            }

            // 提取城市、国家、ISP 名称、ASN 编号和 ASN 机构
            let cityRegex = /<th>City<\/th>\s*<td>(.*?)<\/td>/;
            let countryRegex = /<th>Country Name<\/th>\s*<td>(.*?)<\/td>/;
            let ispNameRegex = /<th>ISP Name<\/th>\s*<td><a[^>]*>(.*?)<\/a><\/td>/;
            let asnNumberRegex = /<th>ASN<\/th>\s*<td>(.*?)<\/td>/;
            let asnOrgRegex = /<th>ASN Organization<\/th>\s*<td>(.*?)<\/td>/;

            let cityMatch = data.match(cityRegex);
            let countryMatch = data.match(countryRegex);
            let ispNameMatch = data.match(ispNameRegex);
            let asnNumberMatch = data.match(asnNumberRegex);
            let asnOrgMatch = data.match(asnOrgRegex);

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
            let result = {
                ip: ip || "N/A",
                score: score || "N/A",
                risk: risk || "N/A",
                city: cityMatch ? cityMatch[1] : "N/A",
                country: countryMatch ? countryMatch[1] : "N/A",
                ispName: ispNameMatch ? ispNameMatch[1] : "N/A",
                asnNumber: asnNumberMatch ? asnNumberMatch[1] : "N/A",
                asnOrg: asnOrgMatch ? asnOrgMatch[1] : "N/A"
            };

            // 输出结果为 JSON 格式
            console.log(JSON.stringify(result, null, 2));
        });
    } else {
        console.log("No IP found.");
    }
});
