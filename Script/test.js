// 第一步：获取 IP 地址
$httpClient.get("https://scamalytics.com/", function (error, response, data) {
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
        $httpClient.get(`https://scamalytics.com/search?ip=${ipValue}`, function (error, response, data) {
            if (error) {
                console.error("Error fetching the IP details:", error);
                return;
            }

            // 使用正则表达式提取 <pre> 标签中的内容
            let preRegex = /<pre[^>]*>([\s\S]*?)<\/pre>/;
            let preMatch = data.match(preRegex);
            let preContent = preMatch ? preMatch[1] : null;

            if (preContent) {
                // 使用正则提取 JSON 字符串
                let jsonRegex = /({[\s\S]*?})/;
                let jsonMatch = preContent.match(jsonRegex);

                if (jsonMatch) {
                    let jsonData = jsonMatch[1];

                    // 尝试解析 JSON 数据
                    try {
                        let parsedData = JSON.parse(jsonData);
                        let ip = parsedData.ip;
                        let score = parsedData.score;
                        let risk = parsedData.risk;

                        console.log(`IP: ${ip}, Score: ${score}, Risk: ${risk}`);
                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                    }
                } else {
                    console.log("No JSON found in <pre> content.");
                }
            } else {
                console.log("No <pre> content found.");
            }
        });
    } else {
        console.log("No IP found.");
    }
});
