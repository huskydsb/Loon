// 获取传递的参数

console.log($argument);

let hostname = $argument.hostname;
let username = $argument.username;
let api = $argument.api;

// 输出参数值用于调试
console.log("hostname: " + hostname);
console.log("username: " + username);
console.log("api: " + api);

// 如果参数都存在，则输出成功消息
if (hostname && username && api) {
    var message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: bold;">
                    参数获取成功！<br><br>
                    hostname: ${hostname}<br>
                    username: ${username}<br>
                    api: ${api}
                   </p>`;
    $done({ "title": "参数获取", "htmlMessage": message });
} else {
    // 如果缺少参数，输出错误信息
    var message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: bold; color: red;">
                    参数获取失败，请检查配置。
                   </p>`;
    $done({ "title": "参数获取", "htmlMessage": message });
}
