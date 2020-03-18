"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
//Please Use UTF-8
var Core = __importStar(require("./Core"));
(function () {
    var 怼人目标 = {};
    var 怼人台词 = {
        "_无法识别": ["呵呵", "怎么地", "辣鸡"],
        "询问": ["不行", "不好", "放弃吧", "不咋地", "你不行"],
        "意见": ["我就这样", "有本事打我啊", "辣鸡"],
        "请求": ["我就不,你能拿我怎么样!?", "并不!"],
        "骂人": ["你是什么我不知道，但是我知道你不是什么。那就是你不是人。", "虽然我不是人，但你比我更不是人。", "你是东西吗?", "Are you a thing?"],
        "投降": ["本Ai被你怼哭了", "懒得和你计较了", "我不怼你了，对牛弹琴又有何用呢?", "我就暂且饶过你一次。"]
    };
    Core.AddListener(function (c, i) {
        if (i.message.indexOf("投降") != -1) {
            if (怼人目标[i.user_id]) {
                怼人目标[i.user_id] = 0;
                Core.frame.SendMsg(c, i, "哈哈!投降了吧!就你敢还和我怼?");
            }
            else {
                Core.frame.SendMsg(c, i, "我本来也没想怼你啊。");
            }
        }
        if (怼人目标[i.user_id] > 0) {
            if (i.message.indexOf("你这人") != -1 || i.message.indexOf("你") != -1 || i.message.indexOf("这") != -1) {
                Core.frame.SendMsg(c, i, 怼人台词.意见[new Number(Math.floor(怼人台词.意见.length * Math.random())).valueOf()]);
            }
            else if (i.message.indexOf("怎么样") != -1 || i.message.indexOf("吗") != -1 || i.message.indexOf("如何") != -1) {
                Core.frame.SendMsg(c, i, 怼人台词.询问[new Number(Math.floor(怼人台词.询问.length * Math.random())).valueOf()]);
            }
            else if (i.message.indexOf("请") != -1) {
                Core.frame.SendMsg(c, i, 怼人台词.请求[new Number(Math.floor(怼人台词.请求.length * Math.random())).valueOf()]);
            }
            else if (i.message.indexOf("我") != -1 || i.message.indexOf("什么") != -1) {
                Core.frame.SendMsg(c, i, 怼人台词.骂人[new Number(Math.floor(怼人台词.骂人.length * Math.random())).valueOf()]);
            }
            else {
                Core.frame.SendMsg(c, i, 怼人台词._无法识别[new Number(Math.floor(怼人台词._无法识别.length * Math.random())).valueOf()]);
            }
            怼人目标 = 怼人目标 - 1;
            if (怼人目标 == 0) {
                Core.frame.SendMsg(c, i, 怼人台词.投降[new Number(Math.floor(怼人台词.投降.length * Math.random())).valueOf()]);
            }
        }
        if (i.message == "怼我" || i.message == "怼人") {
            Core.frame.SendMsg(c, i, "行啊!接招!");
            怼人目标[i.user_id] = 10;
        }
        if (i.message.substr(0, 1) == "怼" || i.message.substr(0, 3) == "帮我怼") {
            var qq = i.message.replace("怼", "");
            if (qq == "我") {
                return;
            }
            if (qq == "人") {
                return;
            }
            qq = qq.replace("帮我", "");
            qq = qq.replace("[CQ:at,qq=", "");
            qq = qq.replace("]", "");
            怼人目标[qq] = 10;
            Core.frame.SendMsg(c, i, "\u6211\u4F1A\u53BB\u603C" + Core.frame.At(new Number(qq)) + "\u7684");
        }
    });
})();
