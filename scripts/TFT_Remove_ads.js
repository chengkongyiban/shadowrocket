/*
#!name=TFT云顶攻略助手去广告
#!desc=移除烦人的广告

[Script]

http-response ^http:\/\/jcc\.tftplay\.com\/config\/info\/ requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/chengkongyiban/shadowrocket/main/scripts/TFT_Remove_ads.js

*/

if ($response.body) {
	let qqq = JSON.parse($response.body);
if (/userResult/.test($response.body)) {
	
  delete qqq.data.tipsV2;
  delete qqq.data.adTypeShow;
  qqq.data.userResult.user.vip = "true";
  qqq.data.userResult.user.level = "100";
  qqq.data.payShow = "0";
  qqq.data.payStatus = "true";
  
}else{
  let gameVersion = qqq.data.gameVersion;
  
	qqq = {
  "code": 1,
  "message": "",
  "data": {
    "hiddenMission": "1",
    "gameVersion": gameVersion,
    "showTeamImport": "1",
    "expressionMsg": "{\"url\":\"https:\/\/pan.baidu.com\/s\/1qyWStu7eimThWa6vhcFm-w?pwd=8888\",\"password\":\"8888\"}",
    "cardChangeShow": "1",
    "iosPageRecovery2": "1",
    "iapWay": "1,2,3",
    "speedShow": "0",
    "traitOptionShow": "1",
    "hiddenJulong": "1",
    "payShow": "0",
    "exchangeImgs": "group14",
    "bannerConfig": "{\"imgUrl\":\"https:\/\/static.miplus.cloud\/tft\/img\/activity\/banner2107222.png\",\"type\":3}",
    "lotteryShow": "1",
    "price": "6",
    "userResult": {
      "user": {
        "id": 1001,
        "nickname": "大吉大利",
        "fansCount": 0,
        "attentionCount": 0,
        "headImgUrl": "http:\/\/static.miplus.cloud\/tft\/img\/upload\/231121\/041109d3c349a7-00cc-4295-b8bd-34257f291cb6.jpg",
        "vip": "true",
        "postCount": 0,
        "motto": "未登录账号",
        "level": "100"
      }
    },
    "showGameDownload": "1",
    "payStatus": "true"
  },
  "success": true
}

}
  
    $done({
        body: JSON.stringify(qqq)
    });
} else {
    $done({});
}
