// $environment.params with input params
console.log($environment.params);

var ipUrl = "http://ip-api.com/json/";
var scamUrl = "https://api11.scamalytics.com/shaoxinweixuer/?key=3d803bd1825826b88353d677e37d5f54ee5685e242347e88b8159c103bbc5ef1&ip=";

var inputParams = $environment.params;
var nodeName = inputParams.node;

// Request IP info
var requestParams = {
    "url": ipUrl,
    "node": nodeName
};

$httpClient.get(requestParams, (error, response, data) => {
    if (error) {
        var message = "<br><br>🔴 查询超时";
        message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: bold;">${message}</p>`;
        $done({ "title": "IP洁净度检测", "htmlMessage": message });
    } else {
        console.log(data);
        var ipInfo = JSON.parse(data);
        var ip = ipInfo.ip;

        // Request scam info
        var scamRequestParams = {
            "url": scamUrl + ip,
            "node": nodeName
        };

        $httpClient.get(scamRequestParams, (error, response, data) => {
            if (error) {
                var message = "<br><br>🔴 查询超时";
                message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: bold;">${message}</p>`;
                $done({ "title": "IP洁净度检测", "htmlMessage": message });
            } else {
                var scamInfo = JSON.parse(data);
                var scamDetails = `
                <br><b>IP地址</b> : ${scamInfo.ip}
                <br><b>风险评分</b> : ${scamInfo.score}
                <br><b>风险级别</b> : ${scamInfo.risk}
                <br><b>ISP 名称</b> : ${scamInfo['ISP Name']}
                <br><b>城市</b> : ${scamInfo.ip_city}
                <br><b>国家</b> : ${scamInfo.ip_country_name}
                <br><b>AS 编号</b> : ${scamInfo.as_number}
                `;

                var message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">${scamDetails}</p>`;
                $done({ "title": "IP洁净度检测", "htmlMessage": message });
            }
        });
    }
});
