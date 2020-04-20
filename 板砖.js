const fs = require("fs");
const Core = require("./Core");
const Money = require("./Money");
const Debug = require("./Debug");
exports.add  = {
    Interfaces:{
        GetUser板砖:function(user_id){
            var data_obj = Core.frame.ReadSystemConfig("板砖");
            return data_obj[user_id];
        },
        GiveUser板砖:function(user_id,count){
            var data_obj = Core.frame.ReadSystemConfig("板砖");
            data_obj[user_id] = this.GetUser板砖(user_id) + count;
            Core.frame.WriteSystemConfig("板砖",data_obj);
        }
    },
    Control:function(connect,info){
        var message = new String(info["message"]);
        console.log("a");
        console.log(message);
        if(message=="购买板砖"){
            console.log("b");
            if(Money.add.Interfaces.GetUserMoney(Core.GetUser(info["user_id"]))>100){
                Money.add.Interfaces.CostUserMoney(Core.GetUser(info["user_id"]),100);
                exports.add.Interfaces.GiveUser板砖(Core.GetUser(info["user_id"]),1);
                Core.frame.SendMsg(connect,info,`消耗金币 * 100\\r\\n<获得板砖>\\r\\n[板砖]*1\\r\\n<持有板砖>\\r\\n[板砖]*${exports.add.Interfaces.GetUser板砖(Core.GetUser(info["user_id"]))}`);
            }else{
                Core.frame.SendMsg(connect,info,"你的金币不足100。");
            }
        }
        if(message.substr(0,4)=="批发板砖"||message.substr(0,6)=="批量购买板砖"){
            var count = new Number(message.replace("批发板砖","").replace("批量购买板砖",""));
            if(count<0||isNaN(count)){
                Core.frame.SendMsg(connect,info,"Are you kidding me?");
                return;
            }
            if(!(Money.add.Interfaces.GetUserMoney(Core.GetUser(info.user_id))>count*100)){
                Core.frame.SendMsg(connect,info,"你再批发就破产了。");
            }else{
                Money.add.Interfaces.CostUserMoney(Core.GetUser(info.user_id),100*count);
                exports.add.Interfaces.GiveUser板砖(Core.GetUser(info.user_id),count);
                Core.frame.SendMsg(connect,info,`消耗金币 * ${100*count}\\r\\n<获得板砖>\\r\\n[板砖]*${count}\\r\\n<持有板砖>\\r\\n[板砖]*${exports.add.Interfaces.GetUser板砖(Core.GetUser(info["user_id"]))}`);
            }
        }
        if(message.substr(0,3)=="敲板砖"){
            var Tuser = message.replace("敲板砖","");
            Tuser = Tuser.replace("[CQ:at,qq=","");
            Tuser = Tuser.replace("]","");
            Tuser = Tuser.replace(" ","");
            if(Tuser == Core.GetUser(info["user_id"])){
                Core.frame.SendMsg(connect,info,"不可以敲自己");
                return;
            }
            if(!exports.add.Interfaces.GetUser板砖(Core.GetUser(info["user_id"]))>=1){
                Core.frame.SendMsg(connect,info,"你没有板砖，快去购买一个吧!");
                return;
            }
            if(Debug.add.Interfaces.IsAdmin(Core.GetUser(Tuser))){
                if(Debug.add.Interfaces.IsAdmin(Core.GetUser(info["user_id"]))){
                    Core.frame.SendMsg(connect,info,`${Core.frame.At(Core.GetUser(info["user_id"]))},你们AI管理员别内斗了行不!?`);
                }else{
                    Core.frame.SendMsg(connect,info,"AI管理员不可以被板砖攻击。");
                    Core.frame.Ban(connect,info,60);
                }
                return;
            }
            var BT = Math.floor(Math.random()*300);
            exports.add.Interfaces.GiveUser板砖(Core.GetUser(info["user_id"]),-1);
            Core.frame._Ban(connect,info,Tuser,BT);
            Core.frame.SendMsg(connect,info,`敲板砖成功，已禁言${Core.frame.At(Tuser)}长达${BT}秒。你剩余${exports.add.Interfaces.GetUser板砖(Core.GetUser(info["user_id"]))}个板砖。`);
        }
        if(message.substr(0,4)=="批量砸人"||message.substr(0,5)=="批量敲板砖"){
            var Tuser = message.replace("批量砸人","").replace("批量敲板砖","");
            var E = Tuser.split("|");
            var TuserZ = E[0].replace("[CQ:at,qq=","");
            TuserZ = TuserZ.replace("]","");
            TuserZ = TuserZ.replace(" ","");
            if(TuserZ == Core.GetUser(info["user_id"])){
                Core.frame.SendMsg(connect,info,"不可以敲自己");
                return;
            }
            if(!exports.add.Interfaces.GetUser板砖(Core.GetUser(info["user_id"]))>=new Number(E[1])){
                Core.frame.SendMsg(connect,info,"你没有板砖，快去购买一个吧!");
                return;
            }
            if(Debug.add.Interfaces.IsAdmin(Core.GetUser(TuserZ))){
                if(Debug.add.Interfaces.IsAdmin(Core.GetUser(info["user_id"]))){
                    Core.frame.SendMsg(connect,info,`${Core.frame.At(Core.GetUser(info["user_id"]))},你们AI管理员别内斗了行不!?`);
                }else{
                    Core.frame.SendMsg(connect,info,"AI管理员不可以被板砖攻击。");
                    Core.frame.Ban(connect,info,60);
                }
                return;
            }
            var BT = Math.floor(Math.random()*300) * E[1];
            exports.add.Interfaces.GiveUser板砖(Core.GetUser(info["user_id"]),-E[1]);
            Core.frame._Ban(connect,info,TuserZ,BT);
            Core.frame.SendMsg(connect,info,`敲板砖成功，已禁言${Core.frame.At(TuserZ)}长达${BT}秒。你剩余${exports.add.Interfaces.GetUser板砖(Core.GetUser(info["user_id"]))}个板砖。`);
        }
    }
}