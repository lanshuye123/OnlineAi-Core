import * as net from "net";
import * as Core from "./Core";

var MainConnect:net.Socket;
var MainGroup:Core.InfoType;
var ServerWeb = new net.Server();
ServerWeb.listen(8081,"0.0.0.0",()=>{
    ServerWeb.on("connection",(UserSock)=>{
        UserSock.on("data",(data)=>{
            if(MainConnect!=undefined){
                Core.frame.SendMsg(MainConnect,MainGroup,data.toString());
            }
            UserSock.end();
        });
        UserSock.on("close",()=>{
            UserSock.end();
        });
        UserSock.on("end",()=>{
            UserSock.end();
        })
    });
});
exports.add = {
    Interfaces:{

    },
    Control:((connect:net.Socket,Info:Core.InfoType)=>{
        if(Info.message.substr(0,4)=="设置监听"){
            MainConnect = connect;
            MainGroup = Info;
            Core.frame.SendMsg(connect,Info,"监听设置完毕!");
        }
    })
}