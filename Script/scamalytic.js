// LOON 脚本
var ipApiUrl = "http://ip-api.com/json/";
var scamApiKey = "3d803bd1825826b88353d677e37d5f54ee5685e242347e88b8159c103bbc5ef1";
var scamApiUrl = "https://api11.scamalytics.com/shaoxinweixuer/?key=" + scamApiKey + "&ip=";

console.log($environment.params);
var inputParams = $environment.params;
var nodeName = inputParams.node;

// 查询 IP 地址
var requestParams = {
    "url": ipApiUrl,
    "node": nodeName
};

$httpClient.get(requestParams, (error, response, data) => {
    if (error) {
        var message = "<br><br>🔴 查询超时";
        message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: bold;">${message}</p>`;
        $done({ "title": "IP查询", "htmlMessage": message });
    } else {
        console.log(data);
        var ipInfo = JSON.parse(data);
        var ip = ipInfo.query;
        
        // 查询欺诈分数
        var scamRequestParams = {
            "url": scamApiUrl + ip,
            "node": nodeName
        };

        $httpClient.get(scamRequestParams, (error, response, data) => {
            if (error) {
                var message = "<br><br>🔴 查询超时";
                message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: bold;">${message}</p>`;
                $done({ "title": "IP欺诈检测", "htmlMessage": message });
            } else {
                var scamInfo = JSON.parse(data);

                // 格式化输出内容
                var scamDetails = json2info(JSON.stringify(scamInfo), [
                    "ip", "score", "risk", "ip_city", "ip_country_code", "ISP Name", "ISP Fraud Score", "as_number"
                ]);

                var message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">${scamDetails}</p>`;
                $done({ "title": "IP欺诈检测", "htmlMessage": message });
            }
        });
    }
});

function json2info(cnt, paras) {
    var res = "-------------------------------";
    cnt = JSON.parse(cnt);
    console.log(cnt);
    for (var i = 0; i < paras.length; i++) {
        var key = paras[i];
        var value = cnt[key];

        if (key === "ip_country_code") {
            value = flags.get(value) || value; // 处理国旗 emoji
        }

        res += value ? `</br><b><font color=>${key}</font> : </b><font color=>${value}</font></br>` : '';
    }
    res += "-------------------------------" + "</br>" + "<font color=#6959CD>" + "<b>节点</b> ➟ " + $environment.params.node + "</font>";
    return `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">${res}</p>`;
}

var flags = new Map([
    ["HK", "🇭🇰"] // 香港的国旗 emoji
    // 其他国家的国旗 emoji 可以在这里添加
]);
