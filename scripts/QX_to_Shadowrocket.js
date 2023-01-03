/*
原作者@小白脸
使用方法 在qx重写链接末尾加上qx
[Script]
QX转换 = type=http-request,pattern=qx$,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/chengkongyiban/shadowrocket/main/scripts/QX_to_Shadowrocket.js

[MITM]
hostname = %APPEND% github.com:443, raw.githubusercontent.com:443
*/
let req = $request.url.replace(/qx$/,'')
let name = '#!name= ' + req.match(/.+\/(.+)\.(conf|js|snippet|txt)/)?.[1] || '无名';
let desc = '#!desc= ' + req.match(/.+\/(.+)\.(conf|js|snippet|txt)/)?.[1] || '无名';
!(async () => {
  let body = await http(req);

	body = body.match(/[^\n]+/g);
	
let script = [];
let URLRewrite = [];
let HeaderRewrite = [];
let MapLocal = [];
let MITM = "";

body.forEach((x, y, z) => {
	x = x.replace(/^(#|;|\/\/)/gi,'#');
	let type = x.match(
		/\x20url\x20script-|enabled=|\x20url\x20reject|\x20echo-response|\-header|^hostname| url 30|\x20(request|response)-body/
	)?.[0];
	
//判断注释
	if (x.match(/^[^#]/)){
	var noteK = "";
	}else{
	var noteK = "#";
	};
	
	if (type) {
		switch (type) {
//脚本			
			case " url script-":
				z[y - 1]?.match("#") && script.push(z[y - 1]);
				let sctype = x.match('script-response') ? 'response' : 'request';
				
				let rebody = x.match('-body|-analyze') ? ',requires-body=1' : '';
				
				let size = x.match('-body|-analyze') ? ',max-size=3145728' : '';
				
				let proto = x.match('proto.js') ? ',binary-body-mode=1' : '';
				
				let urlInNum = x.split(" ").indexOf("url");
				
				let ptn = x.split(" ")[urlInNum - 1].replace(/#/,"");
				
				let js = x.split(" ")[urlInNum + 2];
				
				let scname = js.substring(js.lastIndexOf('/') + 1, js.lastIndexOf('.') );
				script.push(
					x.replace(
						/.+script-.+/,
						`${noteK}${scname} = type=http-${sctype},pattern=${ptn}${rebody}${size}${proto},script-path=${js},script-update-interval=0`,
					),
				);
				break;
//定时任务
			case "enabled=":
				z[y - 1]?.match("#") && script.push(z[y - 1]);
				
				let cronExp = x.split(" http")[0].replace(/#/,'');
				
				let cronJs = x.split("://")[1].split(",")[0].replace(/(.+)/,'https://$1');
				
				let croName = x.split("tag=")[1].split(",")[0];
				
				script.push(
					x.replace(
						/.+enabled=.+/,
						`${noteK}${croName} = type=cron,script-path=${cronJs},timeout=60,cronexp=${cronExp},wake-system=1`,
					),
				);
				break;
//reject
			case " url reject":

				z[y - 1]?.match("#") && URLRewrite.push(z[y - 1]);
				URLRewrite.push(x.replace(/(#)?(.*?)\x20url\x20(reject-200|reject-img|reject-dict|reject-array|reject)/, `${noteK}$2 - $3`));
				break;
				
				
//headerRewrite，转的不对请赐教

			case "-header":
			if (x.match(/\(\\r\\n\)/g).length === 2){			
				z[y - 1]?.match("#") &&  URLRewrite.push(z[y - 1]);
let op = x.match(/\x20response-header/) ?
'http-response ' : '';
     if(x.match(/\$1\$2/)){
		  URLRewrite.push(x.replace(/(\^?http[^\s]+).+?n\)([^\:]+).+/,`${op}$1 header-del $2`))	
		}else{
				URLRewrite.push(
					x.replace(
						/(\^?http[^\s]+)[^\)]+\)([^:]+):([^\(]+).+\$1\x20?\2?\:?([^\$]+)?\$2/,
						`${op}$1 header-replace-regex $2 $3 $4''`,
					),
				);
				}
				}else{
					
				}
				break;

//Mock 火箭不支持，但是保留

			case " echo-response":
				z[y - 1]?.match("#") && MapLocal.push(z[y - 1]);
				MapLocal.push(x.replace(/(\^?http[^\s]+).+(http.+)/, '$1 data="$2"'));
				break;
				
//mitm				
				
			case "hostname":
				MITM = x.replace(/hostname\x20?=(.*)/, `[MITM]\n\nhostname = %APPEND% $1`).replace(/,$/,"");
				break;
				
//302/307						
			case " url 30":
					z[y - 1]?.match("#") && URLRewrite.push(z[y - 1]);
					URLRewrite.push(x.replace(/(#)?(.*?)\x20url\x20(302|307)\s(.+)/, `${noteK}$2 $4 $3`));
				
				break;
				
			default:
					
//带参数脚本argument					
					z[y - 1]?.match("#") && script.push(z[y - 1]);
					script.push(
						x.replace(
							/([^\s]+)\x20url\x20(response|request)-body\x20(.+)\2-body(.+)/,
							`test = type=$2,pattern=$1,requires-body=1,script-path=https://raw.githubusercontent.com/mieqq/mieqq/master/replace-body.js, argument=$3->$4`,
						),
					);
				
		} //switch结束
	}
}); //循环结束

script = (script[0] || '') && `[Script]\n\n${script.join("\n\n")}`;

URLRewrite = (URLRewrite[0] || '') && `[URL Rewrite]\n\n${URLRewrite.join("\n")}`;

//HeaderRewrite = (HeaderRewrite[0] || '') && `[Header Rewrite]\n\n${HeaderRewrite.join("\n")}`;

MapLocal = (MapLocal[0] || '') && `[Map Local]\n\n${MapLocal.join("\n\n")}`;

body = `${name}
${desc}


${URLRewrite}

${script}

${MapLocal}

${MITM}`
		.replace(/(#.+\n)\n/g,'$1')
		.replace(/\n{2,}/g,'\n\n')
		.replace(/t&zd;/g,',')
		.replace(/"{2,}/g,'"')
		.replace(/\x20{2,}/g,' ')



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