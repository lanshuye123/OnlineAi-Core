const JSCGI = require("./CGI");
const fs = require("fs");
const net = require("net");
var package = ["./Debug.js","./Money.js","./RedPacket.js","./抢劫.js","./公会系统.js","./Frame.js","./AddOns.js","./板砖.js","./DocMaker.js","./狗屁不通文章生成器.js"];
var LastMessage = {};
exports.LastMessage = LastMessage;
var Listeners = [];
exports.Listeners = Listeners
var At = [];
exports.ServicePort = 8092;
global.LoadMoudel = (() => {
    Listeners = [];
    fs.exists("./MoudelV2.json", (ex) => {
        if (ex) {
            fs.readFile("./MoudelV2.json", (err, data) => {
                var data_obj = new Object(JSON.parse(data.toString()));
                var k = Object.keys(data_obj);
                for (var i = 0; i < k.length; i++) {
                    if (data_obj[k[i]].Allow) {
                        console.log(`[${new Date().toString()}][${k[i]}]服务正在初始化!`);
                        if (data_obj[k[i]].FindIn == "fs" && fs.existsSync(require(process.cwd() + "/" + data_obj[k[i]].Path))) {
                            try{
                                require(process.cwd() + "/" + data_obj[k[i]].Path);
                            }catch(err){
                                var CommandReal = fs.readFileSync(process.cwd() + "/" + data_obj[k[i]].Path);
                                eval(CommandReal.toString());
                            }
                        }
                    }
                }
            });
        } else {
            fs.writeFile("./MoudelV2.json", JSON.stringify({}), (err) => { });
        }
    });
    fs.exists("./inside/",(isex)=>{
        if(isex){
            fs.readdir("./inside/",{},((err,fileList)=>{
                s = require;
                require = ((w)=>{if(w=="./Core"){return exports}else{return s(w)}})
                fileList.forEach(e => {
                    if(e.substr(-3,3)==".js"){
                        fs.readFile(`./inside/${e}`,{},(err,data)=>{
                            console.log(`[${new Date().toString()}][${e}]inside正在初始化!`);
                            eval(data.toString());
                        })
                    }
                });
            }))
        }
    })   
})
global.LoadMoudel();
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
exports.AddListener = ((callback)=>{
    Listeners[Listeners.length] = callback;
    console.log(`[${new Date().toString()}]新的服务注册。服务ID为${Listeners.length - 1}`);
    return (Listeners.length - 1);
});
exports.DelListener = ((callbackID)=>{
    Listeners[callbackID] = (()=>{});
})
class Config{
    constructor(value){
        this.value = value;
    }
    ReadValue(QQ){
        return this.value[QQ.valueOf()];
    }
    WriteValue(QQ,value){
        this.value[QQ.valueOf()] = value;
    }
    API_GET(){//旧版API
        return this.value;
    }
};
exports.frame={
    __Ban:function(connect,group,someone,time){
        // connect.send(`{"action":"set_group_ban","params":{"group_id":"${group}","user_id":"${someone}","duration":${time}}}`);
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
        var Zmessage = new String(message);
        if(Zmessage == undefined||Zmessage == ""){
            this.SendMsg(connect,info,"[ERROR]Ai出现了一些问题。并没有接受到回复。")
            return;
        }
        /"/g.exec(Zmessage);
        Zmessage = Zmessage.replace(/"/g,`\\\"`);
        if(message == undefined){
            return;
        }
        var rawMessage = [];
        if(info.group){
            var MessageData = Zmessage.split(/\[At\]/);
            var IndexAt = 0;
            MessageData.forEach((v,i)=>{
                if(v == ""){
                    v = " ";
                }
                rawMessage[rawMessage.length] = {
                    type:"Plain",
                    text:v
                };
                rawMessage[rawMessage.length] = {
                    type:"At",
                    target:new Number(At[IndexAt])
                }
                IndexAt = IndexAt + 1;
            });
            rawMessage = rawMessage.slice(0,rawMessage.length -1);
        }else{
            rawMessage = [{
                type:"Plain",
                text:Zmessage.replace(/\[At\]/g,"@User")
            }]
        }
        At = [];
        JSCGI.frame.SendMsg(connect,info,rawMessage);
    },
    _SendMsg:function(connect,info,message){
        this.SendMsg(connect,info,message);
    },
    At:function(user_id){
        At[At.length] = user_id;
        return "[At]";
        //  return `[${At.length}]`;
    },
    ReadSystemConfig(Name){
        var temp = JSON.parse(fs.readFileSync("UserDataBase.json").toString())
        if(temp[Name]==undefined||temp[Name]==null){
            return new Object();
        }else{
            return temp[Name];
        }
    },
    NReadSystemConfig(Name){
        var temp = JSON.parse(fs.readFileSync("UserDataBase.json").toString())
        if(temp[Name]==undefined||temp[Name]==null){
            return new Config(new Object());
        }else{
            return new Config(temp[Name]);
        }
    },
    WriteSystemConfig(Name,Value){
        var Data = JSON.parse(fs.readFileSync("UserDataBase.json").toString());
        Data[Name] = Value;
        //console.log(Data);
        fs.writeFileSync("UserDataBase.json",JSON.stringify(Data));
        return 0;
    },
    NWriteSystemConfig(Name,Value){
        var Data = JSON.parse(fs.readFileSync("UserDataBase.json").toString());
        Data[Name] = Value.API_GET();
        //console.log(Data);
        fs.writeFileSync("UserDataBase.json",JSON.stringify(Data));
        return 0;
    },

    SendImg(c,i,p){
        JSCGI.frame.SendImg(c,i,p);
    },

    SendURLImg(c,i,p){
        JSCGI.frame.SendURLImg(c,i,p);
    },

    GetAt:function(c,i){
        var At = "";
        i.messageChain.forEach(element => {
            if(element.type == "At"){
                At = element.target;
            }
        });
        return At;
    },

    
    CGI:function(connect,info){

        At = [];

        if(info == undefined){return};

        

        console.log("["+new Date().toString()+"][./Core.js]收到新消息");
        console.log(info);


        info.raw_message = "";
		
		if(info.messageChain == undefined){return}
		if(info.messageChain == []){return}
		
        info.messageChain.forEach(element => {
            if(element.type == "Plain"){
                info.raw_message = info.raw_message + element.text;
            }
        });
        info.message = info.raw_message;

        console.log(Buffer.from(info.message));

        info.user_id = info.sender.id;

        if(info.sender.group){
            console.log("isGroup!")
            info.group_id = info.sender.group.id;
            info.message_type = "group";
            info.group = info.sender.group;
        }

        if(info.group_id){

            if(info.message == "Ai服务状态"){
                exports.frame.SendMsg(connect,info,`当前,Ai在本群处于${exports.frame.ReadSystemConfig("AIEnable")[info.group_id] == true}状态`);
            }

            if(info.message == "授权启用Ai服务" &&( info.sender.role == "owner" || info.sender.role == "admin" || require("./Debug.js").add.Interfaces.IsAdmin(info.user_id))){
                var AEdata = exports.frame.ReadSystemConfig("AIEnable");
                AEdata[info.group_id] = true;
                exports.frame.WriteSystemConfig("AIEnable",AEdata);
                exports.frame.SendMsg(connect,info,"已启用Ai");
            }
            if(info.message == "逆向启用Ai服务" &&( info.sender.role == "owner" || info.sender.role == "admin" || require("./Debug.js").add.Interfaces.IsAdmin(info.user_id))){
                var AEdata = exports.frame.ReadSystemConfig("AIEnable");
                AEdata[info.group_id] = false;
                exports.frame.WriteSystemConfig("AIEnable",AEdata);
                exports.frame.SendMsg(connect,info,"已禁用Ai");
            }
            if(exports.frame.ReadSystemConfig("AIEnable")[info.group_id] != true){
                return;
            }
        }

        exports.HOOK = JSCGI.HOOK;
        exports.frame.SetHOOK(false);
        exports.HOOK = false;
        if(info.message==undefined){
            return;
        }
        if(LastMessage == info){
            return;
        }else{
            LastMessage = info;
        }

        try{
            for(var i=0;i<package.length;i++){
                console.log(`[${new Date().toString()}][${package[i]}]正在处理`);
                require(package[i]).add.Control(connect,info);
                console.log(`[${new Date().toString()}][${package[i]}]处理完成`);
            }
            for(var i=0;i<Listeners.length;i++){
                console.log(`[${new Date().toString()}]正在由服务解析消息。`);
                Listeners[i](connect,info);
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

global.DEBUG.CGI = JSCGI;
global.DEBUG.Debug = require("./Debug.js");