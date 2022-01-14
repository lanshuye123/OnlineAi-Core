const Key = "ONLINEAICORE";
const request = require("request");
const Core = require("./Core");
const net = require("net");
const ServicePort = 8092;
var HOOK = false;
var Session = "";
console.log("["+new Date().toString()+"][./Core.js]服务器已启动");
global.DEBUG = {};
global.DEBUG.Core = Core;
var last = {};
request.post({
    url:`http://127.0.0.1:${ServicePort}/verify`,
    body:JSON.stringify({verifyKey:Key})
},(err,res)=>{
    if(res == null){
        console.log("["+new Date().toString()+"][./Core.js]系统断线.");
        return;
    }
    Session = JSON.parse(res.body).session;
    request.post({
        url:`http://127.0.0.1:${ServicePort}/bind`,
        body:JSON.stringify({
            sessionKey:Session,
            qq:2142562417
        })
    },(err2,res2)=>{
        console.log("["+new Date().toString()+"][./Core.js]Session激活成功.");
        console.log(Session);
        exports.HOOK = HOOK;
        exports.frame={

            SendImg: function(c,info,p){
                this.SetHook(true);

                if(info.group != undefined){
                    var Kdata = JSON.stringify({
                        sessionKey:Session,
                        group:info.group_id,
                        messageChain:[{
                            type:"Image",
                            path:p
                        }]
                    });
                }else{
                    var Kdata = JSON.stringify({
                        sessionKey:Session,
                        qq:info.user_id,
                        messageChain:[{
                            type:"Image",
                            path:p
                        }]
                    });
                }
                var BData = Buffer.from(Kdata);
                var Ret = "";
                var To = "Friend";
                if(info.group != undefined){
                    To = "Group"
                }
                var Req = new net.Socket();
                console.log(Kdata);
                console.log(Kdata);
                var MainData = `POST /send${To}Message HTTP/1.1\r\nHost: 127.0.0.1:${ServicePort}\r\nContent-Type: application/json; charset=UTF-8;\r\nContent-Length:${BData.length}\r\n\r\n`;
                Req.connect(ServicePort,"127.0.0.1",()=>{
                    Req.write(MainData);
                    Req.write(BData);
                    Req.on("data",(data)=>{
                        console.log(data.toString());
                    });
                    Req.on("end",()=>{
                        Req.end();
                    });
                    Req.on("close",()=>{
                        Req.end();
                    })
                });
            },

            SendURLImg: function(c,info,p){
                this.SetHook(true);

                if(info.group != undefined){
                    var Kdata = JSON.stringify({
                        sessionKey:Session,
                        group:info.group_id,
                        messageChain:[{"type":"Plain","text":`IMG`},{
                            type:"Image",
                            url:p
                        }]
                    });
                }else{
                    var Kdata = JSON.stringify({
                        sessionKey:Session,
                        qq:info.user_id,
                        messageChain:[{"type":"Plain","text":`IMG`},{
                            type:"Image",
                            url:p
                        }]
                    });
                }
                var BData = Buffer.from(Kdata);
                var Ret = "";
                var To = "Friend";
                if(info.group != undefined){
                    To = "Group"
                }
                var Req = new net.Socket();
                console.log(Kdata);
                console.log(Kdata);
                var MainData = `POST /send${To}Message HTTP/1.1\r\nHost: 127.0.0.1:${ServicePort}\r\nContent-Type: application/json; charset=UTF-8;\r\nContent-Length:${BData.length}\r\n\r\n`;
                Req.connect(ServicePort,"127.0.0.1",()=>{
                    Req.write(MainData);
                    Req.write(BData);
                    Req.on("data",(data)=>{
                        console.log(data.toString());
                    });
                    Req.on("end",()=>{
                        Req.end();
                    });
                    Req.on("close",()=>{
                        Req.end();
                    })
                });
            },

            SendMsg: function (connect, info, message) {
                
                this.SetHook(true);

                if(info.group != undefined){
                    var Kdata = JSON.stringify({
                        sessionKey:Session,
                        group:info.group_id,
                        messageChain:message
                    });
                }else{
                    var Kdata = JSON.stringify({
                        sessionKey:Session,
                        qq:info.user_id,
                        messageChain:message
                    });
                }
                var BData = Buffer.from(Kdata);
                var Ret = "";
                var To = "Friend";
                if(info.group != undefined){
                    To = "Group"
                }
                var Req = new net.Socket();
                console.log(Kdata);
                console.log(Kdata);
                var MainData = `POST /send${To}Message HTTP/1.1\r\nHost: 127.0.0.1:${ServicePort}\r\nContent-Type: application/json; charset=UTF-8;\r\nContent-Length:${BData.length}\r\n\r\n`;
                Req.connect(ServicePort,"127.0.0.1",()=>{
                    Req.write(MainData);
                    Req.write(BData);
                    Req.on("data",(data)=>{
                        console.log(data.toString());
                    });
                    Req.on("end",()=>{
                        Req.end();
                    });
                    Req.on("close",()=>{
                        Req.end();
                    })
                });
            },
            SetHook:function(value){
                exports.HOOK = value;
            }
        }
        setInterval(()=>{
            if(Session == ""){return}
            request.get({
                url:`http://127.0.0.1:${ServicePort}/fetchLatestMessage?sessionKey=${Session}&count=1`
            },(err,data)=>{
                if(data == null || data == undefined){return}
                if(data.body.toString().substr(0,1)!="{"){return;}
                var MainData = JSON.parse(data.body);
                if(MainData == null || MainData == undefined){return};
                if(MainData.data == null||MainData.data == undefined){return};
                var data_obj = MainData.data[0];
                if(data_obj == last){
                    return
                }else{
                    Core.frame.CGI("",data_obj);
                    last = data_obj;
                }
            });
        },50);
    });
});
