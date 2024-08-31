console.log("脚本开始运行");

// 设置请求的 URL
var ipUrl = "http://ip-api.com/json/";
var scamUrl = "https://api11.scamalytics.com/shaoxinweixuer/?key=" + $environment.params.arg3 + "&ip=";

// 获取插件的输入参数
var inputParams = $environment.params;
var nodeName = inputParams.node;

// 请求 IP 信息的参数
var requestParams = {
    "url": ipUrl,
    "node": nodeName
};

// 发送 IP 查询请求
console.log("请求 IP 信息的 URL:", requestParams.url);
$httpClient.get(requestParams, (error, response, data) => {
    if (error) {
        console.error("IP 信息请求错误:", error);
        var message = "<br><br>🔴 查询超时";
        message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: bold;">${message}</p>`;
        $done({ "title": "IP纯净度检测", "htmlMessage": message });
    } else {
        console.log("IP 信息返回数据:", data);
        var ipInfo = JSON.parse(data);
        var ip = ipInfo.query;

        // 请求 Scamalytics 的参数
        var scamRequestParams = {
            "url": scamUrl + ip,
            "node": nodeName
        };

        // 发送 Scamalytics 查询请求
        console.log("请求 Scamalytics 的 URL:", scamRequestParams.url);
        $httpClient.get(scamRequestParams, (error, response, data) => {
            if (error) {
                console.error("Scamalytics 请求错误:", error);
                var message = "<br><br>🔴 查询超时";
                message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: bold;">${message}</p>`;
                $done({ "title": "IP纯净度检测", "htmlMessage": message });
            } else {
                console.log("Scamalytics 返回数据:", data);
                var scamInfo = JSON.parse(data);
                var countryCode = scamInfo.ip_country_code;
                var countryFlag = flags.get(countryCode) || '';

                var scamDetails = `
                    <br><b>IP地址：</b>${scamInfo.ip}
                    <br><b>IP欺诈分数：</b>${scamInfo.score}
                    <br><b>IP风险等级：</b>${scamInfo.risk === 'low' ? '低风险' : '高风险'}
                    <br><b>IP城市：</b>${scamInfo.ip_city}
                    <br><b>IP国家：</b>${countryFlag} ${countryCode}
                    <br><b>ISP名称：</b>${scamInfo['ISP Name']}
                    <br><b>ISP欺诈分数：</b>${scamInfo['ISP Fraud Score']}
                    <br><b>ASN编号：</b>${scamInfo.as_number}
                    <br><b>ASN机构：</b>${scamInfo['Organization Name']}
                `;

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

// 国家旗帜映射
var flags = new Map([
    ["AC", "🇦🇨"], ["AE", "🇦🇪"], ["AF", "🇦🇫"], ["AI", "🇦🇮"], ["AL", "🇦🇱"], ["AM", "🇦🇲"], ["AQ", "🇦🇶"], ["AR", "🇦🇷"], ["AS", "🇦🇸"], ["AT", "🇦🇹"], ["AU", "🇦🇺"], ["AW", "🇦🇼"], ["AX", "🇦🇽"], ["AZ", "🇦🇿"],
    ["BA", "🇧🇦"], ["BB", "🇧🇧"], ["BD", "🇧🇩"], ["BE", "🇧🇪"], ["BF", "🇧🇫"], ["BG", "🇧🇬"], ["BH", "🇧🇭"], ["BI", "🇧🇮"], ["BJ", "🇧🇯"], ["BM", "🇧🇲"], ["BN", "🇧🇳"], ["BO", "🇧🇴"], ["BR", "🇧🇷"], ["BS", "🇧🇸"], ["BT", "🇧🇹"], ["BV", "🇧🇻"], ["BW", "🇧🇼"], ["BY", "🇧🇾"], ["BZ", "🇧🇿"],
    ["CA", "🇨🇦"], ["CF", "🇨🇫"], ["CH", "🇨🇭"], ["CK", "🇨🇰"], ["CL", "🇨🇱"], ["CM", "🇨🇲"], ["CN", "🇨🇳"], ["CO", "🇨🇴"], ["CP", "🇨🇵"], ["CR", "🇨🇷"], ["CU", "🇨🇺"], ["CV", "🇨🇻"], ["CW", "🇨🇼"], ["CX", "🇨🇽"], ["CY", "🇨🇾"], ["CZ", "🇨🇿"],
    ["DE", "🇩🇪"], ["DG", "🇩🇬"], ["DJ", "🇩🇯"], ["DK", "🇩🇰"], ["DM", "🇩🇲"], ["DO", "🇩🇴"], ["DZ", "🇩🇿"], ["EA", "🇪🇦"], ["EC", "🇪🇨"], ["EE", "🇪🇪"], ["EG", "🇪🇬"], ["EH", "🇪🇭"], ["ER", "🇪🇷"], ["ES", "🇪🇸"], ["ET", "🇪🇹"], ["EU", "🇪🇺"],
    ["FI", "🇫🇮"], ["FJ", "🇫🇯"], ["FK", "🇫🇰"], ["FM", "🇫🇲"], ["FO", "🇫🇴"], ["FR", "🇫🇷"], ["GA", "🇬🇦"], ["GB", "🇬🇧"], ["HK", "🇭🇰"], ["HU", "🇭🇺"], ["ID", "🇮🇩"], ["IE", "🇮🇪"], ["IL", "🇮🇱"], ["IM", "🇮🇲"], ["IN", "🇮🇳"], ["IS", "🇮🇸"], ["IT", "🇮🇹"], ["JP", "🇯🇵"], ["KR", "🇰🇷"], ["LU", "🇱🇺"], ["MO", "🇲🇴"], ["MX", "🇲🇽"], ["MY", "🇲🇾"], ["NL", "🇳🇱"], ["PH", "🇵🇭"], ["RO", "🇷🇴"], ["RS", "🇷🇸"], ["RU", "🇷🇺"], ["RW", "🇷🇼"],
    ["SA", "🇸🇦"], ["SB", "🇸🇧"], ["SC", "🇸🇨"], ["SD", "🇸🇩"], ["SE", "🇸🇪"], ["SG", "🇸🇬"], ["TH", "🇹🇭"], ["TN", "🇹🇳"], ["TO", "🇹🇴"], ["TR", "🇹🇷"], ["TV", "🇹🇻"], ["TW", "🇨🇳"], ["UK", "🇬🇧"], ["UM", "🇺🇲"], ["US", "🇺🇸"], ["UY", "🇺🇾"], ["UZ", "🇺🇿"], ["VA", "🇻🇦"], ["VE", "🇻🇪"], ["VG", "🇻🇬"], ["VI", "🇻🇮"], ["VN", "🇻🇳"], ["ZA", "🇿🇦"]
]);

console.log("脚本运行结束");
