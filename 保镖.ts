// 保镖.ts 提供一个为你防护的保镖
import * as Core from "./Core";
const Money:LibMoney = require("./Money") as LibMoney;
const 保镖配置 = {
    聘请定价:1000,
    使用次数:5,
    禁言权重:25
}
export var Interfaces = {};
Core.AddListener((connect,info)=>{
    if(info.message == "聘请保镖"){
        if(Money.add.Interfaces.GetUserMoney(Core.GetUser(info.user_id)) < 保镖配置.聘请定价){
            Core.frame.SendMsg(connect,info,`${Core.frame.At(Core.GetUser(info.user_id))},你的余额不足${保镖配置.聘请定价},不能聘请保镖.`);
            return;
        }
        var Data = Core.frame.ReadSystemConfig("保镖");
        var User保镖 = new Number(Data[Core.GetUser(info.user_id)]) as number;
        if(isNaN(User保镖)){
            User保镖 = 0;
        }
        Money.add.Interfaces.CostUserMoney(Core.GetUser(info.user_id),保镖配置.聘请定价);
        User保镖 = User保镖 + 保镖配置.使用次数;
        Data[Core.GetUser(info.user_id)] = User保镖;
        Core.frame.WriteSystemConfig("保镖",Data);
        Core.frame.SendMsg(connect,info,`${Core.frame.At(Core.GetUser(info.user_id))},聘请保镖成功,你剩下${User保镖}位保镖,还剩${Money.add.Interfaces.GetUserMoney(Core.GetUser(info.user_id))}RMB.`)
    }
});