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
var Core = __importStar(require("./Core"));
var CrossGroup = [];
Core.AddListener(function (connect, info) {
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
        CrossGroup.forEach(function (value, index) {
            if (value != info.group_id && value != 0) {
                Root.group_id = value;
                Core.frame.SendMsg(connect, Root, "\u672C\u6D88\u606F\u6765\u81EA\u7FA4" + info.group_id + "\u7684" + info.user_id + ":" + info.message + "\u3002\\r\\nAi\u4EC5\u4F9B\u4F20\u8FBE\u3002");
            }
        });
    }
});
