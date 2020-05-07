const Key = "ONLINEAICORE";
const iconv = require("iconv-lite");
const request = require("request");
const Core = require("./Core");
const net = require("net");
const zlib = require("zlib");
var HOOK = false;
var Session = "";
console.log("["+new Date().toString()+"][./Core.js]服务器已启动");
var last = {};
// var hs = new http.Server();
request.post({
    url:"http://127.0.0.1:8080/auth",
    body:JSON.stringify({authKey:Key})
},(err,res)=>{
    if(res == null){
        console.log("["+new Date().toString()+"][./Core.js]系统断线.");
        process.exit(-1);
    }
    var Session = JSON.parse(res.body).session;
    request.post({
        url:"http://127.0.0.1:8080/verify",
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
                var MainData = `POST /send${To}Message HTTP/1.1\r\nHost: 127.0.0.1:8080\r\nContent-Type: application/json; charset=UTF-8;\r\nContent-Length:${BData.length}\r\n\r\n`;
                Req.connect(8080,"127.0.0.1",()=>{
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
                var MainData = `POST /send${To}Message HTTP/1.1\r\nHost: 127.0.0.1:8080\r\nContent-Type: application/json; charset=UTF-8;\r\nContent-Length:${BData.length}\r\n\r\n`;
                Req.connect(8080,"127.0.0.1",()=>{
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
                // var Req = http.request({
                //     method:"POST",
                //     hostname:"127.0.0.1",
                //     port:8080,
                //     path:`/send${To}Message`
                // },(res)=>{
                //     Req.socket.setDefaultEncoding("utf-8");
                //     Req.write(Kdata);
                //     Req.end();
                //     console.log(res.headers);
                //     res.on("data",(chunk)=>{
                //         Ret = Ret + chunk;
                //     });
                //     res.on("end",()=>{
                //         console.log(Ret);
                //     })
                // });
                // console.log(m); 
            },
            SetHook:function(value){
                exports.HOOK = value;
            }
        }
        setInterval(()=>{
            request.get({
                url:`http://127.0.0.1:8080/fetchLatestMessage?sessionKey=${Session}&count=1`
            },(err,data)=>{
                if(data == null || data == undefined){return}
                var data_obj = JSON.parse(data.body).data[0];
	//console.log(data_obj);
                if(data_obj == last){
                    return
                }else{
                    Core.frame.CGI("",data_obj);
                    last = data_obj;
                }
            });
        },50)
    })
});