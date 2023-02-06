/****************************
原脚本作者@小白脸 脚本修改@chengkongyiban
感谢@xream 的指导
说明
   t&zd; = {  , }  花括号中的逗号

***************************/
const isSurgeiOS = 'undefined' !== typeof $environment && $environment['surge-version'];
const isShadowrocket = 'undefined' !== typeof $rocket;
var name = "";
var desc = "";
let req = $request.url.replace(/sg$/,'');
let urlArg = $request.url.replace(/.+sg(\?.*)/,'$1');
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
//判断是否断网
if(body == null){if(isSurgeiOS){
	$notification.post("重写转换：未获取到body","请检查网络及节点是否畅通","认为是bug?点击通知反馈",{url:"https://t.me/zhangpeifu"})
 $done({ response: { status: 404 ,body:{} } });}else{$notification.post("重写转换：未获取到body","请检查网络及节点是否畅通","认为是bug?点击通知反馈","https://t.me/zhangpeifu")
 $done({ response: { status: 404 ,body:{} } });
}//识别客户端通知
}else{//以下开始重写及脚本转换

	body = body.match(/[^\r\n]+/g);
let uHalf = [];
let lHalf = [];	
let mods = [];
let others = [];
let URLRewrite = [];
let script = [];

body.forEach((x, y, z) => {
	x = x.replace(/^ *(#|;|\/\/)/gi,'#');
	
	//判断注释
	
	if (x.match(/^[^#]/)){
	var noteK = "";
	}else{
	var noteK = "#";
	};
	
	if (x.match(/\x20data=/)){

//Mock转reject/request

				let ptn = x.replace(/\x20{2,}/g," ").split(" data=")[0].replace(/^#|"/g,"");
					let arg = x.split(' data="')[1].split('"')[0];
					let fileName = arg.substring(arg.lastIndexOf('/') + 1);
					let scname = arg.substring(arg.lastIndexOf('/') + 1, arg.lastIndexOf('.') );
					
				if (fileName.match(/(img|dict|array|200|blank|tinygif)\.[^.]+$/i)){
				z[y - 1]?.match(/^#/) && URLRewrite.push(z[y - 1]);
					
				let mock2Dict = fileName.match(/dict\.[^.]+$/i) ? '-dict' : '';
				let mock2Array = fileName.match(/array\.[^.]+$/i) ? '-array' : '';
				let mock2200 = fileName.match(/(200|blank)\.[^.]+$/i) ? '-200' : '';
				let mock2Img = fileName.match(/(img|tinygif)\.[^.]+$/i) ? '-img' : '';
				URLRewrite.push(
						`${noteK}${ptn} - reject${mock2Dict}${mock2Array}${mock2200}${mock2Img}`
				);
				}else{
				z[y - 1]?.match(/^#/) && script.push(z[y - 1]);
		
		script.push(
			`${noteK}${scname} = type=http-request,pattern=${ptn},script-path=https://raw.githubusercontent.com/xream/scripts/main/surge/modules/echo-response/index.js,argument=type=text/json&url=${arg}`)
				}
				
			}else{
				others.push(x);
				}
	
}); //循环结束

script = (script[0] || '') && `${script.join("\n")}`;

URLRewrite = (URLRewrite[0] || '') && `${URLRewrite.join("\n")}`;

others = (others[0] || '') && `${others.join("\n\n")}`;
		
if (URLRewrite !== "" && others.match("[URL Rewrite]")){
	uHalf = others.split(/\[URL Rewrite\]/i)[0];
	lHalf = others.split(/\[URL Rewrite\]/i)[1];
	mods = `${uHalf}\n\n[URL Rewrite]\n\n${URLRewrite}\n\n${lHalf}`;
}else{if (URLRewrite != ""){
		mods = `${others}${URLRewrite}`
		
	}else{
		mods = `${others}`;
	}
	};
		
if (script !== "" && mods.match("[Script]")){
	uHalf = mods.split(/\[Script\]/i)[0];
	lHalf = mods.split(/\[Script\]/i)[1];
	mods = `${uHalf}\n\n[Script]\n\n${script}\n\n${lHalf}`;
}else{if (script != ""){
		mods = `${mods}${script}`
		
	}else{
		mods = `${mods}`;
	}
	};


body = `${mods}`
		.replace(/t&zd;/g,',')
		.replace(/\[Map\x20?Local\]/gi,'')
		.replace(/undefined$/,'')
		.replace(/(#.+\n)\n+/g,'$1')
		.replace(/\n{2,}/g,'\n\n')

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