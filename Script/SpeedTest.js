!(async () => {
    const starttime = Date.now();
  
    // 获取用户配置的参数
    const mb = $persistentStore.read('testFileSize') || 100; // 文件大小，默认100MB
    const timeout = $persistentStore.read('timeout') || 10000; // 超时时间，默认10000ms
    const bytes = mb * 1024 * 1024;
    const url = `https://speed.cloudflare.com/__down?bytes=${bytes}`;
    const path = 'data/.cache/speedtest.file';
    const pingurl = 'http://connectivitycheck.gstatic.com/generate_204';
  
    const id = $notification.post('测速中', '延迟测试中，请稍后...', '', {});
  
    let pingduration; // 在共同作用域内声明变量
    const pingstart = Date.now();
  
    try {
      await $httpClient.get(pingurl);
      const pingend = Date.now();
      const pingDuration = pingend - pingstart;
  
      if (pingDuration > timeout) {
        pingduration = 'Error';
        $notification.post('测速失败', '延迟测试失败', '', {});
      } else {
        pingduration = pingDuration.toFixed(2) + ' ms';
        $notification.post('延迟测试成功', '延迟：' + pingduration, '', {});
      }
    } catch (error) {
      pingduration = 'Error';
      $notification.post('测速失败', '延迟测试失败', '', {});
    }
  
    await $utils.sleep(1000);
    $notification.post('测速中', '下行速度测试中，请稍后...', '', {});
  
    let end;
    let speed;
    let duration;
    const start = Date.now();
  
    try {
      await $httpClient.download(url, path);
      end = Date.now();
      const Duration = (end - start) / 1000;
      const Speed = mb / Duration;
      duration = Duration.toFixed(2) + ' s';
      speed = Speed.toFixed(2) + ' MB/s';
  
      $file.delete(path);
    } catch (error) {
      speed = 'Error';
      duration = 'Error';
      $notification.post('测速失败', '下行速度测试失败', '', {});
    }
  
    const endtime = Date.now();
    const Time = ((endtime - starttime) / 1000).toFixed(2) + ' s';
  
    const result = `
      ⚡ 延迟: ${pingduration}
      💨 下行速度: ${speed}
      ⏳ 测试耗时: ${Time}
    `;
  
    $notification.post('测速结果', result, '', {});
  })();
  