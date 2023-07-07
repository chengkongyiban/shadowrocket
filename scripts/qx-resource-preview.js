/*************************
#!name=预览qx一键导入资源
#!desc=将qx的一键导入链接复制到Safari打开可以预览

[Script]

预览qx一键资源 = type=http-request,pattern=^https:\/\/quantumult\.app\/x\/open-app\/add-resource\?remote-resource=,requires-body=0,script-path=https://github.com/chengkongyiban/shadowrocket/raw/main/scripts/qx-resource-preview.js

[MITM]

hostname = %APPEND% quantumult.app

*************************/
const $ = new Env(`预览qx一键导入内容`)

let qxSchemeUrl = decodeURIComponent($request.url);

let qxFilterUrl = "";
let qxRewriteUrl = "";

if (qxSchemeUrl.search(/"filter_remote"/)){
  qxFilterUrl = $.toObj(qxSchemeUrl.split("?remote-resource=")[1]).filter_remote[0].split(",")[0];
};

if (qxSchemeUrl.search(/"rewrite_remote"/)){
  qxRewriteUrl = $.toObj(qxSchemeUrl.split("?remote-resource=")[1]).rewrite_remote[0].split(",")[0];
};

!(async () => {

let rewriteBody = await http(qxRewriteUrl);

if (qxFilterUrl != ""){
  qxFilterUrl = "分流链接:" + qxFilterUrl + "\n\n";
};
if (qxRewriteUrl != ""){
  qxRewriteUrl = "重写链接:" + qxRewriteUrl + "\n\n";
};

body = `${qxFilterUrl}${qxRewriteUrl}${rewriteBody}`;

$done({ response: { status: 200 ,body:body ,headers: {'Content-Type': 'text/plain; charset=utf-8'} } });
$done()

})()
.catch((e) => {
		$notification.post(`${e}`,'','');
		$done()
	})

function http(req) {
  return new Promise((resolve, reject) =>
    $httpClient.get(req, (err, resp,data) => {
  resolve(data)
  })
)
}

function Env(name) {
  LN = typeof $loon != `undefined`
  SG_STH_SDR = typeof $httpClient != `undefined` && !LN
  QX = typeof $task != `undefined`
  read = (key) => {
    if (LN || SG_STH_SDR) return $persistentStore.read(key)
    if (QX) return $prefs.valueForKey(key)
  }
  write = (key, val) => {
    if (LN || SG_STH_SDR) return $persistentStore.write(String(key), val); 
    if (QX) return $prefs.setValueForKey(String(key), val)
  }
  notice = (title, subtitle, message, url) => {
    if (LN) $notification.post(title, subtitle, message, url)
    if (SG_STH_SDR) $notification.post(title, subtitle, message, { url: url })
    if (QX) $notify(title, subtitle, message, { 'open-url': url })
  }
  get = (url, cb) => {
    if (LN || SG_STH_SDR) {$httpClient.get(url, cb)}
    if (QX) {url.method = `GET`; $task.fetch(url).then((resp) => cb(null, {}, resp.body))}
  }
  post = (url, cb) => {
    if (LN || SG_STH_SDR) {$httpClient.post(url, cb)}
    if (QX) {url.method = `POST`; $task.fetch(url).then((resp) => cb(null, {}, resp.body))}
  }
  toObj = (str) => JSON.parse(str)
  toStr = (obj) => JSON.stringify(obj)
  log = (message) => console.log(message)
  done = (value = {}) => {$done(value)}
  return { name, read, write, notice, get, post, toObj, toStr, log, done }
}
