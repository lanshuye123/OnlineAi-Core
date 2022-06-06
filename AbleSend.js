"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
const Core = __importStar(require("./Core"));
const CGI = require("./CGI");
(() => {
    var SendAble = Core.frame.ReadSystemConfig("SendAble");
    var Ks = 1;
    Core.AddListener((c, i) => {
        if (CGI.HOOK) {
            return;
        }
        var delete_msg = ((msgid) => {
            if (i.group_id != undefined) {
                Core.frame.SendMsg(c, i, "[!][警告]有一个未备案消息被发送，请管理员自行验证此消息是否合理。");
            }
        });
        if (!(i.group_id != 588932037)) {
            if (SendAble[Core.GetUser(i.user_id)] != true) {
                delete_msg(i.message_id);
                Core.frame.Ban(c, i, 5 * 60 * Ks);
                Ks = Ks + 1;
                Core.frame.SendMsg(c, i, `${Core.frame.At(Core.GetUser(i.user_id))},你的消息属于未备案消息，请私信Ai发送"备案"来获取消息备案。`);
            }
        }
        if (i.group_id == undefined && i.message == "备案") {
            SendAble[i.user_id.valueOf()] = true;
            Core.frame.WriteSystemConfig("SendAble", SendAble);
            Core.frame.SendMsg(c, i, "你已完成备案。现在你可以在主群中发表你的合理的、合法的、有建设性的意见或建议。");
        }
    });
})();
