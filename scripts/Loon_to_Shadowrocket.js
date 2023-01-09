/****************************
原脚本作者@小白脸 脚本修改@chengkongyiban
感谢@xream 的指导
说明
   t&zd; = {  , }  花括号中的逗号

***************************/
const isSurgeiOS = 'undefined' !== typeof $environment && $environment['surge-version'];
const isShadowrocket = 'undefined' !== typeof $rocket;
const modStore = "https://loon-gallery.vercel.app/";

var name = "";
var desc = "";
let req = $request.url.replace(/plugin/,'plugin');
let urlArg = $request.url.replace(/.+plugin(\?.*)/,'$1');
var original = [];//用于获取原文行号
//获取参数
var nName = urlArg.indexOf("n=") != -1 ? (urlArg.split("n=")[1].split("&")[0].split("+")) : null;
var Pin0 = urlArg.indexOf("y=") != -1 ? (urlArg.split("y=")[1].split("&")[0].split("+")).map(decodeURIComponent) : null;
var Pout0 = urlArg.indexOf("x=") != -1 ? (urlArg.split("x=")[1].split("&")[0].split("+")).map(decodeURIComponent) : null;
//修改名字和简介
if (nName === null){
	name = req.match(/.+\/(.+)\.(conf|js|snippet|txt)/)?.[1] || '无名';
    desc = name;
}else{
	name = nName[0] != "" ? nName[0] : req.match(/.+\/(.+)\.(conf|js|snippet|txt)/)?.[1];
	desc = nName[1] != undefined ? nName[1] : nName[0];
};
name = "#!name=" + decodeURIComponent(name);
desc = "#!desc=" + decodeURIComponent(desc);

!(async () => {
  let body = await http(req);

	body = body.match(/[^\n]+/g);
let plugin = [];
//let URLRewrite = [];
//let MITM = [];

body.forEach((x, y, z) => {
	x = x.replace(/^(#|;|\/\/)/,"#")
	if (x.match(/^(DOM|U|IP|GEO)[^,]+,[^,]+,.+/)){
		plugin.push(x)
	}else{
	plugin.push(x.replace(/^(DOM|USER|URL|IP|GEO)[^,]+,[^,]+[^,]$/,""))
	};
	
}); //循环结束

plugin = (plugin[0] || '') && `${plugin.join("\n\n")}`;


body = `${plugin}`
		.replace(/\[Rewrite\]/gi,'\n[URL Rewrite]\n')
		.replace(/\[MITM\]/gi,'\n[MITM]\n')
		.replace(/\[Script\]/gi,'\n[Script]\n')
		.replace(/\[Rule\]/gi,'\n[Rule]\n')
		.replace(/\[General\]/gi,'\n[General]\n')
		.replace(/(.+)\x20(302|307)\x20(.+)/gi,"$1 $3 $2")
		.replace(/hostname\x20?=\x20?(.*)/gi,"hostname = %APPEND% $1")
		.replace(/skip-proxy\x20?=\x20?(.+)/gi,"skip-proxy = %APPEND% $1")
		.replace(/bypass-tun\x20?=\x20?(.+)/gi,"tun-excluded-routes = %APPEND% $1")
		.replace(/real-ip\x20?=\x20?(.+)/gi,"always-real-ip = %APPEND% $1")
		.replace(/\x20{2,}/gi,' ')
		.replace(/"{2,}/g,'"')
		.replace(/(#.+\n)\n/g,'$1')
		.replace(/\n{2,}/g,'\n\n')
		.replace(/hostname\x20=\x20%APPEND%\x20\n\n安装失败\n\n1、请检查模块商店是否安装\n\n2、请检查是否开启HTTPS解密\n\n小火箭开启HTTPS解密教程https:\/\/t\.me\/h5683577\/3\n\nSurge开启HTTPS解密\(MITM\)教程https:\/\/t\.me\/h5683577\/135/,"hostname = %APPEND% \n\n模块商店已成功安装!!!")

if (isSurgeiOS) {
         if (body.match("验证结果↓↓↓") != null && body.match("请检查模块商店是否安装") == null)  {
			 $notification.post("已成功安装模块商店","点击通知跳转模块商店","https://loon-gallery.vercel.app/",{url:modStore})
		}else{};
		}else{
			if (body.match("验证结果↓↓↓") != null && body.match("请检查模块商店是否安装") == null)  {
			 $notification.post("已成功安装模块商店","点击通知跳转模块商店","https://loon-gallery.vercel.app/",modStore)
		}else{};
		};				
	

 $done({ response: { status: 200 ,body:body ,headers: {'Content-Type': 'text/plain; charset=utf-8'} } });

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