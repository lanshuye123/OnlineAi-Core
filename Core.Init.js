"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameCoreClass = __importStar(require("./Core.Class"));
const fs = __importStar(require("fs"));
exports.GameObjectRoots = new Map();
exports.RulesSourceData = JSON.parse(fs.readFileSync("./Rules.json").toString());
exports.RulesSourceDataOfGameObjectRoots = exports.RulesSourceData["GameObject"];
exports.RulesSourceDataOfGameWeapons = exports.RulesSourceData["Weapons"];
Object.keys(exports.RulesSourceDataOfGameObjectRoots).forEach((v) => {
    exports.GameObjectRoots.set(v, new GameCoreClass.GameObjectRoot(exports.RulesSourceDataOfGameObjectRoots[v]));
});
// 弹头是代码里面写好的
GameCoreClass.WeaponsWarhead.set("Standard", new GameCoreClass.GameWeaponWarhead((GOR, GW, ATT) => {
    // 标准武器弹头
    // 被攻击.血量 = 被攻击.血量 - 武器.伤害 * 随机(0.75,1.25)
    GOR.Bind.Health = GOR.Bind.Health.valueOf() - GW.Hurt.valueOf() * (Math.random() + 0.25);
}));
GameCoreClass.WeaponsWarhead.set("Spawner", new GameCoreClass.GameWeaponWarhead((GOR, GW, ATT) => {
    // 生成武器
    var SpawnGameObjectRoot = exports.GameObjectRoots.get(GW.Spawner_SpawnGameObjectRoot.valueOf());
    var Spawn = new GameCoreClass.GameObject(SpawnGameObjectRoot, ATT.Bind.Owner);
}));
GameCoreClass.WeaponsWarhead.set("Kill", new GameCoreClass.GameWeaponWarhead((GOR, GW, ATT) => {
    // 一击毙命
    GOR.Bind.Broken = true;
}));
Object.keys(exports.RulesSourceDataOfGameWeapons).forEach((v) => {
    GameCoreClass.Weapons.set(v, new GameCoreClass.GameWeapon(exports.RulesSourceDataOfGameWeapons[v.valueOf()]));
});
