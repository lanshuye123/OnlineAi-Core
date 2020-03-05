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
var MessageCount = 0;
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
                    else if (Do == "GETCOUNT") {
                        var ret = new String(MessageCount);
                        UserSock.write("HTTP/1.1 200 OK\r\nContent-Length: " + new String(ret).length + "\r\nContent-Type:text/html;charset=utf-8\r\n\r\n");
                        UserSock.write(ret.valueOf());
                        UserSock.end();
                    }
                    else if (Do == "RESTART") {
                        var ret = new String("DOING!");
                        UserSock.write("HTTP/1.1 200 OK\r\nContent-Length: " + new String(ret).length + "\r\nContent-Type:text/html;charset=utf-8\r\n\r\n");
                        UserSock.write(ret.valueOf());
                        UserSock.end();
                        process.exit();
                    }
                    else if (Do == "GETSERVICES") {
                        fs.readFile("./MoudelV2.json", function (err2, data2) {
                            var data2_obj = new Object(JSON.parse(data2.toString()));
                            var ret = new String(JSON.stringify(Object.keys(data2_obj)));
                            UserSock.write("HTTP/1.1 200 OK\r\nContent-Length: " + new String(ret).length + "\r\nContent-Type:text/html;charset=utf-8\r\n\r\n");
                            UserSock.write(ret.valueOf());
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
ServerWeb.listen(8081, "0.0.0.0");
Core.AddListener(function (connect, Info) {
    MessageCount = MessageCount.valueOf() + 1;
});
