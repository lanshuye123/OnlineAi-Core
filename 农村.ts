import * as Core from "./Core"
import * as fs from "fs";
const MoneyInterfaces = (require("./Money") as LibMoney).add.Interfaces;

const 农场Config = {
    前缀:"农场",
    配置:"农场.json"
}

var 农场Data:农场Lib;
fs.readFile(农场Config.配置,(err,data)=>{
    农场Data = JSON.parse(data.toString()) as 农场Lib;
});
Core.AddListener((c,i)=>{
    if(i.message.substr( 0, 农场Config.前缀.length) != 农场Config.前缀){
        return;
    }
    var Command = i.message.replace(农场Config.前缀,"");
    if(Command.substr(0,2) == "种植"){
        var 作物 = Command.replace("种植","");
        var 作物Config = 农场Data.农业[作物];
        if(作物Config == undefined){
            Core.frame.SendMsg(c,i,Core.frame.At(i.user_id)+"没有这个作物");
        };
    }
});
// Core.AddInterface("农村",())