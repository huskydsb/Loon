const pingUrl = "http://www.gstatic.com/generate_204";
const downloadUrl = "https://speedtest.sagg.us.kg/10m"; // 10MB 文件
const fileSizeInMB = 10; // 文件大小 10MB

// 获取当前节点名称
const nodeName = $environment.params.node || "当前节点"; // 默认值为 "当前节点" 如果未定义

let pingStart = Date.now();
let pingDuration = "测试失败"; // 默认值为 "测试失败"
let downloadSpeed = "测试失败"; // 默认值为 "测试失败"

// 1. 进行延迟测试（Ping Test）
$httpClient.get({
    url: pingUrl,
    node: nodeName // 使用当前节点
}, (error, response, data) => {
    if (!error) {
        pingDuration = `${Date.now() - pingStart} ms`; // 成功时更新延迟
        console.log(`Ping 延迟: ${pingDuration}`);
    } else {
        console.log("Ping 测试失败");
    }

    // 2. 进行下载速度测试
    let downloadStart = Date.now();
    $httpClient.get({
        url: downloadUrl,
        node: nodeName // 使用当前节点
    }, (error, response, data) => {
        if (!error) {
            let downloadEnd = Date.now();
            let durationInSeconds = (downloadEnd - downloadStart) / 1000;
            downloadSpeed = `${(fileSizeInMB / durationInSeconds).toFixed(2)} MB/s`; // 成功时更新下载速度
            console.log(`下载速度: ${downloadSpeed}`);
        } else {
            console.log("下载速度测试失败");
        }

        // 显示最终统一测试结果
        $done({
            title: "网络速度测试结果",
            htmlMessage: `
                <div style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin;">
                    <br> <!-- 一行空行 -->
                    <br>-------------------------------
                    <br><br> <!-- 两行空行 --> 
                    <div style="display: inline-block; text-align: center;">
                        <div style="display: flex; justify-content: center; align-items: center; gap: 20px;">
                            <div><b>网络延迟：</b>${pingDuration}</div>
                        </div>
                        <br> <!-- 一行空行 -->
                        <div style="display: flex; justify-content: center; align-items: center; gap: 20px;">
                            <div><b>下载速度：</b>${downloadSpeed}</div>
                        </div>
                    </div>
                    <br>-------------------------------
                    <br><br>
                    <div style="color: red; font-weight: thin; font-size: small;"><b>当前节点：</b>${nodeName}</div> <!-- 字体缩小为 small -->
                </div>`,
            icon: "network",
            "icon-color": "#5AC8FA"
        });
    });
});
