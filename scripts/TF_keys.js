/*
author=DecoAri
小火箭用户不再错误的得到获取信息成功的通知，现在一碗粉就是一碗粉
*/

$persistentStore.write(null, 'request_id')
let url = $request.url
let key = url.replace(/(.*accounts\/)(.*)(\/apps)/, '$2')

let session_id = $request.headers['X-Session-Id'] || $request.headers['x-session-id']

 let session_digest = $request.headers['X-Session-Digest'] || $request.headers['x-session-digest']

 let request_id = $request.headers['X-Request-Id'] || $request.headers['x-request-id']

$persistentStore.write(key, 'key')
$persistentStore.write(session_id, 'session_id')
$persistentStore.write(session_digest, 'session_digest')
$persistentStore.write(request_id, 'request_id')

if (!$persistentStore.read('request_id')) {
	$notification.post('信息获取失败','请仔细阅读使用方法','')
console.log('request_id为' + $persistentStore.read('request_id'))
} else {
	$notification.post('请关闭本脚本', '信息获取成功','')
}
$done({})
