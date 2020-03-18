//Red Alert For OnlineAi Core
import * as Core from "./Core";
import * as fs from "fs";
var CrossGroup: Array<Number> = [];
Core.AddListener((connect, info) => {
    console.log(CrossGroup);
    console.log(info);
    if (info.group_id == undefined) {
        return;
    };
    if (info.message == "abcde") {
        CrossGroup[CrossGroup.length] = info.group_id as number;
        Core.frame.SendMsg(connect, info, "已开启跨群");
    };
    var Root = info;
    if (true) {
        CrossGroup.forEach((value, index) => {
            if (value != info.group_id as number && value != 0) {
                Root.group_id = value;
                Core.frame.SendMsg(connect, Root, `本消息来自群${info.group_id}的${info.user_id}:${info.message}。\\r\\nAi仅供传达。`);
            }
        });
    }
});