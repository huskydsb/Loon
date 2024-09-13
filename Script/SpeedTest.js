const pingUrl = "http://www.gstatic.com/generate_204";
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
            htmlMessage: `
                <p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin;">
                    <hr style="border: 1px solid #888;" />
                    <b style="display: block; text-align: center;">网络延迟：</b>测试失败
                    <hr style="border: 1px solid #888;" />
                    <b style="display: block; text-align: center;">下载速度：</b>测试失败
                    <br><br>
                    <span style="color: red; text-align: center; display: block;"><b>当前节点：</b>${nodeName}</span>
                </p>`,
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
                    htmlMessage: `
                        <p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin;">
                            <hr style="border: 1px solid #888;" />
                            <b style="display: block; text-align: center;">网络延迟：</b>${pingDuration} ms
                            <hr style="border: 1px solid #888;" />
                            <b style="display: block; text-align: center;">下载速度：</b>测试失败
                            <br><br>
                            <span style="color: red; text-align: center; display: block;"><b>当前节点：</b>${nodeName}</span>
                        </p>`,
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
                    htmlMessage: `
                    <p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin;">
                    <br>-------------------------------------------------------
                    <br>
                    <div style="display: flex; justify-content: center; align-items: center; margin: 0 auto;">
                    <div style="margin-right: 20px;"><b>网络延迟：</b>${pingDuration} ms</div>
                    <div><b>下载速度：</b>${downloadSpeed} MB/s</div>
                    </div>
                    <br>-------------------------------------------------------
                    <br><br>
                    <span style="color: red; text-align: center; display: block;"><b>当前节点：</b>${nodeName}</span>
                    </p>`,
                    icon: "network",
                    "icon-color": "#5AC8FA"
                });
            }
        });
    }
});
