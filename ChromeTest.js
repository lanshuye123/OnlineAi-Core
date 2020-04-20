"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
//Red Alert For OnlineAi Core
const Core = __importStar(require("./Core"));
var CrossGroup = [];
Core.AddListener((connect, info) => {
    console.log(CrossGroup);
    console.log(info);
    if (info.group_id == undefined) {
        return;
    }
    ;
    if (info.message == "abcde") {
        CrossGroup[CrossGroup.length] = info.group_id;
        Core.frame.SendMsg(connect, info, "已开启跨群");
    }
    ;
    var Root = info;
    if (true) {
        CrossGroup.forEach((value, index) => {
            if (value != info.group_id && value != 0) {
                Root.group_id = value;
                Core.frame.SendMsg(connect, Root, `本消息来自群${info.group_id}的${info.user_id}:${info.message}。\\r\\nAi仅供传达。`);
            }
        });
    }
});
