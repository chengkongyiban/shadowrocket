/****************************

说明
   t&zd; = {  , }  花括号中的逗号

***************************/

let req = $request.url.replace(/sg$/,'')
let name = '#!name = ' + req.match(/.+\/(.+)\.(sgmodule|module|js)/)?.[1] || '无名';
let desc = '#!desc = ' + req.match(/.+\/(.+)\.(sgmodule|module|js)/)?.[1] || '无名';

!(async () => {
  let body = await http(req);

	body = body.match(/[^\n]+/g);
let plugin = [];
//let URLRewrite = [];
//let MITM = [];

body.forEach((x, y, z) => {
	x = x.replace(/^(#|;|\/\/)/gi,'#');
	let type = x.match(
		/\[Rewrite\]|^hostname\x20?=\x20?|^((?!\[Rewrite\]).)*$|^((?!^hostname).)*$/
	)?.[0];
	console.log(type)
	//判断注释
	
	if (x.match(/^[^#]/)){
	var noteK = "";
	}else{
	var noteK = "#";
	};
	
	if (type) {
		switch (type) {
			
//Mock统统转reject，其他作用的Mock Loon无法实现

			case "[Rewrite]":
				
				plugin.push(
					x.replace(
						'[Rewrite]',
						'[URL Rewrite]'
					),
				);
				
				break;
				
			default:
			if (type.match(/^hostname\x20?=\x20?/)){
				plugin.push(x.replace(/hostname\x20?=\x20?(.+)/,'hostname = %APPEND% $1'))
			}else{
				plugin.push(x);
			}
				
				
		} //switch结束
	}
}); //循环结束

//script = (script[0] || '') && `[Script]\n${script.join("\n")}`;

//URLRewrite = (URLRewrite[0] || '') && `${URLRewrite.join("\n\n")}`;
//Rule = (Rule[0] || '') && `[Rule]\n${Rule.join("\n")}`;

//MITM = (MITM[0] || '') && `${MITM.join("\n\n")}`;
plugin = (plugin[0] || '') && `${plugin.join("\n\n")}`;

/*		
if (URLRewrite !== "" && others.match("[URL Rewrite]")){
	uHalf = others.split(/\[URL Rewrite\]/i)[0];
	lHalf = others.split(/\[URL Rewrite\]/i)[1];
	mods = `${uHalf}\n\n[URL Rewrite]\n${URLRewrite}\n${lHalf}`;
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

body = `${plugin}`
		.replace(/#(.+)\n/g,'#$1')
		.replace(/\n{2,}/g,'\n\n')
		.replace(/\x20{2,}/gi,' ')
		.replace(/"/g,'')

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
