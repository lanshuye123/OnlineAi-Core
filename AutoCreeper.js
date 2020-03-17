"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Core = __importStar(require("./Core"));
exports.Creeper = ["Creeper?", "awwww man!", "So we back in the mine"];
var Creepering = 0;
Core.AddListener(function (c, info) {
    if (Creepering != 0) {
        var temp = true;
        if (info.message == exports.Creeper[Creepering]) {
            Core.frame.SendMsg(c, info, exports.Creeper[Creepering + 1]);
            Creepering = Creepering + 2;
            temp = false;
            if (Creepering > exports.Creeper.length) {
                Core.frame.SendMsg(c, info, "The End");
            }
        }
        if (temp) {
            Core.frame.SendMsg(c, info, "有人发送了一个与Creeper无关的消息，Creeper进度已终止!");
        }
    }
    if (info.message == exports.Creeper[0]) {
        Creepering = 1;
        Core.frame.SendMsg(c, info, exports.Creeper[1]);
    }
});
