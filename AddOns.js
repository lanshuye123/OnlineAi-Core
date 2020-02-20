//这是插件系统的支持库
//作者:蓝树叶
const Core = require("./Core");
const fs = require("fs");
exports.add = {
    Interfaces:{
        GetAddons:function(message){
            var msg = new String(message);
            var data = new Object(JSON.parse(fs.readFileSync("./Addons/List.json").toString()));
            var keys = Object.keys(data);
            for(var i=0;i<keys.length;i++){
                if(msg.substr(0,keys[i].length) == keys[i]){
                    Core.frame.SetHOOK(true);
                    return [new String(data[keys[i]]),msg.substr(keys[i].length,msg.length - keys[i].length)];
                }
            }
            return ["void.js",""];
        }
    },
    Control:function(connect,info){
        var s = exports.add.Interfaces.GetAddons(info["message"]);
        console.log(s);
        console.log(`./Addons/${s[0]}`);
        try{
            require(`./Addons/${s[0]}`).add.Control(connect,s[1],Core.GetUser(info["user_id"]),info);
        }catch(err){
            console.log(err);
            Core.frame.SendMsg(connect,info,err);
        }
        if(new String(info["message"]).substr(0,4)=="斗罗大陆"){
            Core.frame.SetHOOK(true);
        }

    }
}