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
var MainConnect;
var MainGroup;
var ServerWeb = new net.Server();
ServerWeb.listen(8081, "0.0.0.0", function () {
    ServerWeb.on("connection", function (UserSock) {
        UserSock.on("data", function (data) {
            if (MainConnect != undefined) {
                Core.frame.SendMsg(MainConnect, MainGroup, data.toString());
            }
            UserSock.end();
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
