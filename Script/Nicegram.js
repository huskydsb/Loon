
let body = $response.body;


body = body.replace(/"store_subscription":false/g, '"store_subscription":true');
body = body.replace(/"lifetime_subscription":false/g, '"lifetime_subscription":true');
body = body.replace(/"subscription":false/g, '"subscription":true');


$done({ body });