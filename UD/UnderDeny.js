"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
//《UnderDeny》 For OnlineAi Version!!!
//Author:Lanshuye
//Version (OnlineAi) <ALL>
//Version (MoudelCE) <ALL>
//Version (This Mod) <1.0>
const Core = __importStar(require("./Core"));
const fs = __importStar(require("fs"));
class GameAction {
    Execute(c, i, Temp_this) {
        if (Temp_this.Type == "对话") {
            Core.frame.SendMsg(c, i, `${Temp_this.Settings.对话_内容}`);
        }
        if (Temp_this.Type == "跳转") {
            var data = fs.readFileSync("./UnderDenyData/Player.json");
            var data_obj = JSON.parse(data.toString());
            data_obj[i.user_id.toString()].Schedule = Temp_this.Settings.跳转_目标.valueOf();
            fs.writeFile("./UnderDenyData/Player.json", JSON.stringify(data_obj), (err2) => { });
        }
        if (Temp_this.Type == "判断") {
            fs.readFile("./UnderDenyData/Player.json", (err, data) => {
                var data_obj = JSON.parse(data.toString());
                if (data_obj[i.user_id.toString()].Vars[Temp_this.Settings.判断_变量.valueOf()] == Temp_this.Settings.判断_依据.valueOf()) {
                    var temp = new GameAction();
                    var s = Temp_this.Settings.判断_执行;
                    for (var j = 0; j < s.length; j++) {
                        temp.Create(s[j]).Execute(c, i, temp.Create(s[j]));
                    }
                }
            });
        }
        if (Temp_this.Type == "变量") {
            fs.readFile("./UnderDenyData/Player.json", (err, data) => {
                var data_obj = JSON.parse(data.toString());
                data_obj[i.user_id.toString()].Vars[Temp_this.Settings.变量_设置.valueOf()] = Temp_this.Settings.变量_内容.valueOf();
                fs.writeFile("./UnderDenyData/Player.json", JSON.stringify(data_obj), (err2) => { });
            });
        }
        if (Temp_this.Type == "随机") {
            var rom = Math.floor(Math.random() * 100);
            if (rom < Temp_this.Settings.触发_几率.valueOf()) {
                var temp = new GameAction();
                var s = Temp_this.Settings.触发_回调;
                for (var j = 0; j < s.length; j++) {
                    temp.Create(s[j]).Execute(c, i, temp.Create(s[j]));
                }
            }
            else {
                if (Temp_this.Settings.触发_否则 != undefined || Temp_this.Settings.触发_否则 != null) {
                    var temp = new GameAction();
                    var s = Temp_this.Settings.触发_否则;
                    for (var j = 0; j < s.length; j++) {
                        temp.Create(s[j]).Execute(c, i, temp.Create(s[j]));
                    }
                }
            }
        }
        if (Temp_this.Type == "战斗=>扣血") {
            var data_obj = JSON.parse(fs.readFileSync("./UnderDenyData/Player.json").toString());
            var Player = new PlayerData(data_obj[i.user_id.toString()].Info);
            console.log(Temp_this.Settings);
            Player.HP = Player.HP.valueOf() - Temp_this.Settings.战斗_扣血.valueOf();
            Core.frame.SendMsg(c, i, `${Temp_this.Settings.战斗_目标}对你使用了${Temp_this.Settings.战斗_弹幕}，造成${Temp_this.Settings.战斗_扣血}点伤害，你剩余${Player.HP}点血量。`);
            data_obj[i.user_id.toString()].Info = Player;
            if (Player.HP < 0) {
                data_obj[i.user_id.toString()] = undefined;
                Core.frame.SendMsg(c, i, `你失败了\r\n${Core.frame.At(i.user_id)}保持你的决心。`);
            }
            fs.writeFile("./UnderDenyData/Player.json", JSON.stringify(data_obj), (err2) => { });
        }
    }
    ;
    Create(that) {
        if (that != undefined) {
            this.Type = that.Type;
            this.Settings = that.Settings;
        }
        return this;
    }
    constructor() {
        this.Type = "";
        this.Settings = {};
    }
}
class Item {
}
class PlayerData {
    constructor(PlayerData) {
        this.LOVE = PlayerData.LOVE;
        this.EXP = PlayerData.EXP;
        this.HP = PlayerData.HP;
        this.Item = PlayerData.Item;
    }
}
class UDPlayer {
    constructor(PlayerS) {
        this.Schedule = PlayerS.Schedule;
        this.Vars = PlayerS.Vars;
        this.Info = new PlayerData(PlayerS.Info);
    }
}
console.log(`[${new Date().toString()}][UnderDeny OA定制版]正在载入数据...`);
Core.AddListener((connect, info) => {
    if (info.message.substr(0, 2) != "UD") {
        return;
    }
    var msg = new String(info.message.replace("UD", ""));
    if (msg == "开始游戏") {
        fs.readFile("./UnderDenyData/Player.json", (err, data) => {
            var PlayerData = JSON.parse(data.toString());
            if (PlayerData[info.user_id.toString()] != undefined) {
                Core.frame.SendMsg(connect, info, `${Core.frame.At(info.user_id)},你还在进行游戏，发送\"UD重置\"才可以重新开始`);
                return;
            }
            PlayerData[info.user_id.toString()] = { Schedule: "Start", Vars: {}, Info: { LOVE: 0, EXP: 0, HP: 21, Item: [] } };
            fs.readFile("./UnderDenyData/Script.json", (err2, data2) => {
                var data_obj = JSON.parse(data2.toString());
                PlayerData[info.user_id.toString()].Vars = data_obj["Settings"]["init"];
                fs.writeFile("./UnderDenyData/Player.json", JSON.stringify(PlayerData), (err2) => {
                    Core.frame.SendMsg(connect, info, `${Core.frame.At(info.user_id)},UD初始化完成。发送\"UD查看剧情\"来开始游戏吧`);
                });
            });
        });
    }
    if (msg == "重置") {
        fs.readFile("./UnderDenyData/Player.json", (err, data) => {
            var PlayerData = JSON.parse(data.toString());
            PlayerData[info.user_id.toString()] = undefined;
            fs.writeFile("./UnderDenyData/Player.json", JSON.stringify(PlayerData), (err2) => {
                Core.frame.SendMsg(connect, info, `${Core.frame.At(info.user_id)},重置成功!`);
            });
        });
    }
    if (msg == "查看剧情") {
        fs.readFile("./UnderDenyData/Player.json", (err, data) => {
            var PlayerData = JSON.parse(data.toString());
            if (PlayerData[info.user_id.toString()] == undefined) {
                Core.frame.SendMsg(connect, info, `${Core.frame.At(info.user_id)},你没有进行游戏，发送\"UD开始游戏\"来开始游戏。`);
                return;
            }
            var ThisPlayer = new UDPlayer(PlayerData[info.user_id.toString()]);
            fs.readFile("./UnderDenyData/Script.json", (err2, data2) => {
                var Data = JSON.parse(data2.toString());
                var GameInfo = Data["Game"][ThisPlayer.Schedule.valueOf()].Info;
                var GameAct = Data["Game"][ThisPlayer.Schedule.valueOf()].Actions;
                var YouCanDo = "<你可以选择的行动>\\r\\n";
                Object.keys(GameAct).forEach(element => {
                    YouCanDo = `${YouCanDo}UD行动${element}\\r\\n`;
                });
                Core.frame.SendMsg(connect, info, `${Core.frame.At(info.user_id)}\\r\\n${GameInfo}\\r\\n${YouCanDo}<UNDERDENY>`);
            });
        });
    }
    if (msg == "进行存档") {
        fs.readFile("./UnderDenyData/Player.json", (err, data) => {
            var PlayerData = JSON.parse(data.toString());
            if (PlayerData[info.user_id.toString()] == undefined) {
                Core.frame.SendMsg(connect, info, `${Core.frame.At(info.user_id)},你没有进行游戏，发送\"UD开始游戏\"来开始游戏。`);
                return;
            }
            fs.readFile("./UnderDenyData/Script.json", (err2, data2) => {
                var data2_obj = JSON.parse(data2.toString());
                if (data2_obj["Game"][PlayerData[info.user_id.toString()].Schedule].SaveAble != true) {
                    Core.frame.SendMsg(connect, info, "此时你无法存档。");
                }
                else {
                    PlayerData[`${info.user_id}_SAVE`] = PlayerData[info.user_id.toString()];
                    fs.writeFile("./UnderDenyData/Player.json", JSON.stringify(PlayerData), (err3) => { });
                    Core.frame.SendMsg(connect, info, data2_obj["Game"][PlayerData[info.user_id.toString()].Schedule].SaveInfo);
                }
            });
        });
    }
    if (msg.substr(0, 2) == "行动") {
        var action = msg.replace("行动", "");
        fs.readFile("./UnderDenyData/Player.json", (err, data) => {
            var PlayerData = JSON.parse(data.toString());
            if (PlayerData[info.user_id.toString()] == undefined) {
                Core.frame.SendMsg(connect, info, `${Core.frame.At(info.user_id)},你没有进行游戏，发送\"UD开始游戏\"来开始游戏。`);
                return;
            }
            var ThisPlayer = new UDPlayer(PlayerData[info.user_id.toString()]);
            fs.readFile("./UnderDenyData/Script.json", (err2, data2) => {
                var Data = JSON.parse(data2.toString());
                var GameAct = Data["Game"][ThisPlayer.Schedule.valueOf()].Actions;
                if (GameAct[action] == undefined) {
                    Core.frame.SendMsg(connect, info, `${Core.frame.At(info.user_id)},没有这个行动，请检查后再发送。`);
                    return;
                }
                var ActionGroup = GameAct[action];
                var Act = new GameAction();
                for (var i = 0; i < ActionGroup.length; i++) {
                    Act.Create(ActionGroup[i]).Execute(connect, info, Act.Create(ActionGroup[i]));
                }
            });
        });
    }
});
