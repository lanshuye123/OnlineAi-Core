const https = require('http');
const Core = require("./Core");
const request = require('request');

const crypto = require('crypto');
const md5 = crypto.createHash('md5');
//const iconv = require('iconv-lite');
var ret = "";
const R = "_";
exports.add={
    Interfaces:{
        GetAITalk:function(user){
            if(Core.frame.ReadSystemConfig("AITalk")[user] != true){
                return false;
            }else{
                return true;
            }
        }
    },
    Control:function(connect,info){
        console.log(Core.HOOK);
        var message0 = new String(info["message"]);
        if(message0 == "智能聊天"){
            if(!exports.add.Interfaces.GetAITalk("Core")){
                Core.frame.SendMsg(connect,info,"请联系AI管理员(发送\"AI管理员\"查看)开启智能聊天功能。")
            }
            temp = Core.frame.ReadSystemConfig("AITalk");
            if(exports.add.Interfaces.GetAITalk(Core.GetUser(info["user_id"]))){
                Core.frame.SendMsg(connect,info,`${Core.frame.At(Core.GetUser(info["user_id"]))},我们不是一直在聊吗?`)
            }else{
                Core.frame.SendMsg(connect,info,`${Core.frame.At(Core.GetUser(info["user_id"]))},现在你已经开启智能聊天了。`)
            }
            temp[Core.GetUser(info["user_id"])] = true;
            Core.frame.WriteSystemConfig("AITalk",temp);
        }

        if(message0 == "停止聊天"){
            if(!exports.add.Interfaces.GetAITalk("Core")){
                Core.frame.SendMsg(connect,info,"请联系AI管理员(发送\"AI管理员\"查看)开启智能聊天功能。")
            }
            temp = Core.frame.ReadSystemConfig("AITalk");            
            if(exports.add.Interfaces.GetAITalk(Core.GetUser(info["user_id"]))){
                Core.frame.SendMsg(connect,info,`${Core.frame.At(Core.GetUser(info["user_id"]))},哼，不理你了。`)
            }else{
                Core.frame.SendMsg(connect,info,`${Core.frame.At(Core.GetUser(info["user_id"]))},谁愿意和你聊啊!`)
            }
            temp[Core.GetUser(info["user_id"])] = false;
            Core.frame.WriteSystemConfig("AITalk",temp);
        }
        info["message"] = info["message"].replace("[CQ:at,qq=2142562417]","");

        if(info["message"].indexOf("[CQ:at,qq=")!=-1){
            return;
        }
        if(Core.HOOK == true){
            return;
        }
        if(!exports.add.Interfaces.GetAITalk(Core.GetUser(info["user_id"]))&&info["raw_message"].indexOf("[CQ:at,qq=2142562417]")==-1){
            return;
        }

        const https = require('http');
        //const Core = require("./Core");
        const request = require('request');            
        const crypto = require('crypto');
        const md5 = crypto.createHash('md5');            
        var kee =  new String(info["message"]);

        for(;kee.indexOf("?")!=-1;){
            kee = kee.replace("?","？");
        }
        for(;kee.indexOf("!")!=-1;){
            kee = kee.replace("!","！");
        }
        for(;kee.indexOf(" ")!=-1;){
            kee = kee.replace(" ","　");
        }
        var params = new Object({
            app_id:"2125346185",
            time_stamp: Date.parse(new Date())/1000,
            "nonce\_str":new String("A"+Math.floor(Math.random() * 100000000)),
            session:Core.GetUser(info["user_id"]),
            question:kee
        });
        var key = "T6zpC15OkWJ9jP0a";
        var p2 = new Object();
        var k = Object.keys(params).sort();
        for(var i = 0;i<k.length;i++){
            p2[k[i]] = params[k[i]];
        }
        var Str="";
        for(var i = 0;i<k.length;i++){
            Str=Str+Object.keys(p2)[i]+"="+encodeURI(Object.values(p2)[i])+"&";
        }            
        Str = Str+"app_key="+key;
        sign = md5.update(Str).digest("hex").toUpperCase();
        params["sign"] = sign;

        (()=>{
            request.get({
                url:`https://api.ai.qq.com/fcgi-bin/nlp/nlp_textchat?${Str}&sign=${sign}`,
                encoding:'utf8'
            },(err,req,body)=>{
                if(req.statusCode==200){
                    console.log(body);
                    var an = JSON.parse(body)["data"]["answer"];
                    an = an.replace(/呵/g,"").replace(/哈/g,"").replace(/吧/g,"").replace(/哦/g,"");
                    Core.frame._SendMsg(connect,info,an);
                }
            });
        })();
    }
}
/*
                    https.get(`http://api.qingyunke.com/api.php?key=free&appid=0&msg=${encodeURI(message0)}`,(resp) => {
                        let data = '';
                        resp.on('data', (chunk) => {
                            data += chunk;
                        }); 
                        resp.on('end', () => {
                            console.log(data);
                            if(data.substr(0,1)!="{"){
                                Core.frame.SendMsg(connect,info,ret);
                                return;
                            }
                            var ret = new String(JSON.parse(data).content);
                            for(;ret.match("{br}")!=null;){
                                ret = ret.replace("{br}","\\r\\n");
                            }
                            console.log(ret);
                            Core.frame.SendMsg(connect,info,ret)
                        });
                    }).on("error", (err) => {
                        console.log("Error: " + err.message);
                    });   
*///这个是未经测试的版本

/*Yige.ai暂停运营
*request.post({
            url:'http://www.yige.ai/v1/query',
            form:{
                token:"ED1A14F0606567943CC354351A9E6B0E",
                query:info["message"],
                session_id:Core.GetUser(info["user_id"])
            },
            encoding:'utf8'
        },function(error,response,body){
            if(response.statusCode == 200){
                console.log(body);
                var ret = JSON.parse(body).answer;
                if(ret != "[ERROR]无回复"){
                    Core.frame._SendMsg(connect,info,ret);
                }else{
                    
        });
 * 
 */