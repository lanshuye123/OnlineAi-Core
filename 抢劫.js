//固定资产
const fs=require("fs");
const Core = require("./Core");
const MoneyInterfaces = require("./Money").add.Interfaces;
const 保镖In = require("./保镖.i");
exports.add={
    Interfaces:{},
    Control:function(connect,info){
        //console.log("["+new Date().toString()+"][抢劫.js]正在处理");
        var Temp1 = new String(info["raw_message"]);
        if(Temp1.substr(0,2)=="抢劫"){
            if(Temp1.length == 2){
                Core.frame.SendMsg(connect,info,"此命令的格式是:抢劫@XX(XX为要被抢劫的人)")
            }else{
                var UQQ = Temp1.replace('[CQ:at,qq=',"");
                UQQ = UQQ.replace(']',"");
                UQQ = UQQ.replace('抢劫',"");
                UQQ = UQQ.replace(' ',"");
                At = Core.frame.GetAt(connect,info);if(At){UQQ=At}
                if(保镖In.使用用户保镖(Core.GetUser(UQQ))){
                    Core.frame.SendMsg(connect,info,Core.frame.At(Core.GetUser(info.user_id))+"对方有保镖，不可抢劫。");
                }else{
                    if(isNaN(new Number(UQQ).valueOf())){
                        if(UQQ.indexOf("@") != -1){
                            Core.frame.SendMsg(connect,info,"你可能是复制了一个At,目前AI暂不支持At复制，请使用At选择框或者输入QQ号码");
                        }
                        return;
                    }
                    if(MoneyInterfaces.GetUserMoney(UQQ)<1000){
                        Core.frame.SendMsg(connect,info,Core.frame.At(UQQ)+"的余额不足1000，不可抢劫。");
                    }else{
                        var Temp2 = Math.ceil(Math.random() * MoneyInterfaces.GetUserMoney(Core.GetUser(UQQ)) * 0.25);
                        if(UQQ == Core.GetUser(info["user_id"])){
                            Temp2 = 0;
                        }
                        MoneyInterfaces.GiveUserMoney(Core.GetUser(info["user_id"]),Temp2,`抢劫${UQQ}`);
                        MoneyInterfaces.CostUserMoney(UQQ,Temp2,`被${info["user_id"]}抢劫`);
                        Core.frame.SendMsg(connect,info,Core.frame.At(Core.GetUser(info["user_id"]))+"抢劫成功！你抢到"+Temp2+"元，你的余额"+MoneyInterfaces.GetUserMoney(Core.GetUser(info["user_id"]))+"元");
                    }
                }
            }
        }
        //console.log("["+new Date().toString()+"][抢劫.js]处理完成");
    }
}