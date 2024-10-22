// 获取环境参数
var inputParams = $environment.params || {}; // 确保 params 存在
var nodeName = inputParams.node || "N/A"; // 获取节点名称

// 第一步：获取响应数据
$httpClient.get("https://ping0.cc/", function(error, response, data) {
    if (error) {
        console.error("Error fetching the page:", error);
        $done(); // 结束请求
        return;
    }

    // 使用正则表达式提取 IP 地址
    let ipRegex = /<div class="content">\s*(.*?)\s*<span v-if="rdns.length>0">/;
    let ipMatch = data.match(ipRegex);
    let ipAddress = ipMatch ? ipMatch[1].trim() : "N/A";

    // 使用正则表达式提取 IP 位置
    let locationRegex = /<div class="content">\s*<img[^>]*>\s*(.*?)&mdash;/;
    let locationMatch = data.match(locationRegex);
    let ipLocation = locationMatch ? locationMatch[1].trim() : "N/A";

    // 使用正则表达式提取 ASN
    let asnRegex = /<div class="content">\s*<a[^>]*>(AS\d+)<\/a>/;
    let asnMatch = data.match(asnRegex);
    let asn = asnMatch ? asnMatch[1].trim() : "N/A";

    // 使用正则表达式提取 ASN 所有者
    let ownerRegex = /<div class="content">\s*<span[^>]*>(.*?)<\/span>\s*(.*?)\s*<span v-if="asndomain.length>0">/;
    let ownerMatch = data.match(ownerRegex);
    let ownerLabel = ownerMatch ? ownerMatch[1].trim() : "N/A";
    let ownerName = ownerMatch ? ownerMatch[2].trim() : "N/A";

    // 使用正则表达式提取 ASN 域名
    let domainRegex = /<span v-if="asndomain.length>0">.*?—\s*<a[^>]*>(.*?)<\/a>/;
    let domainMatch = data.match(domainRegex);
    let asnDomain = domainMatch ? domainMatch[1].trim() : "N/A";

    // 使用正则表达式提取 企业 信息
    let orgRegex = /<div class="content">\s*<span[^>]*>(.*?)<\/span>\s*(.*?)\s*<span v-if="orgdomain.length>0">/;
    let orgMatch = data.match(orgRegex);
    let orgLabel = orgMatch ? orgMatch[1].trim() : "N/A";
    let orgName = orgMatch ? orgMatch[2].trim() : "N/A";

    // 使用正则表达式提取 企业 域名
    let orgDomainRegex = /<span v-if="orgdomain.length>0">.*?—\s*<a[^>]*>(.*?)<\/a>/;
    let orgDomainMatch = data.match(orgDomainRegex);
    let orgDomain = orgDomainMatch ? orgDomainMatch[1].trim() : "N/A";

    // 使用正则表达式提取 IP 类型
    let ipTypeRegex = /<div class="name">\s*<span>IP类型<\/span>\s*<a[^>]*>\(说明\?\)<\/a>\s*<\/div>\s*<div class="content">\s*(.*?)<\/div>/;
    let ipTypeMatch = data.match(ipTypeRegex);
    let ipType = ipTypeMatch ? ipTypeMatch[1].trim() : "N/A";

    // 使用正则表达式提取 风控值
    let riskValueRegex = /<div class="value">(\d+%)<\/span>\s*<span class="lab">\s*(.*?)<\/span>/;
    let riskValueMatch = data.match(riskValueRegex);
    let riskValue = riskValueMatch ? riskValueMatch[1].trim() : "N/A";
    let riskDescription = riskValueMatch ? riskValueMatch[2].trim() : "N/A";

    // 使用正则表达式提取 原生 IP
    let nativeIpRegex = /<div class="name">\s*<span>原生 IP<\/span>\s*<a[^>]*>\(说明\?\)<\/a>\s*<\/span>\s*<\/div>/;
    let nativeIpMatch = data.match(nativeIpRegex);
    let nativeIp = nativeIpMatch ? "原生 IP" : "N/A";

    // 控制台输出获取到的信息
    console.log("节点名称：", nodeName);
    console.log("获取到的 IP 地址：", ipAddress);
    console.log("获取到的 IP 位置：", ipLocation);
    console.log("获取到的 ASN：", asn);
    console.log("获取到的 ASN 所有者标签：", ownerLabel);
    console.log("获取到的 ASN 所有者名称：", ownerName);
    console.log("获取到的 ASN 域名：", asnDomain);
    console.log("获取到的 企业 标签：", orgLabel);
    console.log("获取到的 企业 名称：", orgName);
    console.log("获取到的 企业 域名：", orgDomain);
    console.log("获取到的 IP 类型：", ipType);
    console.log("获取到的 风控值：", riskValue, riskDescription);
    console.log("获取到的 原生 IP：", nativeIp);

    // 创建结果 HTML
    var resultHtml = `
        <br>------------------------------------------------
        <br><b>节点名称：</b>${nodeName}
        <br><b>IP地址：</b>${ipAddress}
        <br><b>IP位置：</b>${ipLocation}
        <br><b>ASN：</b>${asn}
        <br><b>ASN 所有者：</b>${ownerLabel} ${ownerName} — ${asnDomain}
        <br><b>企业：</b>${orgLabel} ${orgName} — ${orgDomain}
        <br><b>IP类型：</b>${ipType}
        <br><b>风控值：</b>${riskValue} ${riskDescription}
        <br><b>原生 IP：</b>${nativeIp}
        <br>------------------------------------------------
    `;

    // 调用 $done 结束请求并返回结果
    $done({ "title": "IP地址查询", "htmlMessage": resultHtml });
});
