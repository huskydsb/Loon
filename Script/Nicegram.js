const isLoon = typeof $loon !== 'undefined';
const isSurge = typeof $httpClient !== 'undefined';
const isQuantumultX = typeof $task !== 'undefined';

if (isLoon) {
    console.log('\nR·E Nicegram Script Log:\nNicegram Premium已解锁😎');
    $done({
        status: "HTTP/1.1 200 OK",
        headers: { "Content-Type": "application/json" },
        body: '{"data": {"premiumAccess": true}}'
    });
} else if (isSurge) {
    console.log('\nR·E Nicegram Script Log:\nNicegram Premium已解锁😎');
    $done({
        response: {
            status: 200,
            body: '{"data": {"premiumAccess": true}}'
        }
    });
} else if (isQuantumultX) {
    console.log('\nR·E Nicegram Script Log:\nNicegram Premium已解锁😎');
    $done({
        status: "HTTP/1.1 200 OK",
        headers: { "Content-Type": "application/json" },
        body: '{"data": {"premiumAccess": true}}'
    });
} else {
    console.log('\nR·E Nicegram Script Log:\nNicegram Premium已解锁😎');
    $done({
        status: 200,
        body: '{"data": {"premiumAccess": true}}'
    });
}
