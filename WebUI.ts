import * as net from "net";
import * as Core from "./Core";
import * as fs from "fs";

var MainConnect:net.Socket;
var MainGroup:Core.InfoType;
var ServerWeb = new net.Server();
ServerWeb.listen(8081,"0.0.0.0",()=>{
    ServerWeb.on("connection",(UserSock)=>{
        UserSock.on("data",(data)=>{
            if(data.toString().indexOf(" ")!=0){
                var path = data.toString().split(" ");
                if(path[1]=="/"){
                    fs.readFile("./WebUI.html",(err,data)=>{
                        UserSock.write(`HTTP/1.1 200 OK\r\nContent-Length: ${data.length}\r\n\r\n`);
                        UserSock.write(data);
                        UserSock.end();
                    });
                }else if(path[1].substr(0,5)=="/OAC_"){
                    var Do = path[1].replace("/OAC_","");
                    if(Do == "GETMESSAGE"){
                        fs.readFile("./Message.json",(err,data)=>{
                            UserSock.write(`HTTP/1.1 200 OK\r\nContent-Length: ${data.length}\r\n\r\n`);
                            UserSock.write(data);
                            UserSock.end();
                        });
                    }else if(Do.substr(0,new String("SETMESSAGE_").length) == "SETMESSAGE_"){
                        var Token = Do.replace("SETMESSAGE_","");
                        var T2 = Token.split("_");
                        fs.readFile("./Message.json",(err,data)=>{
                            var data_obj = JSON.parse(data.toString());
                            T2[0] = decodeURIComponent(T2[0]);
                            data_obj[T2[0]] = decodeURIComponent(T2[1]);
                            fs.writeFile("./Message.json",JSON.stringify(data_obj),(err)=>{
                                UserSock.write(`HTTP/1.1 200 OK\r\nContent-Length: ${new String("DONE").length}\r\n\r\n`);
                                UserSock.write(new String("DONE").valueOf());
                                UserSock.end();
                            });
                        });
                    }
                }else{

                }
            }else{
                UserSock.end("HTTP/1.1 404");
            }
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
        if(Info.message.substr(0,4)=="获取监听"){
            var temp;
            if(typeof ServerWeb.address() == null){
                temp = -1;
            }else{
                temp = (ServerWeb.address() as net.AddressInfo).port;
            }
            Core.frame.SendMsg(connect,Info,`0.0.0.0:${temp}`);
        }
    })
}