/*
#!name=TFT云顶攻略助手去广告
#!desc=移除烦人的广告


[Script]

http-response ^http:\/\/jcc\.tftplay\.com\/config\/info\/ requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/chengkongyiban/shadowrocket/main/scripts/TFT_Remove_ads.js

*/

if ($response.body) {
    $done({
        body: JSON.stringify({
  "code" : 1,
  "message" : "",
  "data" : {
    "bannerConfig" : "{\"imgUrl\":\"https://static.miplus.cloud/tft/img/activity/banner2107222.png\",\"type\":3}",
    "hiddenMission" : "1",
    "userResult" : {
      "user" : {
        "id" : 2139447,
        "nickname" : "马保国",
        "fansCount" : 0,
        "attentionCount" : 0,
        "headImgUrl" : "https://static.miplus.cloud/tft/img/avatar/322.png",
        "vip" : true,
        "postCount" : 0,
        "motto" : "闪电",
        "level" : 100
      }
    },
    "cardChangeShow" : "1",
    "gameVersion" : "13.23",
    "lotteryShow" : "1",
    "iosPageRecovery2" : "1",
    "version" : {
      "indexUpdate" : false,
      "indexDesc" : "新版本：\n1. 部分小功能优化\n2. 部分界面样式优化",
      "update" : false,
      "forceUpdate" : false,
      "desc" : "新版本：\n1. 部分小功能优化\n2. 部分界面样式优化",
      "downloadUrl" : "https://apps.apple.com/cn/app/id1554801875"
    },
    "payShow" : "1",
    "tipsV2" : "",
    "showTeamImport" : "1",
    "iapWay" : "1,2,3",
    "hiddenJulong" : "1",
    "showGameDownload" : "1",
    "traitOptionShow" : "1",
    "speedShow" : "0",
    "exchangeImgs" : "group14",
    "payStatus" : true,
    "price" : "6",
    "expressionMsg" : "{\"url\":\"https://pan.baidu.com/s/1qyWStu7eimThWa6vhcFm-w?pwd=8888\",\"password\":\"8888\"}",
    "adTypeShow" : ""
  },
  "success" : true
}
)
    });
} else {
    $done({});
}

