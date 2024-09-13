const pingUrl = "http://connectivitycheck.gstatic.com/generate_204";
const downloadUrl = "https://speed.hetzner.de/100MB.bin"; // 100MB 文件
const fileSizeInMB = 100; // 文件大小 100MB

// 获取当前节点名称
const nodeName = $environment.params.node || "当前节点"; // 默认值为 "当前节点" 如果未定义

let pingStart = Date.now();
let pingDuration;
let downloadStart, downloadEnd, downloadSpeed;

// 1. 进行延迟测试（Ping Test）
$httpClient.get({
    url: pingUrl,
    node: nodeName // 使用当前节点
}, (error, response, data) => {
    if (error) {
        console.log("Ping 测试失败");
        $done({
            title: "网络速度测试结果",
            content: `节点: ${nodeName}\nPing 测试失败`,
            icon: "network",
            "icon-color": "#FF0000"
        });
    } else {
        pingDuration = Date.now() - pingStart;
        console.log(`Ping 延迟: ${pingDuration} ms`);

        // 2. 进行下载速度测试
        downloadStart = Date.now();
        $httpClient.get({
            url: downloadUrl,
            node: nodeName // 使用当前节点
        }, (error, response, data) => {
            if (error) {
                console.log("下载速度测试失败");
                $done({
                    title: "网络速度测试结果",
                    content: `节点: ${nodeName}\n下载速度测试失败`,
                    icon: "network",
                    "icon-color": "#FF0000"
                });
            } else {
                downloadEnd = Date.now();
                let durationInSeconds = (downloadEnd - downloadStart) / 1000;
                downloadSpeed = (fileSizeInMB / durationInSeconds).toFixed(2); // 计算下载速度
                console.log(`下载速度: ${downloadSpeed} MB/s`);
                
                // 显示最终测试结果
                $done({
                    title: "网络速度测试结果",
                    content: `当前节点: ${nodeName}\n网络延迟: ${pingDuration} ms\n下载速度: ${downloadSpeed} MB/s`,
                    icon: "network",
                    "icon-color": "#5AC8FA"
                });
            }
        });
    }
});
