//const https = require('http');
const request = require('request');
const crypto = require('crypto');
const md5 = crypto.createHash('md5');

var params = new Object({
    app_id:"2125346185",//APPID
    time_stamp: Date.parse(new Date())/1000,//时间戳
    "nonce\_str":new String("A"+Math.floor(Math.random() * 100000000)),//随机文本
    session:"927980270",//测试环境下账号伪造
    question:"你好呀"//测试环境下内容伪造
});
console.log(params);
var key = "T6zpC15OkWJ9jP0a";//APP Key
var p2 = new Object();
var k = Object.keys(params).sort();
console.log(k)
for(var i = 0;i<k.length;i++){
    p2[k[i]] = params[k[i]];
}
console.log(p2)
var Str="";
for(var i = 0;i<k.length;i++){
    Str=Str+Object.keys(p2)[i]+"="+encodeURI(Object.values(p2)[i])+"&";
}

Str = Str+"app_key="+key;
console.log(Str)
sign = md5.update(Str).digest("hex").toUpperCase();
console.log(sign)
params["sign"] = sign;

request.get({
    url:`https://api.ai.qq.com/fcgi-bin/nlp/nlp_textchat?${Str}&sign=${sign}`,
    encoding:'utf8'
},(err,req,body)=>{
    if(req.statusCode==200){
        console.log(body);
        var an = JSON.parse(body)["data"]["answer"];
        console.log(an);
    }
})