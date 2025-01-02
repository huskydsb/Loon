// 获取环境参数
var inputParams = $environment.params || {};
var nodeName = inputParams.node || "N/A"; 

// 通用错误处理函数
function handleError(message, error = null) {
    console.error(message, error || "");
    $done();
}

// 设置User-Agent等请求头
const headers = {
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Mobile/15E148 Safari/604.1",
    "Upgrade-Insecure-Requests": "1",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh-Hans;q=0.9",
    "Accept-Encoding": "gzip, deflate",
    "Connection": "keep-alive"
};

// 获取外部 IP 地址信息
async function fetchIpInfo() {
    const ipApiParams = {
        url: "http://ip-api.com/json/",
        timeout: 5000,
        headers: headers,
    };

    // 请求函数封装
    async function requestWithRetry(params, retries = 3) {
        for (let i = 0; i < retries; i++) {
            try {
                return await new Promise((resolve, reject) => {
                    $httpClient.get(params, (error, response, data) => {
                        if (error || !data || data.trim() === "") {
                            reject(error || "空数据返回");
                        } else {
                            resolve(data);
                        }
                    });
                });
            } catch (e) {
                console.log(`第 ${i + 1} 次请求失败，重试中...`);
            }
        }
        throw new Error("请求失败，已达到最大重试次数");
    }

    try {
        // 获取 IP 信息
        const ipData = await requestWithRetry(ipApiParams);
        const ipInfo = JSON.parse(ipData);

        if (ipInfo.status !== "success") throw new Error("IP信息获取失败");

        const { query: ipValue, city = "N/A", country = "N/A", isp = "N/A", org = "N/A", as = "N/A" } = ipInfo;

        console.log("IP信息查询成功：", ipInfo);

        // 使用 IP 查询 Scamalytics
        const requestParams = {
            url: `https://scamalytics.com/search?ip=${ipValue}`,
            timeout: 5000,
            headers: headers,
        };

        const scamData = await requestWithRetry(requestParams);
        const preRegex = /<pre[^>]*>([\s\S]*?)<\/pre>/;
        const preMatch = scamData.match(preRegex);
        const preContent = preMatch ? preMatch[1] : null;

        let score = "N/A", risk = "N/A";

        if (preContent) {
            const jsonRegex = /({[\s\S]*?})/;
            const jsonMatch = preContent.match(jsonRegex);

            if (jsonMatch) {
                const parsedData = JSON.parse(jsonMatch[1]);
                score = parsedData.score || "N/A";
                risk = parsedData.risk || "N/A";
            }
        }

        console.log("Scamalytics IP欺诈评分查询结果：", { score, risk });

        const riskMap = {
            "very high": ["🔴", "非常高风险"],
            high: ["🟠", "高风险"],
            medium: ["🟡", "中等风险"],
            low: ["🟢", "低风险"],
        };

        const [riskemoji = "⚪", riskDescription = "未知风险"] = riskMap[risk] || [];

        // 返回 HTML 结果
        const resultHtml = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
            <br>------------------------------------------
            <span style="color: red;"><b>IP地址：</b></span><span style="color: red;">${ipValue}</span>
            <br><b>IP城市：</b>${city}
            <br><b>IP国家：</b>${country}
            <br><br>
            <br><b>IP欺诈分数：</b>       ${score}
            <br><b>IP风险等级：</b>${riskemoji} ${riskDescription}
            <br><br>
            <br><b>ISP：</b>${isp}
            <br><b>Org：</b>${org}
            <br><b>ASN：</b>${as}
            <br>------------------------------------------
            <br><font color="red"><b>当前节点：</b> ➟ ${nodeName}</font>
            </div>
        `;
        // 将 HTML 输出到日志
console.log("Scamalytics IP欺诈评分查询结果:");
console.log(resultHtml);

        $done({
            title: "Scamalytics IP欺诈评分查询",
            htmlMessage: resultHtml,
        });

    } catch (e) {
        handleError(e.message);
    }
}

// 启动查询
fetchIpInfo();