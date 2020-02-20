//固定资产
const fs=require("fs");
const Core = require("./Core");
exports.add={
    Interfaces:{
        GetUserMoney:function(UserID){
            var data = Core.frame.ReadSystemConfig("固定资产");
            if(data[UserID]==undefined||null||NaN){
                return 0;
            }else{
                return new Number(data[UserID]) + 0;
            }
            
        },
        GiveUserMoney:function(UserID,Moeny){
            var data = Core.frame.ReadSystemConfig("固定资产");
            if(data[UserID]==undefined||null||NaN){
                data[UserID] = Moeny;
            }else{
                data[UserID] = new Number(this.GetUserMoney(UserID) + new Number(Moeny));
            }
            Core.frame.WriteSystemConfig("固定资产",data);
            return;
        },
        CostUserMoney:function(UserID,Moeny){
            exports.add.Interfaces.GiveUserMoney(UserID,-1 * Moeny);
            return;
        },
        GetUserTo:function(UserID){
            var data = Core.frame.ReadSystemConfig("目标");
            if(data[UserID]==undefined||null||NaN){
                return undefined;
            }else{
                return data[UserID];
            }
            
        },
        GiveUserTo:function(UserID,To){
            var data = Core.frame.ReadSystemConfig("目标");
            data[UserID] = To;
            Core.frame.WriteSystemConfig("目标",data);
            return;
        }

    },
    Control:function(connect,info){
        //console.log("["+new Date().toString()+"][Money.js]正在处理");
        var data = JSON.parse(fs.readFileSync("./UserDataBase.json"));
        const date = new Date();
        var msg = new String(info["raw_message"]);
        if(msg=="签到"||msg.substr(0,8)=="[CQ:sign"){
            if(data["签到"][Core.GetUser(info["user_id"])]==date.getFullYear().toString()+date.getMonth().toString()+date.getDay().toString()){
                Core.frame.SendMsg(connect,info,Core.frame.At(Core.GetUser(info["user_id"]))+"已签到了!");
            }else{
                exports.add.Interfaces.GiveUserMoney(Core.GetUser(info["user_id"]),500);
                Core.frame.SendMsg(connect,info,Core.frame.At(Core.GetUser(info["user_id"]))+"签到成功，获得500RMB，当前余额"+exports.add.Interfaces.GetUserMoney(Core.GetUser(info["user_id"])));
                var data = JSON.parse(fs.readFileSync("./UserDataBase.json"));
                data["签到"][Core.GetUser(info["user_id"])]=date.getFullYear().toString()+date.getMonth().toString()+date.getDay().toString();
                fs.writeFileSync("./UserDataBase.json",JSON.stringify(data));
            }
        }
        if(msg=="领利息"||msg.substr(0,8)=="[CQ:sign"){
            if(data["利息"][Core.GetUser(info["user_id"])]==date.getFullYear().toString()+date.getMonth().toString()){
                Core.frame.SendMsg(connect,info,Core.frame.At(Core.GetUser(info["user_id"]))+"一个月只能领一次利息!");
            }else{
                var m = Math.floor(new Number(exports.add.Interfaces.GetUserMoney(Core.GetUser(info["user_id"]))) * 0.1);
                exports.add.Interfaces.GiveUserMoney(Core.GetUser(info["user_id"]),m);
                Core.frame.SendMsg(connect,info,Core.frame.At(Core.GetUser(info["user_id"]))+`领取成功，获得${m}RMB，当前余额`+exports.add.Interfaces.GetUserMoney(Core.GetUser(info["user_id"])));
                var data = JSON.parse(fs.readFileSync("./UserDataBase.json"));
                data["利息"][Core.GetUser(info["user_id"])]=date.getFullYear().toString()+date.getMonth().toString();
                fs.writeFileSync("./UserDataBase.json",JSON.stringify(data));
            }
        }
        if(info["raw_message"]=="我的余额"){
            Core.frame.SendMsg(connect,info,Core.frame.At(Core.GetUser(info["user_id"]))+"你的余额是"+exports.add.Interfaces.GetUserMoney(Core.GetUser(info["user_id"]))+"元。");
        }
        if(msg.substr(0,2)=="转账"){
            if(msg.length==2){
                Core.frame.SendMsg(connect,info,"此命令的格式是:转账ZH@XXXX(XXXX为接受方) 或 转账JEXXXX(XXXX为钱数)");
            }else{
                if(msg.substr(0,4)=="转账ZH"){
                    var UQQ = msg.replace('[CQ:at,qq=',"");
                    UQQ = UQQ.replace(']',"");
                    UQQ = UQQ.replace('转账ZH',"");
                    UQQ = UQQ.replace(' ',"")
                    exports.add.Interfaces.GiveUserTo(Core.GetUser(info["user_id"]),UQQ);
                    Core.frame.SendMsg(connect,info,"已设置目标为"+Core.frame.At(UQQ));
                }
                if(msg.substr(0,4)=="转账JE"){
                    var UM = UM.replace('转账JE',"");
                    UM = UM.replace(' ',"")
                    UM = new Number(UM);
                    if(UM<0){
                        Core.frame.SendMsg(connect,info,"请输入一个正数金额。");
                    }else if(UM==0){
                        Core.frame.SendMsg(connect,info,"请输入一个正数金额。");
                    }else if(isNaN(UM)){
                        Core.frame.SendMsg(connect,info,"请输入一个数字。");
                    }else if(exports.add.Interfaces.GetUserTo(Core.GetUser(info["user_id"]))!=undefined){
                        if(exports.add.Interfaces.GetUserMoney(Core.GetUser(info["user_id"]))<UM){
                            Core.frame.SendMsg(connect,info,"你的余额不足转账。");
                        }else{
                            exports.add.Interfaces.CostUserMoney(Core.GetUser(info["user_id"]),UM);
                            exports.add.Interfaces.GiveUserMoney(exports.add.Interfaces.GetUserTo(Core.GetUser(info["user_id"])),UM);
                            Core.frame.SendMsg(connect,info,Core.frame.At(Core.GetUser(info["user_id"]))+"转账成功，你的余额:"+exports.add.Interfaces.GetUserMoney(Core.GetUser(info["user_id"]))+"元。对方余额:"+exports.add.Interfaces.GetUserMoney(exports.add.Interfaces.GetUserTo(Core.GetUser(info["user_id"])))+"元。");                                exports.add.Interfaces.GiveUserTo(Core.GetUser(info["user_id"]),undefined);
                        }
                    }else{
                        Core.frame.SendMsg(connect,info,"请使用 转账ZH@XXXX 设置转账目标。");
                    }
                }
            }
        }
        //console.log("["+new Date().toString()+"][Money.js]处理完成");
    }
}