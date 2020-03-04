"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var net = __importStar(require("net"));
var Core = __importStar(require("./Core"));
var fs = __importStar(require("fs"));
var cp = __importStar(require("child_process"));
var MainConnect;
var MainGroup;
var ServerWeb = new net.Server();
ServerWeb.on("listening", function () {
    ServerWeb.on("connection", function (UserSock) {
        UserSock.on("data", function (data) {
            if (data.toString().indexOf(" ") != 0) {
                var path = data.toString().split(" ");
                if (path[1] == "/") {
                    fs.readFile("./WebUI.html", function (err, data) {
                        UserSock.write("HTTP/1.1 200 OK\r\nContent-Length: " + data.length + "\r\n\r\n");
                        UserSock.write(data);
                        UserSock.end();
                    });
                }
                else if (path[1].substr(0, 5) == "/OAC_") {
                    var Do = path[1].replace("/OAC_", "");
                    if (Do == "GETMESSAGE") {
                        fs.readFile("./Message.json", function (err, data) {
                            UserSock.write("HTTP/1.1 200 OK\r\nContent-Length: " + data.length + "\r\n\r\n");
                            UserSock.write(data);
                            UserSock.end();
                        });
                    }
                    else if (Do.substr(0, new String("SETMESSAGE_").length) == "SETMESSAGE_") {
                        var Token = Do.replace("SETMESSAGE_", "");
                        var T2 = Token.split("_");
                        fs.readFile("./Message.json", function (err, data) {
                            var data_obj = JSON.parse(data.toString());
                            T2[0] = decodeURIComponent(T2[0]);
                            data_obj[T2[0]] = decodeURIComponent(T2[1]);
                            fs.writeFile("./Message.json", JSON.stringify(data_obj), function (err) {
                                UserSock.write("HTTP/1.1 200 OK\r\nContent-Length: " + new String("DONE").length + "\r\n\r\n");
                                UserSock.write(new String("DONE").valueOf());
                                UserSock.end();
                            });
                        });
                    }
                    else if (Do.substr(0, new String("SENDJS_").length) == "SENDJS_") {
                        var Token = Do.replace("SENDJS_", "");
                        var ret = "";
                        cp.spawn(Token).on("message", function (mess) {
                            ret = ret + mess.toString();
                        }).on("exit", function (c, s) {
                            UserSock.write("HTTP/1.1 200 OK\r\nContent-Length: " + new String(ret).length + "\r\n\r\n");
                            UserSock.write(ret);
                            UserSock.end();
                        }).on("close", function (c, s) {
                            UserSock.write("HTTP/1.1 200 OK\r\nContent-Length: " + new String(ret).length + "\r\n\r\n");
                            UserSock.write(ret);
                            UserSock.end();
                        });
                    }
                }
                else {
                    var data2 = "404";
                    UserSock.write("HTTP/1.1 404\r\nContent-Length: " + data2.length + "\r\n\r\n");
                    UserSock.write(data2.valueOf());
                    UserSock.end();
                }
            }
            else {
                UserSock.end("HTTP/1.1 404");
            }
        });
        UserSock.on("close", function () {
            UserSock.end();
        });
        UserSock.on("end", function () {
            UserSock.end();
        });
    });
});
exports.add = {
    Interfaces: {},
    Control: (function (connect, Info) {
        if (Info.message.substr(0, 4) == "获取监听") {
            var temp;
            if (ServerWeb.address() == null) {
                temp = -1;
            }
            else {
                temp = ServerWeb.address().port;
            }
            Core.frame.SendMsg(connect, Info, "0.0.0.0:" + temp);
        }
        if (Info.message.substr(0, 4) == "开始监听") {
            ServerWeb.listen(Math.floor(65535 * Math.random()), "0.0.0.0");
            Core.frame.SendMsg(connect, Info, "\u76D1\u542C\u8BBE\u7F6E\u5B8C\u6BD5\uFF0C\u4F7F\u7528\u201C\u83B7\u53D6\u76D1\u542C\u201D\u6765\u83B7\u53D6\u7AEF\u53E3\u53F7");
        }
    })
};
