"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
const 利刃 = __importStar(require("./Public"));
const Core = __importStar(require("./../Core"));
const Debug = require("./../Debug");
Core.AddListener((Connect, Info) => {
    Info.Core = Core;
    if (Info.message == "更新利刃" && Debug.add.Interfaces.IsAdmin(Info.user_id)) {
        利刃.更新API();
        Core.frame.SendMsg(Connect, Info, "[利刃后端]更新成功!");
    }
    if (Info.message.substr(0, 4) == "利刃执行") {
        if (!(Debug.add.Interfaces.IsAdmin(Info.user_id))) {
            Core.frame.SendMsg(Connect, Info, "只有Ai管理员才有权使用本指令");
            return;
        }
        var Command = Info.message.replace("利刃执行", "").replace(/&#91;/g, "[").replace(/&#93;/g, "]");
        Core.frame.SendMsg(Connect, Info, 利刃.解析(Command, Info));
    }
    var 利刃Ret = 利刃.核心(Info);
    if (利刃Ret != "") {
        Core.frame.SendMsg(Connect, Info, 利刃Ret);
    }
});
