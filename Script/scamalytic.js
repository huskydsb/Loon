// 从配置中读取参数
var hostname = $argument.arg1 || 'api11.scamalytics.com'; // 默认值为原始主机名
var username = $argument.arg2 || 'shaoxinweixuer'; // 默认值为原始用户名
var apiKey = $argument.arg3 || '3d803bd1825826b88353d677e37d5f54ee5685e242347e88b8159c103bbc5ef1'; // 默认值为原始API Key

// 检查是否获取到参数
if (!hostname || !username || !apiKey) {
    console.error('必要的参数未提供');
    $done({ "title": "错误", "htmlMessage": "配置参数不完整" });
    return;
}

var ipUrl = "http://ip-api.com/json/";
var scamUrl = `https://${hostname}/${username}/?key=${apiKey}&ip=`; // 使用动态参数生成URL

console.log($environment.params);

var inputParams = $environment.params;
var nodeName = inputParams.node;

var requestParams = {
    "url": ipUrl,
    "node": nodeName
};

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

        $httpClient.get(scamRequestParams, (error, response, data) => {
            if (error) {
                var message = "<br><br>🔴 查询超时";
                message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: bold;">${message}</p>`;
                $done({ "title": "IP纯净度检测", "htmlMessage": message });
            } else {
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

var flags = new Map([
    ["AC", "🇦🇨"], ["AE", "🇦🇪"], ["AF", "🇦🇫"], ["AI", "🇦🇮"], ["AL", "🇦🇱"], ["AM", "🇦🇲"], ["AQ", "🇦🇶"], ["AR", "🇦🇷"], ["AS", "🇦🇸"], ["AT", "🇦🇹"], ["AU", "🇦🇺"], ["AW", "🇦🇼"], ["AX", "🇦🇽"], ["AZ", "🇦🇿"],
    ["BA", "🇧🇦"], ["BB", "🇧🇧"], ["BD", "🇧🇩"], ["BE", "🇧🇪"], ["BF", "🇧🇫"], ["BG", "🇧🇬"], ["BH", "🇧🇭"], ["BI", "🇧🇮"], ["BJ", "🇧🇯"], ["BM", "🇧🇲"], ["BN", "🇧🇳"], ["BO", "🇧🇴"], ["BR", "🇧🇷"], ["BS", "🇧🇸"], ["BT", "🇧🇹"], ["BV", "🇧🇻"], ["BW", "🇧🇼"], ["BY", "🇧🇾"], ["BZ", "🇧🇿"],
    ["CA", "🇨🇦"], ["CF", "🇨🇫"], ["CH", "🇨🇭"], ["CK", "🇨🇰"], ["CL", "🇨🇱"], ["CM", "🇨🇲"], ["CN", "🇨🇳"], ["CO", "🇨🇴"], ["CP", "🇨🇵"], ["CR", "🇨🇷"], ["CU", "🇨🇺"], ["CV", "🇨🇻"], ["CW", "🇨🇼"], ["CX", "🇨🇽"], ["CY", "🇨🇾"], ["CZ", "🇨🇿"],
    ["DE", "🇩🇪"], ["DG", "🇩🇬"], ["DJ", "🇩🇯"], ["DK", "🇩🇰"], ["DM", "🇩🇲"], ["DO", "🇩🇴"], ["DZ", "🇩🇿"], ["EA", "🇪🇦"], ["EC", "🇪🇨"], ["EE", "🇪🇪"], ["EG", "🇪🇬"], ["EH", "🇪🇭"], ["ER", "🇪🇷"], ["ES", "🇪🇸"], ["ET", "🇪🇹"], ["EU", "🇪🇺"],
    ["FI", "🇫🇮"], ["FJ", "🇫🇯"], ["FK", "🇫🇰"], ["FM", "🇫🇲"], ["FO", "🇫🇴"], ["FR", "🇫🇷"], ["GA", "🇬🇦"], ["GB", "🇬🇧"], ["HK", "🇭🇰"], ["HU", "🇭🇺"], ["ID", "🇮🇩"], ["IE", "🇮🇪"], ["IL", "🇮🇱"], ["IM", "🇮🇲"], ["IN", "🇮🇳"], ["IS", "🇮🇸"], ["IT", "🇮🇹"], ["JP", "🇯🇵"], ["KR", "🇰🇷"], ["LU", "🇱🇺"], ["MO", "🇲🇴"], ["MX", "🇲🇽"], ["MY", "🇲🇾"], ["NL", "🇳🇱"], ["PH", "🇵🇭"], ["RO", "🇷🇴"], ["RS", "🇷🇸"], ["RU", "🇷🇺"], ["RW", "🇷🇼"],
    ["SA", "🇸🇦"], ["SB", "🇸🇧"], ["SC", "🇸🇨"], ["SD", "🇸🇩"], ["SE", "🇸🇪"], ["SG", "🇸🇬"], ["TH", "🇹🇭"], ["TN", "🇹🇳"], ["TO", "🇹🇴"], ["TR", "🇹🇷"], ["TV", "🇹🇻"], ["TW", "🇹🇼"], ["UK", "🇬🇧"], ["UM", "🇺🇲"], ["US", "🇺🇸"], ["UY", "🇺🇾"], ["UZ", "🇺🇿"], ["VA", "🇻🇦"], ["VE", "🇻🇪"], ["VG", "🇻🇬"], ["VI", "🇻🇮"], ["VN", "🇻🇳"], ["ZA", "🇿🇦"]
]);
