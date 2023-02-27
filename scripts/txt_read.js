/***************************
主要用于预览yaml及snippet 等Safari需要下载的文本
在需要预览的链接末尾加上.t_read.txt
[Script]
文本预览器 = type=http-request,pattern=\.t_read\.txt$,requires-body=1,max-size=3145728,script-path=https://raw.githubusercontent.com/chengkongyiban/shadowrocket/main/Block/txt_read.module,script-update-interval=0

[MITM]

hostname = %APPEND% github.com, raw.githubusercontent.com,gitlab.com,gist.githubusercontent.com,gitlab.com
****************************/

const isStashiOS = 'undefined' !== typeof $environment && $environment['stash-version'];
const isSurgeiOS = 'undefined' !== typeof $environment && $environment['surge-version'];
const isShadowrocket = 'undefined' !== typeof $rocket;
const isLooniOS = 'undefined' != typeof $loon;
	
let req = $request.url.replace(/\.t_read\.txt$/,'');
!(async () => {
  let body = await http(req);
//判断是否断网
if(body == null){if(isSurgeiOS || isStashiOS){
	$notification.post("文本预览：未获取到body","请检查网络及节点是否畅通","认为是bug?点击通知反馈",{url:"https://t.me/zhangpeifu"})
 $done({ response: { status: 404 ,body:{} } });}else{$notification.post("文本预览：未获取到body","请检查网络及节点是否畅通","认为是bug?点击通知反馈","https://t.me/zhangpeifu")
 $done({ response: { status: 404 ,body:{} } });
}//识别客户端通知
}else{

 $done({ response: { status: 200 ,body:body ,headers: {'Content-Type': 'text/plain; charset=utf-8'} } });
}//判断是否断网的反括号

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