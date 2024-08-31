console.log($environment.params);
var ipUrl = "http://ip-api.com/json/";

// 从 $argument 读取传入的参数
var apiHost = $argument.arg1;  // 读取API主机名，例如：api11.scamalytics.com
var username = $argument.arg2; // 读取用户名，例如：shaoxinweixuer
var apiKey = $argument.arg3;   // 读取API密钥，例如：3d803bd1825826b88353d677e37d5f54ee5685e242347e88b8159c103bbc5ef1

// 检查参数是否传入成功
if (apiHost && username && apiKey) {
    // 生成 scamUrl
    var scamUrl = `https://${apiHost}/${username}/?key=${apiKey}&ip=`;

    var inputParams = $environment.params;
    var nodeName = inputParams.node;

    var requestParams = {
        "url": ipUrl,
        "node": nodeName
    };

    // 获取 IP 信息
    $httpClient.get(requestParams, (error, response, data) => {
        if (error) {
            var message = "<br><br>🔴 查询超时";
            message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: bold;">${message}</p>`;
            $done({ "title": "IP纯净度检测", "htmlMessage": message });
        } else {
            console.log(data);
            var ipInfo = JSON.parse(data);
            var ip = ipInfo.query;
            var scamRequestParams = {
                "url": scamUrl + ip,
                "node": nodeName
            };

            // 使用生成的 scamUrl 获取 IP 纯净度信息
            $httpClient.get(scamRequestParams, (error, response, data) => {
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
    var message = "<br><br>🔴 外部参数读取失败，请检查配置";
    message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: bold;">${message}</p>`;
    $done({ "title": "IP纯净度检测", "htmlMessage": message });
}




var flags = new Map([
    ["AC", "🇦🇨"], ["AE", "🇦🇪"], ["AF", "🇦🇫"], ["AI", "🇦🇮"], ["AL", "🇦🇱"], ["AM", "🇦🇲"], ["AQ", "🇦🇶"], ["AR", "🇦🇷"], ["AS", "🇦🇸"], ["AT", "🇦🇹"], ["AU", "🇦🇺"], ["AW", "🇦🇼"], ["AX", "🇦🇽"], ["AZ", "🇦🇿"],
    ["BA", "🇧🇦"], ["BB", "🇧🇧"], ["BD", "🇧🇩"], ["BE", "🇧🇪"], ["BF", "🇧🇫"], ["BG", "🇧🇬"], ["BH", "🇧🇭"], ["BI", "🇧🇮"], ["BJ", "🇧🇯"], ["BM", "🇧🇲"], ["BN", "🇧🇳"], ["BO", "🇧🇴"], ["BR", "🇧🇷"], ["BS", "🇧🇸"], ["BT", "🇧🇹"], ["BV", "🇧🇻"], ["BW", "🇧🇼"], ["BY", "🇧🇾"], ["BZ", "🇧🇿"],
    ["CA", "🇨🇦"], ["CF", "🇨🇫"], ["CH", "🇨🇭"], ["CK", "🇨🇰"], ["CL", "🇨🇱"], ["CM", "🇨🇲"], ["CN", "🇨🇳"], ["CO", "🇨🇴"], ["CP", "🇨🇵"], ["CR", "🇨🇷"], ["CU", "🇨🇺"], ["CV", "🇨🇻"], ["CW", "🇨🇼"], ["CX", "🇨🇽"], ["CY", "🇨🇾"], ["CZ", "🇨🇿"],
    ["DE", "🇩🇪"], ["DG", "🇩🇬"], ["DJ", "🇩🇯"], ["DK", "🇩🇰"], ["DM", "🇩🇲"], ["DO", "🇩🇴"], ["DZ", "🇩🇿"], ["EA", "🇪🇦"], ["EC", "🇪🇨"], ["EE", "🇪🇪"], ["EG", "🇪🇬"], ["EH", "🇪🇭"], ["ER", "🇪🇷"], ["ES", "🇪🇸"], ["ET", "🇪🇹"], ["EU", "🇪🇺"],
    ["FI", "🇫🇮"], ["FJ", "🇫🇯"], ["FK", "🇫🇰"], ["FM", "🇫🇲"], ["FO", "🇫🇴"], ["FR", "🇫🇷"], ["GA", "🇬🇦"], ["GB", "🇬🇧"], ["HK", "🇭🇰"], ["HU", "🇭🇺"], ["ID", "🇮🇩"], ["IE", "🇮🇪"], ["IL", "🇮🇱"], ["IM", "🇮🇲"], ["IN", "🇮🇳"], ["IS", "🇮🇸"], ["IT", "🇮🇹"], ["JP", "🇯🇵"], ["KR", "🇰🇷"], ["LU", "🇱🇺"], ["MO", "🇲🇴"], ["MX", "🇲🇽"], ["MY", "🇲🇾"], ["NL", "🇳🇱"], ["PH", "🇵🇭"], ["RO", "🇷🇴"], ["RS", "🇷🇸"], ["RU", "🇷🇺"], ["RW", "🇷🇼"],
    ["SA", "🇸🇦"], ["SB", "🇸🇧"], ["SC", "🇸🇨"], ["SD", "🇸🇩"], ["SE", "🇸🇪"], ["SG", "🇸🇬"], ["TH", "🇹🇭"], ["TN", "🇹🇳"], ["TO", "🇹🇴"], ["TR", "🇹🇷"], ["TV", "🇹🇻"], ["TW", "🇨🇳"], ["UK", "🇬🇧"], ["UM", "🇺🇲"], ["US", "🇺🇸"], ["UY", "🇺🇾"], ["UZ", "🇺🇿"], ["VA", "🇻🇦"], ["VE", "🇻🇪"], ["VG", "🇻🇬"], ["VI", "🇻🇮"], ["VN", "🇻🇳"], ["ZA", "🇿🇦"]
]);
