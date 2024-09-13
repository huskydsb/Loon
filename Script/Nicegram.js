[rewrite_local]
^https?:\/\/nicegram\.cloud\/api\/v\d\/(ai-assistant\/purchase-list|user\/info|telegram\/auth) url script-response-body https://raw.githubusercontent.com/huskydsb/Loon/main/Script/Nicegram.js

[mitm]
hostname = nicegram.cloud
*/
var body = $response.body;

body = body.replace(/"store_subscription":false/g, '"store_subscription":true');
body = body.replace(/"lifetime_subscription":false/g,'"lifetime_subscription":true');
body = body.replace(/"subscription":false/g,'"subscription":true');


$done({ body });