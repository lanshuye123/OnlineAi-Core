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
var CGI = require("./CGI");
(function () {
    var SendAble = Core.frame.ReadSystemConfig("SendAble");
    var Ks = 1;
    Core.AddListener(function (c, i) {
        if (CGI.HOOK) {
            return;
        }
        var delete_msg = (function (msgid) {
            if (i.group_id != undefined) {
                Core.frame.SendMsg(c, i, "[!][警告]有一个未备案消息被发送，请管理员自行验证此消息是否合理。");
            }
        });
        if (!(i.group_id != 588932037)) {
            if (SendAble[Core.GetUser(i.user_id)] != true) {
                delete_msg(i.message_id);
                Core.frame.Ban(c, i, 5 * 60 * Ks);
                Ks = Ks + 1;
                Core.frame.SendMsg(c, i, Core.frame.At(Core.GetUser(i.user_id)) + ",\u4F60\u7684\u6D88\u606F\u5C5E\u4E8E\u672A\u5907\u6848\u6D88\u606F\uFF0C\u8BF7\u79C1\u4FE1Ai\u53D1\u9001\"\u5907\u6848\"\u6765\u83B7\u53D6\u6D88\u606F\u5907\u6848\u3002");
            }
        }
        if (i.group_id == undefined && i.message == "备案") {
            SendAble[i.user_id.valueOf()] = true;
            Core.frame.WriteSystemConfig("SendAble", SendAble);
            Core.frame.SendMsg(c, i, "你已完成备案。现在你可以在主群中发表你的合理的、合法的、有建设性的意见或建议。");
        }
    });
})();
