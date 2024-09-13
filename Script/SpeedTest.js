const pingUrl = "http://connectivitycheck.gstatic.com/generate_204";
const downloadUrl = "https://speed.cloudflare.com/__down?bytes=10485760"; // 10MB 文件
const fileSizeInMB = 10; // 文件大小 10MB

let pingStart = Date.now();
let pingDuration;
let downloadStart, downloadEnd, downloadSpeed;

// 1. 进行延迟测试（Ping Test）
$httpClient.get(pingUrl, (error, response, data) => {
    if (error) {
        console.log("Ping 测试失败");
    } else {
        pingDuration = Date.now() - pingStart;
        console.log(`Ping 延迟: ${pingDuration} ms`);

        // 2. 进行下载速度测试
        downloadStart = Date.now();
        $httpClient.get(downloadUrl, (error, response, data) => {
            if (error) {
                console.log("下载速度测试失败");
            } else {
                downloadEnd = Date.now();
                let durationInSeconds = (downloadEnd - downloadStart) / 1000;
                downloadSpeed = (fileSizeInMB / durationInSeconds).toFixed(2); // 计算下载速度
                console.log(`下载速度: ${downloadSpeed} MB/s`);
                
                // 输出测试结果
                console.log(`测试完成! \n延迟: ${pingDuration} ms \n下载速度: ${downloadSpeed} MB/s`);
                
                // 显示最终测试结果
                $done({
                    title: "网络速度测试结果",
                    content: `延迟: ${pingDuration} ms\n下载速度: ${downloadSpeed} MB/s`,
                    icon: "network",
                    "icon-color": "#5AC8FA"
                });
            }
        });
    }
});
