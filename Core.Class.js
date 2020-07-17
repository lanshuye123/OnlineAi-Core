"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
exports.Weapons = new Map();
exports.WeaponsWarhead = new Map();
class GameBlock {
}
exports.GameBlock = GameBlock;
exports.GameBlocks = new Map();
class GameLocation {
}
exports.GameLocation = GameLocation;
class GamePlayer {
    constructor() {
        this.Language = new GameLanguage("zh_cn");
        this.Money = 13000;
        this.Factorys = new Map();
        this.Units = [];
    }
}
exports.GamePlayer = GamePlayer;
class GameLanguage {
    Get(Source) {
        var Result = this.Pack[Source.toString()];
        if (Result) {
            return new String(Result);
        }
        else {
            return new String(Source);
        }
    }
    constructor(Language) {
        this.Language = Language;
        this.Pack = fs.readFileSync(`./Language.${this.Language}.json`);
    }
}
exports.GameLanguage = GameLanguage;
class GameObjectRoot {
    UnderAttack(Weapon, Attacker) {
        if (this.Bind.Broken) {
            return;
        }
        exports.Weapons.get(Weapon.valueOf()).Warhead.Attack(this, exports.Weapons.get(Weapon.valueOf()), Attacker);
        if (this.Health > 0) {
            this.Bind.Broken = true;
        }
    }
    constructor(Loader) {
        const that = Loader;
        //定义 that 为 Loader
        this.Health = new Number(that.Health);
        this.Cost = new Number(that.Cost);
        this.Name = new String(that.Name);
        this.Size = new Number(that.Size);
        this.Weapon = new String(that.Weapon);
        this.Type = new String(that.Type);
        this.BuildAble = new Boolean(that.BuildAble);
    }
}
exports.GameObjectRoot = GameObjectRoot;
class GameObject {
    constructor(Root, Owner) {
        this.Root = new GameObjectRoot(Root);
        this.Root.Bind = this;
        this.Health = this.Root.Health;
        this.Leven = 1;
        this.Owner = Owner;
        this.Owner.Money = this.Owner.Money.valueOf() - this.Root.Cost.valueOf();
        this.Owner.Units[this.Owner.Units.length] = this;
        this.Broken = false;
        if (this.Root.Type.valueOf() != "Building") {
            // this.Location = this.Owner.Factorys.get(this.Root.Type.valueOf())[0].Location;
        }
        // this.Location.Units[this.Location.Units.length] = this;
        // this.Location.UsedSize = this.Location.UsedSize.valueOf() + this.Root.Size.valueOf();
    }
    ;
    Attack(that) {
        if (this.Broken) {
            return;
        }
        that.Root.UnderAttack(this.Root.Weapon, this.Root);
    }
}
exports.GameObject = GameObject;
class GameWeapon {
    constructor(Loader) {
        const that = Loader;
        this.Hurt = that.Hurt;
        this.Warhead = exports.WeaponsWarhead.get(that.Warhead.valueOf());
        this.Spawner_SpawnGameObjectRoot = that.Spawner_SpawnGameObjectRoot;
    }
}
exports.GameWeapon = GameWeapon;
class GameWeaponWarhead {
    Attack(GOR, GW, ATT) {
        // 真的就Empty呗;
        return;
    }
    ;
    constructor(Attack) {
        this.Attack = Attack;
    }
}
exports.GameWeaponWarhead = GameWeaponWarhead;
