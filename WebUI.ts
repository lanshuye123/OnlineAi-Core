import * as net from "net";
import * as Core from "./Core";
import * as fs from "fs";
var MainConnect:net.Socket;
var MainGroup:Core.InfoType;
var ServerWeb = new net.Server();
var MessageCount:Number = 0;
ServerWeb.on("listening",()=>{
	process.on("exit",()=>{
		ServerWeb.close();
	});
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
                        var T2:string[]|undefined[] = Token.split("_");
                        fs.readFile("./Message.json",(err,data)=>{
                            var data_obj = JSON.parse(data.toString());
                            T2[0] = decodeURIComponent(T2[0] as string);
                            if(T2[1]==""){
                                T2[1] = undefined;
                                data_obj[T2[0] as string] = undefined;
                            }else{
                                data_obj[T2[0] as string] = decodeURIComponent(T2[1] as string);
                            }
                            
                            fs.writeFile("./Message.json",JSON.stringify(data_obj),(err)=>{
                                UserSock.write(`HTTP/1.1 200 OK\r\nContent-Length: ${new String("DONE").length}\r\n\r\n`);
                                UserSock.write(new String("DONE").valueOf());
                                UserSock.end();
                            });
                        });
                    }else if(Do == "GETCOUNT"){
                        var ret = new String(MessageCount);
                        UserSock.write(`HTTP/1.1 200 OK\r\nContent-Length: ${new String(ret).length}\r\nContent-Type:text/html;charset=utf-8\r\n\r\n`)
                        UserSock.write(ret.valueOf());
                        UserSock.end();
                    }else if(Do == "RESTART"){
						var ret = new String("DOING!");
                        UserSock.write(`HTTP/1.1 200 OK\r\nContent-Length: ${new String(ret).length}\r\nContent-Type:text/html;charset=utf-8\r\n\r\n`)
                        UserSock.write(ret.valueOf());
                        UserSock.end();
						process.exit();
					}else if(Do == "GETSERVICES"){
						fs.readFile("./MoudelV2.json",(err2,data2)=>{
							var ret = data2;
							UserSock.write(`HTTP/1.1 200 OK\r\nContent-Length: ${ret.length}\r\nContent-Type:text/html;charset=utf-8\r\n\r\n`)
							UserSock.write(ret);
							UserSock.end();
						})
					}
                }else{
                    var data2:String ="404";
                    UserSock.write(`HTTP/1.1 404\r\nContent-Length: ${data2.length}\r\n\r\n`);
                    UserSock.write(data2.valueOf());
                    UserSock.end();
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
ServerWeb.listen(8081,"0.0.0.0");
Core.AddListener((connect:net.Socket,Info:Core.InfoType)=>{
    MessageCount = MessageCount.valueOf() + 1;
})