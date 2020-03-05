//红包Mod
const fs=require("fs");
const Core = require("./Core");
const MoneyInterfaces = require("./Money").add.Interfaces;
exports.add={
    Interfaces:{
        GetRedPacketPool:function(){
            var RPP = new Number(Core.frame.ReadSystemConfig("RedPacketPool"));
            if(RPP==undefined||RPP==NaN||RPP==null){
                return 0;
            }else{
                return RPP;
            }
        },
        AddRedPacketPool:function(Money){
            var RPP = this.GetRedPacketPool();
            var RPP = RPP + Money;
            Core.frame.WriteSystemConfig("RedPacketPool",RPP);
            return;
        },
        CostRedPacketPool:function(Money){
            this.AddRedPacketPool(-1 * Money);
            return;
        }
    },
    Control:function(connect,info){
        //console.log("["+new Date().toString()+"][RedPacket.js]正在处理");
        var data = JSON.parse(fs.readFileSync("./UserDataBase.json"));
        const date = new Date();
        var Temp1 = new String(info["raw_message"]);
        if(Temp1.substr(0,3)=="发红包"){
            if(Temp1.length==3){
                Core.frame.SendMsg(connect,info,"命令使用规范:发红包XX(XX为红包金额)");
            }else{
                var Temp2 = new Number(Temp1.substr(3,Temp1.length-3));
                var UM = Temp2;
                if(UM<0){
                    Core.frame.SendMsg(connect,info,"请输入一个正数金额。");
					return;
                }else if(UM==0){
                    Core.frame.SendMsg(connect,info,"请输入一个正数金额。");
					return;
                }else if(isNaN(UM)){
                    Core.frame.SendMsg(connect,info,"请输入一个数字。");
					return;
                }
                if(MoneyInterfaces.GetUserMoney(Core.GetUser(info["user_id"]))<Temp2){
                    Core.frame.SendMsg(connect,info,"你的余额不够。");
                }else{
                    MoneyInterfaces.CostUserMoney(Core.GetUser(info["user_id"]),Temp2);
                    exports.add.Interfaces.AddRedPacketPool(Temp2);
                    Core.frame.SendMsg(connect,info,"发红包成功!红包池余额:"+exports.add.Interfaces.GetRedPacketPool());
                }
            }
        }
        if(Temp1 == "抢红包"){
            if(exports.add.Interfaces.GetRedPacketPool()<1000){
                var M = exports.add.Interfaces.GetRedPacketPool();
            }else{
                var M = Math.ceil(1000 * Math.random());
            }
            MoneyInterfaces.GiveUserMoney(Core.GetUser(info["user_id"]),M);
            exports.add.Interfaces.CostRedPacketPool(M);
            Core.frame.SendMsg(connect,info,Core.frame.At(Core.GetUser(info["user_id"]))+"你抢到了"+M+"元，红包池余额"+exports.add.Interfaces.GetRedPacketPool()+"元");
        }
        //console.log("["+new Date().toString()+"][RedPacket.js]处理完成");
    }
}