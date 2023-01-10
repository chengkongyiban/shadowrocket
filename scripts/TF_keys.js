$persistentStore.write(null, 'request_id')
let url = $request.url
let fdbUrl = "https://t.me/zhangpeifu"
let key = url.replace(/(.*accounts\/)(.*)(\/apps)/, '$2')

let session_id = $request.headers['X-Session-Id'] || $request.headers['x-session-id']

 let session_digest = $request.headers['X-Session-Digest'] || $request.headers['x-session-digest']

 let request_id = $request.headers['X-Request-Id'] || $request.headers['x-request-id']

$persistentStore.write(key, 'key')
$persistentStore.write(session_id, 'session_id')
$persistentStore.write(session_digest, 'session_digest')
$persistentStore.write(request_id, 'request_id')

if (!$persistentStore.read('request_id') && $persistentStore.read('request_id') != 0) {
	$notification.post('信息获取失败','为什么失败','我也不知道啊')
console.log('request_id为' + $persistentStore.read('request_id'))
} else {
	$notification.post('请关闭本脚本', '信息获取成功','')
}
$done({})
