/*
#!name=TFT云顶攻略助手去广告
#!desc=移除烦人的广告

[Script]

http-response ^http:\/\/jcc\.tftplay\.com\/config\/info\/ requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/chengkongyiban/shadowrocket/main/scripts/TFT_Remove_ads.js

*/

if ($response.body) {
  
  qqq = JSON.parse($response.body);
  delete qqq.data.tipsV2;
  delete qqq.data.adTypeShow;
  qqq.data.userResult.user.vip = "true";
  qqq.data.userResult.user.level = "100";
  qqq.data.payShow = "0";
  qqq.data.payStatus = "true";
  
    $done({
        body: JSON.stringify(qqq)
    });
} else {
    $done({});
}
