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
var MainConnect;
var MainGroup;
var ServerWeb = new net.Server();
ServerWeb.listen(8081, "0.0.0.0", function () {
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
                            data_obj[T2[1]] = T2[0];
                            fs.writeFile("./Message.json", JSON.stringify(data_obj), function (err) {
                                UserSock.write("HTTP/1.1 200 OK\r\nContent-Length: " + new String("DONE").length + "\r\n\r\n");
                                UserSock.write(new String("DONE").valueOf());
                                UserSock.end();
                            });
                        });
                    }
                }
                else {
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
        if (Info.message.substr(0, 4) == "设置监听") {
            MainConnect = connect;
            MainGroup = Info;
            Core.frame.SendMsg(connect, Info, "监听设置完毕!");
        }
    })
};
