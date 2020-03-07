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
var Core = __importStar(require("./Core"));
var fs = __importStar(require("fs"));
var GameAction = /** @class */ (function () {
    function GameAction() {
        this.Type = "";
        this.Settings = {};
    }
    GameAction.prototype.Execute = function (c, i) {
        if (this.Type == "对话") {
            Core.frame.SendMsg(c, i, "" + this.Settings.对话_内容);
        }
    };
    ;
    GameAction.prototype.Create = function (that) {
        if (that != undefined) {
            this.Type = that.Type;
            this.Settings = that.Settings;
        }
        return this;
    };
    return GameAction;
}());
var Item = /** @class */ (function () {
    function Item() {
    }
    return Item;
}());
var PlayerData = /** @class */ (function () {
    function PlayerData(PlayerData) {
        this.LOVE = PlayerData.LOVE;
        this.EXP = PlayerData.EXP;
        this.HP = PlayerData.HP;
        this.Item = PlayerData.Item;
    }
    return PlayerData;
}());
var UDPlayer = /** @class */ (function () {
    function UDPlayer(PlayerS) {
        this.Schedule = PlayerS.Schedule;
        this.Vars = PlayerS.Vars;
        this.Info = new PlayerData(PlayerS.Info);
    }
    return UDPlayer;
}());
console.log("[" + new Date().toString() + "][UnderDeny OA\u5B9A\u5236\u7248]\u6B63\u5728\u8F7D\u5165\u6570\u636E...");
Core.AddListener(function (connect, info) {
    if (info.message.substr(0, 2) != "UD") {
        return;
    }
    var msg = new String(info.message.replace("UD", ""));
    if (msg == "开始游戏") {
        fs.readFile("./UnderDenyData/Player.json", function (err, data) {
            var PlayerData = JSON.parse(data.toString());
            if (PlayerData[info.user_id.toString()] != undefined) {
                Core.frame.SendMsg(connect, info, Core.frame.At(info.user_id) + ",\u4F60\u8FD8\u5728\u8FDB\u884C\u6E38\u620F\uFF0C\u53D1\u9001\"UD\u91CD\u7F6E\"\u624D\u53EF\u4EE5\u91CD\u65B0\u5F00\u59CB");
                return;
            }
            PlayerData[info.user_id.toString()] = new Object({ Schedule: "Start", Vars: {}, Info: { LOVE: 0, EXP: 0, HP: 21, Itea: [] } });
            fs.writeFile("./UnderDenyData/Player.json", JSON.stringify(PlayerData), function (err2) {
                Core.frame.SendMsg(connect, info, Core.frame.At(info.user_id) + ",UD\u521D\u59CB\u5316\u5B8C\u6210\u3002\u53D1\u9001\"UD\u67E5\u770B\u5267\u60C5\"\u6765\u5F00\u59CB\u6E38\u620F\u5427");
            });
        });
    }
    if (msg == "重置") {
        fs.readFile("./UnderDenyData/Player.json", function (err, data) {
            var PlayerData = JSON.parse(data.toString());
            PlayerData[info.user_id.toString()] = undefined;
            fs.writeFile("./UnderDenyData/Player.json", JSON.stringify(PlayerData), function (err2) {
                Core.frame.SendMsg(connect, info, Core.frame.At(info.user_id) + ",\u91CD\u7F6E\u6210\u529F!");
            });
        });
    }
    if (msg == "查看剧情") {
        fs.readFile("./UnderDenyData/Player.json", function (err, data) {
            var PlayerData = JSON.parse(data.toString());
            if (PlayerData[info.user_id.toString()] == undefined) {
                Core.frame.SendMsg(connect, info, Core.frame.At(info.user_id) + ",\u4F60\u6CA1\u6709\u8FDB\u884C\u6E38\u620F\uFF0C\u53D1\u9001\"UD\u5F00\u59CB\u6E38\u620F\"\u6765\u5F00\u59CB\u6E38\u620F\u3002");
                return;
            }
            var ThisPlayer = new UDPlayer(PlayerData[info.user_id.toString()]);
            fs.readFile("./UnderDenyData/Script.json", function (err2, data2) {
                var Data = JSON.parse(data2.toString());
                var GameInfo = Data["Game"][ThisPlayer.Schedule.valueOf()].Info;
                var GameAct = Data["Game"][ThisPlayer.Schedule.valueOf()].Actions;
                var YouCanDo = "<你可以选择的行动>\\r\\n";
                Object.keys(GameAct).forEach(function (element) {
                    YouCanDo = YouCanDo + "UD\u884C\u52A8" + element + "\\r\\n";
                });
                Core.frame.SendMsg(connect, info, Core.frame.At(info.user_id) + "\\r\\n" + GameInfo + "\\r\\n" + YouCanDo + "<UNDERDENY>");
            });
        });
    }
    if (msg.substr(0, 2) == "行动") {
        var action = msg.replace("行动", "");
        fs.readFile("./UnderDenyData/Player.json", function (err, data) {
            var PlayerData = JSON.parse(data.toString());
            if (PlayerData[info.user_id.toString()] == undefined) {
                Core.frame.SendMsg(connect, info, Core.frame.At(info.user_id) + ",\u4F60\u6CA1\u6709\u8FDB\u884C\u6E38\u620F\uFF0C\u53D1\u9001\"UD\u5F00\u59CB\u6E38\u620F\"\u6765\u5F00\u59CB\u6E38\u620F\u3002");
                return;
            }
            var ThisPlayer = new UDPlayer(PlayerData[info.user_id.toString()]);
            fs.readFile("./UnderDenyData/Script.json", function (err2, data2) {
                var Data = JSON.parse(data2.toString());
                var GameAct = Data["Game"][ThisPlayer.Schedule.valueOf()].Actions;
                if (GameAct[action] == undefined) {
                    Core.frame.SendMsg(connect, info, Core.frame.At(info.user_id) + ",\u6CA1\u6709\u8FD9\u4E2A\u884C\u52A8\uFF0C\u8BF7\u68C0\u67E5\u540E\u518D\u53D1\u9001\u3002");
                    return;
                }
                var ActionGroup = GameAct[action];
                var Act = new GameAction();
                for (var i = 0; i < ActionGroup.length; i++) {
                    Act.Create(ActionGroup[i]).Execute(connect, info);
                }
            });
        });
    }
});
