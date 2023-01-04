/****************************
原脚本作者@小白脸 脚本修改@chengkongyiban
感谢@xream 的指导
说明
   t&zd; = {  , }  花括号中的逗号

***************************/
var name = "";
var desc = "";
let req = $request.url.replace(/sg.*/,'');
let urlArg = $request.url.replace(/.+sg(.*)/,'$1');

if (urlArg === ""){
	name = req.match(/.+\/(.+)\.(module|js|sgmodule)/)?.[1] || '无名';
    desc = req.match(/.+\/(.+)\.(module|js|sgmodule)/)?.[1] || '无名';
}else{
	if(urlArg.match("n=")){
		name = urlArg.split("n=")[1].split("&")[0];
	}else{
	name = req.match(/.+\/(.+)\.(module|js|sgmodule)/)?.[1] || '无名';
	}
	if(urlArg.match("d=")){
		desc = urlArg.split("d=")[1].split("&")[0];
	}else{
    desc = name;
	}
};
name = "#!name= " + decodeURIComponent(name);
desc = "#!desc= " + decodeURIComponent(desc);

!(async () => {
  let body = await http(req);

	body = body.match(/[^\n]+/g);
let uHalf = [];
let lHalf = [];	
let mods = [];
let others = [];
let URLRewrite = [];          //不支持的内容
//let MapLocal = [];
//let HeaderRewrite = [];

body.forEach((x, y, z) => {
	x = x.replace(/^(#|;|\/\/)/gi,'#');
	let type = x.match(
		/\x20data=|^((?!data=).)*$/
	)?.[0];
	
	//判断注释
	
	if (x.match(/^[^#]/)){
	var noteK = "";
	}else{
	var noteK = "#";
	};
	
	if (type) {
		switch (type) {
			
//Mock统统转reject

			case " data=":
				z[y - 1]?.match("#") && URLRewrite.push(z[y - 1]);
				
				let mock2Dict = x.match('dict') ? '-dict' : '';
				let mock2Array = x.match('array') ? '-array' : '';
				let mock2200 = x.match('200') ? '-200' : '';
				let mock2Img = x.match('(img|png|gif)') ? '-img' : '';
				let mock2Other = x.match('dict|array|200|img|png|gif') ? '' : '-200';
				URLRewrite.push(
					x.replace(
						/(#)?(.+)data=.+/,
						`${noteK}$2- reject${mock2Dict}${mock2Array}${mock2200}${mock2Img}${mock2Other}`
					),
				);
				
				break;
				
			default:
			
				others.push(x);
				
		} //switch结束
	}
}); //循环结束

//script = (script[0] || '') && `[Script]\n${script.join("\n")}`;

URLRewrite = (URLRewrite[0] || '') && `${URLRewrite.join("\n")}`;
//Rule = (Rule[0] || '') && `[Rule]\n${Rule.join("\n")}`;

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
/********
HeaderRewrite = (HeaderRewrite[0] || '') && `[Header Rewrite]\n${HeaderRewrite.join("\n")}`;

MapLocal = (MapLocal[0] || '') && `[MapLocal]\n${MapLocal.join("\n")}`;
********/

body = `${mods}`
		.replace(/t&zd;/g,',')
		.replace(/"/g,'')
		.replace(/\[Map\x20?Local\]/gi,'')
		.replace(/undefined$/,'')
		.replace(/(#.+\n)\n/g,'$1')
		.replace(/\n{2,}/g,'\n\n')

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