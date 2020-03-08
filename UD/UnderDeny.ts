//《UnderDeny》 For OnlineAi Version!!!
//Author:Lanshuye
//Version (OnlineAi) <ALL>
//Version (MoudelCE) <ALL>
//Version (This Mod) <1.0>
import * as Core from "./Core";
import * as fs from "fs";
import { Socket } from "net";
class GameAction{
    Type:String;
    Settings:{
        对话_内容?:String;
        对话_人物?:String;
        跳转_目标?:String;
        变量_设置?:String;
        变量_内容?:String;
        常量_设置?:String;
        判断_变量?:String;
        判断_依据?:String;
        判断_执行?:GameAction;
    };
    Execute(c:Socket,i:Core.InfoType){
        if(this.Type=="对话"){
            Core.frame.SendMsg(c,i,`${this.Settings.对话_内容}`);
        }
        if(this.Type=="跳转"){
            fs.readFile("./UnderDenyData/Player.json",(err,data)=>{
                var data_obj = JSON.parse(data.toString());
                data_obj[i.user_id.toString()].Schedule = (this.Settings.跳转_目标 as string).valueOf();
                fs.writeFile("./UnderDenyData/Player.json",JSON.stringify(data_obj),(err2)=>{});
            });
        }
        if(this.Type=="判断"){
            fs.readFile("./UnderDenyData/Player.json",(err,data)=>{
                var data_obj = JSON.parse(data.toString());
                if(data_obj[i.user_id.toString()].Vars[(this.Settings.判断_变量 as String).valueOf()] == (this.Settings.判断_依据 as String).valueOf()){
                    var temp = new GameAction();
                    temp.Create(this.Settings.判断_执行 as GameAction).Execute(c,i);
                }
            });
        }
        if(this.Type=="变量"){
            fs.readFile("./UnderDenyData/Player.json",(err,data)=>{
                var data_obj = JSON.parse(data.toString());
                data_obj[i.user_id.toString()].Vars[(this.Settings.变量_设置 as String).valueOf()] = (this.Settings.变量_内容 as String).valueOf();
                fs.writeFile("./UnderDenyData/Player.json",JSON.stringify(data_obj),(err2)=>{});
            })
        }
    };
    Create(that:GameAction):GameAction{
        if(that!=undefined){
            this.Type = that.Type;
            this.Settings = that.Settings;    
        }
        return this;
    }
    constructor(){
        this.Type = "";
        this.Settings = {}
    }
}
class Item{

}
class PlayerData{
    LOVE:Number;
    EXP:Number;
    HP:Number;
    Item:Item[];
    constructor(PlayerData:PlayerData){
        this.LOVE = PlayerData.LOVE;
        this.EXP = PlayerData.EXP;
        this.HP = PlayerData.HP;
        this.Item = PlayerData.Item;
    }
}
class UDPlayer{
    Schedule:String;
    Vars:Object;
    Info:PlayerData;
    constructor(PlayerS:UDPlayer){
        this.Schedule = PlayerS.Schedule;
        this.Vars = PlayerS.Vars;
        this.Info = new PlayerData(PlayerS.Info as PlayerData);
    }
}
console.log(`[${new Date().toString()}][UnderDeny OA定制版]正在载入数据...`)
Core.AddListener((connect,info)=>{
    if(info.message.substr(0,2)!="UD"){
        return;
    }
    var msg:String = new String(info.message.replace("UD",""));
    if(msg=="开始游戏"){
        fs.readFile("./UnderDenyData/Player.json",(err,data)=>{
            var PlayerData = JSON.parse(data.toString());
            if(PlayerData[info.user_id.toString()]!=undefined){
                Core.frame.SendMsg(connect,info,`${Core.frame.At(info.user_id)},你还在进行游戏，发送\"UD重置\"才可以重新开始`);
                return;
            }
            PlayerData[info.user_id.toString()] = {Schedule:"Start",Vars:{},Info:{LOVE:0,EXP:0,HP:21,Itea:[]}}
            fs.readFile("./UnderDenyData/Script.json",(err2,data2)=>{
                var data_obj = JSON.parse(data2.toString());
                PlayerData[info.user_id.toString()].Vars = data_obj["Settings"]["init"];
                fs.writeFile("./UnderDenyData/Player.json",JSON.stringify(PlayerData),(err2)=>{
                    Core.frame.SendMsg(connect,info,`${Core.frame.At(info.user_id)},UD初始化完成。发送\"UD查看剧情\"来开始游戏吧`);
                });    
            });
        });
    }
    if(msg=="重置"){
        fs.readFile("./UnderDenyData/Player.json",(err,data)=>{
            var PlayerData = JSON.parse(data.toString());
            PlayerData[info.user_id.toString()] = undefined;
            fs.writeFile("./UnderDenyData/Player.json",JSON.stringify(PlayerData),(err2)=>{
                Core.frame.SendMsg(connect,info,`${Core.frame.At(info.user_id)},重置成功!`);
            });
        });
    }
    if(msg=="查看剧情"){
        fs.readFile("./UnderDenyData/Player.json",(err,data)=>{
            var PlayerData = JSON.parse(data.toString());
            if(PlayerData[info.user_id.toString()]==undefined){
                Core.frame.SendMsg(connect,info,`${Core.frame.At(info.user_id)},你没有进行游戏，发送\"UD开始游戏\"来开始游戏。`);
                return;
            }
            var ThisPlayer =new UDPlayer(PlayerData[info.user_id.toString()] as UDPlayer);
            fs.readFile("./UnderDenyData/Script.json",(err2,data2)=>{
                var Data = JSON.parse(data2.toString());
                var GameInfo = Data["Game"][ThisPlayer.Schedule.valueOf()].Info as String;
                var GameAct = Data["Game"][ThisPlayer.Schedule.valueOf()].Actions as Object;
                var YouCanDo = "<你可以选择的行动>\\r\\n";
                Object.keys(GameAct).forEach(element=>{
                    YouCanDo = `${YouCanDo}UD行动${element}\\r\\n`;
                });
                Core.frame.SendMsg(connect,info,`${Core.frame.At(info.user_id)}\\r\\n${GameInfo}\\r\\n${YouCanDo}<UNDERDENY>`);
            });
        });
    }
    if(msg.substr(0,2)=="行动"){
        var action = msg.replace("行动","");
        fs.readFile("./UnderDenyData/Player.json",(err,data)=>{
            var PlayerData = JSON.parse(data.toString());
            if(PlayerData[info.user_id.toString()]==undefined){
                Core.frame.SendMsg(connect,info,`${Core.frame.At(info.user_id)},你没有进行游戏，发送\"UD开始游戏\"来开始游戏。`);
                return;
            }
            var ThisPlayer =new UDPlayer(PlayerData[info.user_id.toString()] as UDPlayer);
            fs.readFile("./UnderDenyData/Script.json",(err2,data2)=>{
                var Data = JSON.parse(data2.toString());
                var GameAct = Data["Game"][ThisPlayer.Schedule.valueOf()].Actions;
                if((GameAct[action] as any)==undefined){
                    Core.frame.SendMsg(connect,info,`${Core.frame.At(info.user_id)},没有这个行动，请检查后再发送。`);
                    return;
                }
                var ActionGroup = GameAct[action] as Array<GameAction>;
                var Act:GameAction|undefined = new GameAction();
                for(var i=0;i<ActionGroup.length;i++){
                    Act.Create(ActionGroup[i]).Execute(connect,info);
                }
            });
        });
    }
});