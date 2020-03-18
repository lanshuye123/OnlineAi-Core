//Please Use UTF-8
import * as Core from "./Core";
(() => {//OnLoad
    var 怼人目标 = {} as any;
    var 怼人台词 = {
        "_无法识别": ["呵呵", "怎么地","辣鸡"],
        "询问": ["不行", "不好", "放弃吧", "不咋地", "你不行"],
        "意见": ["我就这样", "有本事打我啊", "辣鸡"]
    }
    Core.AddListener((c, i) => {
        if (i.message.indexOf("投降") != -1) {
            if (怼人目标[i.user_id as number]) {
                怼人目标[i.user_id as number] = false;
                Core.frame.SendMsg(c, i, "哈哈!投降了吧!就你敢还和我怼?");
            } else {
                Core.frame.SendMsg(c, i, "我本来也没想怼你啊。");
            }
        }
        if (怼人目标[i.user_id as number]) {
            if (i.message.indexOf("你这人") != -1 || i.message.indexOf("你") != -1 || i.message.indexOf("这") != -1) {
                Core.frame.SendMsg(c, i, 怼人台词.意见[new Number(Math.floor(怼人台词.意见.length * Math.random())).valueOf()]);
            } else if (i.message.indexOf("怎么样") != -1 || i.message.indexOf("吗") != -1 || i.message.indexOf("如何") != -1) {
                Core.frame.SendMsg(c, i, 怼人台词.询问[new Number(Math.floor(怼人台词.询问.length * Math.random())).valueOf()]);
            } else {
                Core.frame.SendMsg(c, i, 怼人台词._无法识别[new Number(Math.floor(怼人台词._无法识别.length * Math.random())).valueOf()]);
            }
        }
        if (i.message == "怼我") {
            Core.frame.SendMsg(c, i, "行啊!接招!");
            怼人目标[i.user_id as number] = true;
        }
        if (i.message.substr(0, 1) == "怼" || i.message.substr(0, 3) == "帮我怼") {
            var qq = i.message.replace("怼", "");
            if (qq == "我") {
                return;
            }
            qq = qq.replace("帮我", "");
            qq = qq.replace("[CQ:at,qq=", "");
            qq = qq.replace("]", "");
            怼人目标[qq] = true;
            Core.frame.SendMsg(c, i, `我会怼${Core.frame.At(new Number(qq))}的`);
        }
    });
})();