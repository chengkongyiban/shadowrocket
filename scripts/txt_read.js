/***************************
主要用于预览yaml及snippet 等Safari需要下载的文本
在需要预览的链接末尾加上.t_read.txt
[Script]
文本预览器 = type=http-request, pattern=\.t_read\.txt$, requires-body=false, script-path=https://raw.githubusercontent.com/chengkongyiban/shadowrocket/main/scripts/txt_read.js, script-update-interval=0

[MITM]

hostname = %APPEND% github.com, raw.githubusercontent.com,gitlab.com,gist.githubusercontent.com,gitlab.com

---------------------------
[rewrite_local]

\.t_read\.txt$ url script-analyze-echo-response https://raw.githubusercontent.com/chengkongyiban/shadowrocket/main/scripts/txt_read.js 

****************************/
const isQX = "undefined" != typeof $task;

let req = $request.url.replace(/\.t_read\.txt$/,'');

!(async () => {
  let body = await http(req);
  
let ret = {body:body ,headers: {'Content-Type': 'text/plain; charset=utf-8'}};

$done(isQX() ? ret : {response: ret });

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