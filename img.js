"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Core = __importStar(require("./Core"));
const canvas = __importStar(require("canvas"));
const fs = __importStar(require("fs"));
const debug = require("./Debug");
const ds = require("desktop-screenshot");
const request = __importStar(require("request"));
(() => {
    var con = new canvas.Canvas(100, 100);
    var mai = con.getContext("2d");
    mai.fillStyle = "#ffffff";
    mai.fillRect(0, 0, 100, 100);
    mai.fillStyle = "#000000";
    mai.font = "24px '思源宋体'";
    // mai.fillText("天依没了",10,50);
    var Buf = con.toBuffer("image/png");
    fs.writeFile("D:\\APPS\\MIRAI\\plugins\\MiraiAPIHTTP\\images\\1.png", Buf, () => {
    });
    Core.AddListener((c, i) => {
        if (i.message == "图片测试") {
            Core.frame.SendImg(c, i, "1.png");
        }
        if (i.message == "屏幕截图" && debug.add.Interfaces.IsAdmin(Core.GetUser(i.user_id))) {
            ds("D:\\APPS\\MIRAI\\plugins\\MiraiAPIHTTP\\images\\Screen.png", (err, com) => {
                if (err) {
                    console.log(err);
                }
                else {
                    Core.frame.SendImg(c, i, "Screen.png");
                }
            });
        }
        if (i.message == "服务器IP") {
            if (debug.add.Interfaces.IsAdmin(Core.GetUser(i.user_id))) {
                request.get("http://api.ipify.org", (err, req) => {
                    Core.frame.SendMsg(c, i, req.body);
                });
            }
            else {
                request.get("http://api.ipify.org", (err, req) => {
                    var IP = req.body.split(".");
                    IP[2] = "*";
                    IP[3] = "*";
                    Core.frame.SendMsg(c, i, `${IP[0]}.${IP[1]}.${IP[2]}.${IP[3]}`);
                });
            }
        }
    });
})();
