"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var 利刃 = __importStar(require("./Public"));
var Core = __importStar(require("./../Core"));
var Debug = require("./../Debug");
Core.AddListener(function (Connect, Info) {
    if (Info.message == "更新利刃" && Debug.add.Interfaces.IsAdmin(Info.user_id)) {
        利刃.更新API();
        Core.frame.SendMsg(Connect, Info, "[利刃后端]更新成功!");
    }
    var 利刃Ret = 利刃.核心(Info);
    if (利刃Ret != "") {
        Core.frame.SendMsg(Connect, Info, 利刃Ret);
    }
});
