// 第一步：获取 IP 地址
$httpClient.get("https://scamalytics.com/", function(error, response, data) {
    if (error) {
        console.error("Error fetching the page:", error);
        return;
    }

    // 使用正则表达式提取 input 中的 value
    let regex = /<input[^>]+name="ip"[^>]+value='([^']+)'/;
    let match = data.match(regex);
    let ipValue = match ? match[1] : null;

    if (ipValue) {
        console.log("Fetched IP:", ipValue);

        // 第二步：使用获取到的 IP 进行请求
        $httpClient.get(`https://scamalytics.com/search?ip=${ipValue}`, function(error, response, data) {
            if (error) {
                console.error("Error fetching the IP details:", error);
                return;
            }

            // 提取城市、国家、IP 名称、ASN 编号和 ASN 机构
            let cityRegex = /<th>City<\/th>\s*<td>(.*?)<\/td>/;
            let countryRegex = /<th>Country Name<\/th>\s*<td>(.*?)<\/td>/;
            let ipNameRegex = /<th>Organization Name<\/th>\s*<td>(.*?)<\/td>/;
            let asnNumberRegex = /<th>ASN<\/th>\s*<td>(.*?)<\/td>/;
            let asnOrgRegex = /<th>ASN Organization<\/th>\s*<td>(.*?)<\/td>/;

            let cityMatch = data.match(cityRegex);
            let countryMatch = data.match(countryRegex);
            let ipNameMatch = data.match(ipNameRegex);
            let asnNumberMatch = data.match(asnNumberRegex);
            let asnOrgMatch = data.match(asnOrgRegex);

            let city = cityMatch ? cityMatch[1] : "N/A";
            let country = countryMatch ? countryMatch[1] : "N/A";
            let ipName = ipNameMatch ? ipNameMatch[1] : "N/A";
            let asnNumber = asnNumberMatch ? asnNumberMatch[1] : "N/A";
            let asnOrg = asnOrgMatch ? asnOrgMatch[1] : "N/A";

            console.log(`City: ${city}, Country: ${country}, IP Name: ${ipName}, ASN Number: ${asnNumber}, ASN Org: ${asnOrg}`);
        });
    } else {
        console.log("No IP found.");
    }
});
