// 读取参数
var apiHost = $argument.arg1; // 从参数中获取 API 主机名
var username = $argument.arg2; // 从参数中获取用户名
var apiKey = $argument.arg3; // 从参数中获取 API 密钥

// 检查是否成功获取到所有必要的参数
if (apiHost && username && apiKey) {
    var scamUrl = `https://${apiHost}/${username}/?key=${apiKey}&ip=`;
    var ipUrl = "http://ip-api.com/json/";

    // 获取 IP 信息
    $httpClient.get(ipUrl, (error, response, data) => {
        if (error) {
            var message = "<br><br>🔴 查询超时";
            message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: bold;">${message}</p>`;
            $done({ "title": "IP纯净度检测", "htmlMessage": message });
        } else {
            var ipInfo = JSON.parse(data);
            var ip = ipInfo.query;

            var scamRequestUrl = scamUrl + ip;

            // 获取欺诈信息
            $httpClient.get(scamRequestUrl, (error, response, data) => {
                if (error) {
                    var message = "<br><br>🔴 查询超时";
                    message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: bold;">${message}</p>`;
                    $done({ "title": "IP纯净度检测", "htmlMessage": message });
                } else {
                    var scamInfo = JSON.parse(data);
                    var countryCode = scamInfo.ip_country_code;
                    var countryFlag = flags.get(countryCode) || '';

                    var resultHtml = `
                    -------------------------------
                    <br><br> <!-- 空行 -->
                    <br><b>IP地址：</b><span style="color: red;">${scamInfo.ip}</span>
                    <br><br> <!-- 空行 -->
                    <br><b>IP欺诈分数：</b>${scamInfo.score}
                    <br><b>IP风险等级：</b>${scamInfo.risk === 'low' ? '低风险' : '高风险'}
                    <br><br> <!-- 空行 -->
                    <br><b>IP城市：</b>${scamInfo.ip_city}
                    <br><b>IP国家：</b>${countryFlag} ${countryCode}
                    <br><br> <!-- 空行 -->
                    <br><b>ISP名称：</b>${scamInfo['ISP Name']}
                    <br><b>ISP欺诈分数：</b>${scamInfo['ISP Fraud Score']}
                    <br><br> <!-- 空行 -->
                    <br><b>ASN编号：</b>${scamInfo.as_number}
                    <br><b>ASN机构：</b>${scamInfo['Organization Name']}
                    <br><br> <!-- 空行 -->
                    <br>-------------------------------
                    <br><font color="red"><b>节点：</b> ➟ ${nodeName}</font>
                `;

                    var message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">${resultHtml}</p>`;
                    $done({ "title": "IP纯净度检测", "htmlMessage": message });
                }
            });
        }
    });
} else {
    var message = "<p>🔴 参数未配置或读取失败，请检查输入的参数。</p>";
    $done({ "title": "参数测试", "htmlMessage": message });
}

// Flags 映射表
var flags = new Map([
    ["CN", "🇨🇳"], ["US", "🇺🇸"], ["GB", "🇬🇧"], ["JP", "🇯🇵"], // 可以根据需要添加更多
]);
