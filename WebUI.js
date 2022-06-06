"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const net = __importStar(require("net"));
const Core = __importStar(require("./Core"));
const fs = __importStar(require("fs"));
var MainConnect;
var MainGroup;
var ServerWeb = new net.Server();
var MessageCount = 0;
ServerWeb.on("listening", () => {
    process.on("exit", () => {
        ServerWeb.close();
    });
    ServerWeb.on("connection", (UserSock) => {
        UserSock.end("102");
        UserSock.on("data", (data) => {
            if (data.toString().indexOf(" ") != 0) {
                var path = data.toString().split(" ");
                if (path == undefined) {
                    return;
                }
                if (path[1] == "/") {
                    fs.readFile("./WebUI.html", (err, data) => {
                        UserSock.write(`HTTP/1.1 200 OK\r\nContent-Length: ${data.length}\r\n\r\n`);
                        UserSock.write(data);
                        UserSock.end();
                    });
                }
                else if (path[1].substr(0, 5) == "/OAC_") {
                    var Do = path[1].replace("/OAC_", "");
                    if (Do == "GETMESSAGE") {
                        fs.readFile("./Message.json", (err, data) => {
                            UserSock.write(`HTTP/1.1 200 OK\r\nContent-Length: ${data.length}\r\n\r\n`);
                            UserSock.write(data);
                            UserSock.end();
                        });
                    }
                    else if (Do.substr(0, new String("SETMESSAGE_").length) == "SETMESSAGE_") {
                        var Token = Do.replace("SETMESSAGE_", "");
                        var T2 = Token.split("_");
                        fs.readFile("./Message.json", (err, data) => {
                            var data_obj = JSON.parse(data.toString());
                            T2[0] = decodeURIComponent(T2[0]);
                            if (T2[1] == "") {
                                T2[1] = undefined;
                                data_obj[T2[0]] = undefined;
                            }
                            else {
                                data_obj[T2[0]] = decodeURIComponent(T2[1]);
                            }
                            fs.writeFile("./Message.json", JSON.stringify(data_obj), (err) => {
                                UserSock.write(`HTTP/1.1 200 OK\r\nContent-Length: ${new String("DONE").length}\r\n\r\n`);
                                UserSock.write(new String("DONE").valueOf());
                                UserSock.end();
                            });
                        });
                    }
                    else if (Do == "GETCOUNT") {
                        var ret = new String(MessageCount);
                        UserSock.write(`HTTP/1.1 200 OK\r\nContent-Length: ${new String(ret).length}\r\nContent-Type:text/html;charset=utf-8\r\n\r\n`);
                        UserSock.write(ret.valueOf());
                        UserSock.end();
                    }
                    else if (Do == "RESTART") {
                        var ret = new String("DOING!");
                        UserSock.write(`HTTP/1.1 200 OK\r\nContent-Length: ${new String(ret).length}\r\nContent-Type:text/html;charset=utf-8\r\n\r\n`);
                        UserSock.write(ret.valueOf());
                        UserSock.end();
                        process.exit();
                    }
                    else if (Do == "GETSERVICES") {
                        fs.readFile("./MoudelV2.json", (err2, data2) => {
                            var ret = data2;
                            UserSock.write(`HTTP/1.1 200 OK\r\nContent-Length: ${ret.length}\r\nContent-Type:text/html;charset=utf-8\r\n\r\n`);
                            UserSock.write(ret);
                            UserSock.end();
                        });
                    }
                }
                else {
                    var data2 = "404";
                    UserSock.write(`HTTP/1.1 404\r\nContent-Length: ${data2.length}\r\n\r\n`);
                    UserSock.write(data2.valueOf());
                    UserSock.end();
                }
            }
            else {
                UserSock.end("HTTP/1.1 404");
            }
        });
        UserSock.on("close", () => {
            UserSock.end();
        });
        UserSock.on("end", () => {
            UserSock.end();
        });
    });
});
ServerWeb.listen(8081, "127.0.0.1");
Core.AddListener((connect, Info) => {
    MessageCount = MessageCount.valueOf() + 1;
});
