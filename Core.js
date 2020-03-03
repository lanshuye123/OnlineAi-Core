const JSCGI = require("./CGI");
const fs = require("fs");
var package = ["./Debug.js","./Money.js","./RedPacket.js","./抢劫.js","./公会系统.js","./AutoCreeper.js","./Frame.js","./AddOns.js","./板砖.js","./DocMaker.js","./狗屁不通文章生成器.js","./WebUI.js"];
//var HOOK = false;
exports.GetUser=function(user_id){
    if(!fs.existsSync("./cname.json")){
        fs.writeFile("./cname.json",JSON.stringify({}),(err)=>{
            console.log(`[${new Date().toString()}][Core.js]cname.json初始化完成!`);
        });
        return user_id;
    }
    var data = JSON.parse(fs.readFileSync("./cname.json").toString());
    if(data[user_id]!=undefined){
        return data[user_id];
    }else{
        return user_id;
    }
};
exports.HOOK = JSCGI.HOOK;
exports.frame={
    __Ban:function(connect,group,someone,time){
        connect.send(`{"action":"set_group_ban","params":{"group_id":"${group}","user_id":"${someone}","duration":${time}}}`);
    },
    _Ban:function(connect,info,user,time){
        this.__Ban(connect,info["group_id"],user,time);
    },
    Ban:function(connect,info,time){
        this._Ban(connect,info,info["user_id"],time);
    },
    SetHOOK:function(value){
        JSCGI.frame.SetHook(value);
        exports.HOOK = JSCGI.HOOK;
    },
    SendMsg:function(connect,info,message){
        this.SetHOOK(true);
        if(message==undefined){
            return;
        }
        JSCGI.frame.SendMsg(connect,info,message);
    },
    _SendMsg:function(connect,info,message){
        this.SendMsg(connect,info,message);
    },
    At:function(user_id){
        return "[CQ:at,qq="+user_id+"]";
    },
    ReadSystemConfig(Name){
        var temp = JSON.parse(fs.readFileSync("UserDataBase.json").toString())
        if(temp[Name]==undefined){
            return {};
        }else{
            return temp[Name];
        }
    },
    WriteSystemConfig(Name,Value){
        var Data = JSON.parse(fs.readFileSync("UserDataBase.json").toString());
        Data[Name] = Value;
        //console.log(Data);
        fs.writeFileSync("UserDataBase.json",JSON.stringify(Data));
        return 0;
    },

    CGI:function(connect,info){
        console.log("["+new Date().toString()+"][./Core.js]收到新消息");
        exports.HOOK = JSCGI.HOOK;
        exports.frame.SetHOOK(false);
        exports.HOOK = false;
        if(info.message==undefined){
            return;
        }
        try{
            for(var i=0;i<package.length;i++){
                console.log(`[${new Date().toString()}][${package[i]}]正在处理`);
                require(package[i]).add.Control(connect,info);
                console.log(`[${new Date().toString()}][${package[i]}]处理完成`);
            }
            if(require("./AI.js").add.Interfaces.GetAITalk("Core")){
                require("./AI.js").add.Control(connect,info);
            }
        }catch(error){
            exports.frame.SendMsg(connect,info,error);
            console.log(error);
        };
        console.log("["+new Date().toString()+"][./Core.js]线程处理完毕\r\n");
    }
}