const ws = require("websocket");
const fs = require("fs");
const Core = require("./Core");
var wss = new ws.client();
var HOOK = false;
wss.connect("ws://127.0.0.1:6700/");
console.log("["+new Date().toString()+"][./Core.js]服务器已启动\r\n");
exports.HOOK = HOOK;
exports.frame={
    SendMsg:function(connect,info,message){
        this.SetHook(true);
        if(message == undefined||message == ""){
            this.SendMsg(connect,info,"[ERROR]Ai出现了一些问题。并没有接受到回复。")
            return;
        }
        if(info["message_type"]=="group"){
            var m = `{"action":"send_group_msg","params":{"group_id":`+info["group_id"]+`,"message":"`+message+`"}}`;
        }else if(info["message_type"]=="private"){
            var m = `{"action":"send_private_msg","params":{"user_id":`+info["user_id"]+`,"message":"`+message+`"}}`
        }
        console.log(m);
        connect.send(m);
    },
    SetHook:function(value){
        exports.HOOK = value;
    }
}
wss.on("connect",(connect)=>{
    exports.connect = connect;
    exports.frame.SetHook(false);
    exports.HOOK = HOOK;
    connect.on("message",(data)=>{
        Core.frame.CGI(connect,JSON.parse(data.utf8Data));
    });
});