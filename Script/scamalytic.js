// 读取持久化存储中的参数
var apiHost = $persistentStore.read("apiHost");
var username = $persistentStore.read("username");
var apiKey = $persistentStore.read("apiKey");

// 检查是否获取到所有必要参数
if (apiHost && username && apiKey) {
    var scamUrl = `https://${apiHost}/${username}/?key=${apiKey}&ip=`;

    var ipUrl = "http://ip-api.com/json/";

    $httpClient.get(ipUrl, (error, response, data) => {
        if (error) {
            var message = "<br><br>🔴 查询超时";
            message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: bold;">${message}</p>`;
            $done({ "title": "IP纯净度检测", "htmlMessage": message });
        } else {
            var ipInfo = JSON.parse(data);
            var ip = ipInfo.query;

            var scamRequestUrl = scamUrl + ip;

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
    var message = "<br><br>🔴 参数未配置或读取失败，请确保已保存API参数。";
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
