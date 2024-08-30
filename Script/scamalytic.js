console.log($environment.params);
var ipapiUrl = "https://ipapi.co/json/";
var scamalyticsUrl = "https://api11.scamalytics.com/shaoxinweixuer/?key=3d803bd1825826b88353d677e37d5f54ee5685e242347e88b8159c103bbc5ef1&ip=";

var requestParams = {
    "url": ipapiUrl
}

var message = "";
$httpClient.get(requestParams, (error, response, data) => {
    if (error) {
        message = "</br></br>🔴 查询超时";
        message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: bold;">` + message + `</p>`;
        $done({ "title": "  地理位置查询", "htmlMessage": message });
    } else {
        var ipData = JSON.parse(data);
        var ip = ipData.ip;
        
        var scamalyticsRequestParams = {
            "url": scamalyticsUrl + ip
        }
        
        $httpClient.get(scamalyticsRequestParams, (error, response, data) => {
            if (error) {
                message = "</br></br>🔴 查询超时";
                message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: bold;">` + message + `</p>`;
                $done({ "title": "  IP 风险查询", "htmlMessage": message });
            } else {
                var scamalyticsData = JSON.parse(data);
                message = scamalyticsData ? json2info(scamalyticsData) : "";
                $done({ "title": "  IP 风险查询", "htmlMessage": message });
            }
        });
    }
});

function json2info(data) {
    var res = "-------------------------------";
    
    const paras = {
        "ip": "IP 地址",
        "score": "风险评分",
        "risk": "风险等级",
        "ISP Name": "ISP 名称",
        "ip_city": "城市",
        "ip_country_name": "国家",
        "as_number": "ASN"
    };
    
    for (const [key, label] of Object.entries(paras)) {
        res += data[key] ? "</br><b>" + "<font color=#000>" + label + "</font> : " + "</b>" + "<font color=#000>" + data[key] + "</font></br>" : "";
    }
    
    res += "-------------------------------";
    res += "</br>" + "<font color=#6959CD>" + "<b>节点</b> ➟ " + $environment.params.node + "</font>";
    res = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">` + res + `</p>`;
    
    return res;
}
