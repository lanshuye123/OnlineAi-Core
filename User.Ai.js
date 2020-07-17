"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// ORTS For OnlineAi Interface
const CoreClass = __importStar(require("./Core.Class"));
const CoreInit = __importStar(require("./Core.Init"));
const AiCore = __importStar(require("./Core"));
const fs = __importStar(require("fs"));
var ORTSData = {};
var ORTSGameObjectPointer = new Map();
ORTSData.Player = new Map();
if (fs.existsSync("./ORTSDataBase.json")) {
    var ORTSDataBase = JSON.parse(fs.readFileSync("./ORTSDataBase.json").toString());
    Object.keys(ORTSDataBase).forEach((v, i) => {
        ORTSData.Player.set(new Number(v), ORTSData[v]);
    });
}
AiCore.AddListener((AiConnect, AiMessage) => {
    if (AiMessage.message.substr(0, 4) != "ORTS") {
        return;
    }
    var UserData = ORTSData.Player.get(AiCore.GetUser(AiMessage.user_id));
    var Command = AiMessage.message.replace("ORTS", "");
    if (Command == "信息") {
        if (!UserData) {
            AiCore.frame.SendMsg(AiConnect, AiMessage, `${AiCore.frame.At(AiCore.GetUser(AiMessage.user_id))},你没有注册ORTS.`);
        }
        else {
            AiCore.frame.SendMsg(AiConnect, AiMessage, `用户名称:${AiMessage.sender.nickname}\r\n用户资金:${UserData.Money}\r\n用户单位:${UserData.Units.length}`);
        }
        return;
    }
    if (Command.substr(0, 2) == "建造") {
        if (!UserData) {
            AiCore.frame.SendMsg(AiConnect, AiMessage, `${AiCore.frame.At(AiCore.GetUser(AiMessage.user_id))},你没有注册ORTS.`);
            return;
        }
        var BuildingUnitName = Command.replace("建造", "");
        if (!CoreInit.GameObjectRoots.has(BuildingUnitName)) {
            AiCore.frame.SendMsg(AiConnect, AiMessage, `${AiCore.frame.At(AiMessage.user_id)},没有这个单位`);
            return;
        }
        var BuildingGameObjectRoot = CoreInit.GameObjectRoots.get(BuildingUnitName);
        if (UserData.Money < BuildingGameObjectRoot.Cost) {
            AiCore.frame.SendMsg(AiConnect, AiMessage, `${AiCore.frame.At(AiMessage.user_id)},你的资金不足.`);
            return;
        }
        console.log(BuildingGameObjectRoot);
        if (BuildingGameObjectRoot.BuildAble == false) {
            AiCore.frame.SendMsg(AiConnect, AiMessage, `${AiCore.frame.At(AiMessage.user_id)},此单位不可建造`);
            return;
        }
        new CoreClass.GameObject(BuildingGameObjectRoot, UserData);
        AiCore.frame.SendMsg(AiConnect, AiMessage, `${AiCore.frame.At(AiMessage.user_id)},建造完成.`);
    }
    if (Command.substr(0, 2) == "选择") {
        if (!UserData) {
            AiCore.frame.SendMsg(AiConnect, AiMessage, `${AiCore.frame.At(AiCore.GetUser(AiMessage.user_id))},你没有注册ORTS.`);
            return;
        }
        var Chooser = new Number(Command.replace("选择", "")).valueOf();
        if (isNaN(Chooser)) {
            AiCore.frame.SendMsg(AiConnect, AiMessage, `${AiCore.frame.At(AiCore.GetUser(AiMessage.user_id))},请输入一个具体的编号`);
            return;
        }
        if (!UserData.Units[Chooser]) {
            AiCore.frame.SendMsg(AiConnect, AiMessage, `${AiCore.frame.At(AiCore.GetUser(AiMessage.user_id))},没有这个单位`);
            return;
        }
        ORTSGameObjectPointer.set(AiMessage.user_id, UserData.Units[Chooser]);
        AiCore.frame.SendMsg(AiConnect, AiMessage, `${AiCore.frame.At(AiCore.GetUser(AiMessage.user_id))},已选中单位<${UserData.Language.Get(UserData.Units[Chooser].Root.Name)}>`);
    }
    if (Command == "查看") {
        if (!UserData) {
            AiCore.frame.SendMsg(AiConnect, AiMessage, `${AiCore.frame.At(AiCore.GetUser(AiMessage.user_id))},你没有注册ORTS.`);
            return;
        }
        if (!ORTSGameObjectPointer.has(AiMessage.user_id)) {
            AiCore.frame.SendMsg(AiConnect, AiMessage, `${AiCore.frame.At(AiCore.GetUser(AiMessage.user_id))},你没有选中单位`);
            return;
        }
        var UnitStatus = (() => { if (ORTSGameObjectPointer.get(AiMessage.user_id).Broken) {
            return "损毁";
        }
        else {
            return "正常";
        } })();
        AiCore.frame.SendMsg(AiConnect, AiMessage, `选中单位<${UserData.Language.Get(ORTSGameObjectPointer.get(AiMessage.user_id).Root.Name)}>\r\n状态:${UnitStatus}\r\n血量:${ORTSGameObjectPointer.get(AiMessage.user_id).Health}\\${ORTSGameObjectPointer.get(AiMessage.user_id).Root.Health}\r\n等级:${ORTSGameObjectPointer.get(AiMessage.user_id).Leven}`);
        return;
    }
    if (Command == "列表") {
        if (!UserData) {
            AiCore.frame.SendMsg(AiConnect, AiMessage, `${AiCore.frame.At(AiCore.GetUser(AiMessage.user_id))},你没有注册ORTS.`);
            return;
        }
        var Ret = "单位列表:";
        UserData.Units.forEach((v, i) => {
            Ret = Ret + "\r\n" + i + "." + UserData.Language.Get(v.Root.Name) + (() => { if (v.Broken) {
                return "[阵亡]";
            }
            else {
                return "";
            } })();
        });
        AiCore.frame.SendMsg(AiConnect, AiMessage, Ret);
    }
    if (Command.substr(0, 2) == "攻击") {
        if (!UserData) {
            AiCore.frame.SendMsg(AiConnect, AiMessage, `${AiCore.frame.At(AiCore.GetUser(AiMessage.user_id))},你没有注册ORTS.`);
            return;
        }
        var AttackPointer = new Number(Command.replace("攻击", "")).valueOf();
        if (AiCore.frame.GetAt(AiConnect, AiMessage)) {
            AttackPointer = new Number(AiCore.frame.GetAt(AiConnect, AiMessage)).valueOf();
        }
        if (isNaN(AttackPointer)) {
            AiCore.frame.SendMsg(AiConnect, AiMessage, `${AiCore.frame.At(AiCore.GetUser(AiMessage.user_id))},请提供一个用户.`);
            return;
        }
        if (!ORTSGameObjectPointer.has(AiMessage.user_id)) {
            AiCore.frame.SendMsg(AiConnect, AiMessage, `${AiCore.frame.At(AiCore.GetUser(AiMessage.user_id))},你没有选中单位`);
            return;
        }
        if (!ORTSData.Player.has(AttackPointer)) {
            AiCore.frame.SendMsg(AiConnect, AiMessage, `${AiCore.frame.At(AiCore.GetUser(AiMessage.user_id))},这个用户暂未注册ORTS`);
            return;
        }
        var UnderAttacker = ORTSData.Player.get(AttackPointer);
        for (var UnitID = 0; (UnitID < UnderAttacker.Units.length) && (!UnderAttacker.Units[UnitID].Broken); UnitID++) { }
        ORTSGameObjectPointer.get(AiMessage.user_id).Attack(UnderAttacker.Units[UnitID]);
        return;
    }
    if (Command == "注册") {
        UserData = new CoreClass.GamePlayer();
        UserData.Units[0] = new CoreClass.GameObject(CoreInit.GameObjectRoots.get("建造厂"), UserData);
        ORTSData.Player.set(AiCore.GetUser(AiMessage.user_id), UserData);
        AiCore.frame.SendMsg(AiConnect, AiMessage, `${AiCore.frame.At(AiCore.GetUser(AiMessage.user_id))},注册成功`);
        return;
    }
    fs.writeFile("./ORTSDataBase.json", JSON.stringify(ORTSData.Player), (err) => { });
});
