import * as Core from "./Core"
import * as fs from "fs";
const MoneyInterfaces = (require("./Money") as LibMoney).add.Interfaces;

const 农场Config = {
    前缀:"农场",
    配置:"农场.json",
    数据:"农场Data.json"
}

var 农场配置:农场Lib;
var 农场数据:User农场Data[];
fs.readFile(农场Config.配置,(err,data)=>{
    农场配置 = JSON.parse(data.toString()) as 农场Lib;
});
fs.readFile(农场Config.数据,(err,data)=>{
    农场数据 = JSON.parse(data.toString()) as User农场Data[];
})
Core.AddListener((c,i)=>{
    if(i.message.substr( 0, 农场Config.前缀.length) != 农场Config.前缀){
        return;
    }
    if(农场数据[Core.GetUser(i.user_id)] == undefined){
        农场数据[Core.GetUser(i.user_id)] = {
            菜地:[]
        }
    }
    var Command = i.message.replace(农场Config.前缀,"");
    if( Command.substr(0,2) == "种植"){
        var 作物 = Command.replace("种植","");
        var 作物Config = 农场配置.农业[作物] as 作物;
        if(作物Config == undefined){
            Core.frame.SendMsg(c,i,Core.frame.At(i.user_id)+"，没有这个作物。");
            return;
        };
        if( MoneyInterfaces.GetUserMoney(i.user_id) < 作物Config.种子 ){
            Core.frame.SendMsg(c,i,Core.frame.At(i.user_id)+"，你的钱不够。")
            return;
        }

        农场数据[Core.GetUser(i.user_id)].菜地[农场数据[Core.GetUser(i.user_id)].菜地.length] = {
            类型:作物,
            成熟:Math.round(new Date().getTime()/1000 + 作物Config.生长.valueOf())
        }
        MoneyInterfaces.CostUserMoney(Core.GetUser(i.user_id),作物Config.种子);
        Core.frame.SendMsg(c,i,`${Core.frame.At(Core.GetUser(i.user_id))}，你使用${作物Config.种子}点金币购买了${作物}，它将会在${作物Config.生长}秒后完成生长。`);
    }

    if( Command.substr(0,2) == "采摘" ){
        var UserMoneyAdd = 0;
        农场数据[Core.GetUser(i.user_id)].菜地.forEach((v,index)=>{
            if(v.成熟 < new Date().getTime()/1000 ){
                if(农场数据[Core.GetUser(i.user_id)].菜地[index].已采摘 == true){
                    return;
                }
                UserMoneyAdd = UserMoneyAdd + (农场配置.农业[v.类型.valueOf()] as 作物).售价.valueOf();
                农场数据[Core.GetUser(i.user_id)].菜地[index].已采摘 = true;
            }
        });
        MoneyInterfaces.GiveUserMoney(Core.GetUser(i.user_id),UserMoneyAdd);
        Core.frame.SendMsg(c,i,`${Core.frame.At(Core.GetUser(i.user_id))},你采摘了你的菜地中的成熟的作物,获得了${UserMoneyAdd}点金币。`);
        
        var temp:作物单位[] = [];
        农场数据[Core.GetUser(i.user_id)].菜地.forEach((v,index)=>{
                if(农场数据[Core.GetUser(i.user_id)].菜地[index].已采摘 == true){
                    return;
                }
                temp[temp.length] = v;
        });
        农场数据[Core.GetUser(i.user_id)].菜地 = temp;
    }
    if( Command == "查看" ){
        
    }

    fs.writeFile(农场Config.数据,JSON.stringify(new Object(农场数据)),(err)=>{});
});
// Core.AddInterface("农村",())