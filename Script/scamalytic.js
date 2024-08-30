console.log($environment.params);
var ipUrl = "https://ipapi.co/json/";
var scamUrl = "https://api11.scamalytics.com/shaoxinweixuer/?key=3d803bd1825826b88353d677e37d5f54ee5685e242347e88b8159c103bbc5ef1&ip=";

var inputParams = $environment.params;
var nodeName = inputParams.node;

var requestParams = {
    "url": ipUrl,
    "node": nodeName,
    "timeout": 60 // 将超时时间增加到60秒
};

function requestWithRetry(params, callback, retries = 3) {
    $httpClient.get(params, (error, response, data) => {
        if (error && retries > 0) {
            console.log(`请求失败，剩余重试次数: ${retries}, 错误信息: ` + JSON.stringify(error));
            requestWithRetry(params, callback, retries - 1); // 重试
        } else {
            callback(error, response, data);
        }
    });
}

requestWithRetry(requestParams, (error, response, data) => {
    if (error) {
        console.log("第一次请求失败：" + JSON.stringify(error)); // 输出第一次请求的错误信息
        message = "<br><br>🔴 第一次请求超时";
        message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: bold;">${message}</p>`;
        $done({ "title": "IP洁净度检测", "htmlMessage": message });
    } else {
        console.log("第一次请求成功：" + data); // 输出第一次请求的响应数据
        var ipInfo = JSON.parse(data);
        var ip = ipInfo.ip;
        var scamRequestParams = {
            "url": scamUrl + ip,
            "node": nodeName,
            "timeout": 60 // 将超时时间增加到60秒
        };

        requestWithRetry(scamRequestParams, (error, response, data) => {
            if (error) {
                console.log("第二次请求失败：" + JSON.stringify(error)); // 输出第二次请求的错误信息
                message = "<br><br>🔴 第二次请求超时";
                message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: bold;">${message}</p>`;
                $done({ "title": "IP洁净度检测", "htmlMessage": message });
            } else {
                console.log("第二次请求成功：" + data); // 输出第二次请求的响应数据
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

                message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">${scamDetails}</p>`;
                $done({ "title": "IP洁净度检测", "htmlMessage": message });
            }
        });
    }
});
