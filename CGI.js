const ws = require("websocket");
const fs = require("fs");
const Core = require("./Core");
var HOOK = false;
console.log("["+new Date().toString()+"][./Core.js]服务器已启动");
var wss = new ws.client();
wss.connect("ws://127.0.0.1:6700");
global.ReConnect = (()=>{
    throw new Error("Reconnect");
})
wss.once("connectFailed",()=>{
    console.log("["+new Date().toString()+"][./Core.js]功能已断线。");
    process.exit(-1)
});
exports.HOOK = HOOK;
exports.frame={
    SendMsg:function(connect,info,message){
        this.SetHook(true);
        if(message == undefined||message == ""){
            this.SendMsg(connect,info,"[ERROR]Ai出现了一些问题。并没有接受到回复。")
            return;
        }
        /"/g.exec(message);
        message = message.replace(/"/g,`\\\"`);
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
    console.log("["+new Date().toString()+"][./Core.js]链接成功");
    exports.connect = connect;
    exports.frame.SetHook(false);
    exports.HOOK = HOOK;
    connect.on("message",(data)=>{
        if(JSON.parse(data.utf8Data)["post_type"]=="request"){//自动加好友
            var s = JSON.parse(data.utf8Data);
            console.log(data.utf8Data);
            if(s["request_type"]!="group"){
                connect.send(`{"action":"set_friend_add_request","params":{"flag":"${s["flag"]}","approve":true}}`)
            }else{
                connect.send(`{"action":"set_group_add_request","params":{"flag":"${s["flag"]}","sub_type":"${s["sub_type"]}","approve":true}}`)
            }
            return;
        }
        Core.frame.CGI(connect,JSON.parse(data.utf8Data));
    });
});