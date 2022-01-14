"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterFaces = exports.赢青 = void 0;
const Core = __importStar(require("./Core"));
var 赢青;
(function (赢青) {
    class 玩家信息 {
        constructor(that) {
            this.位置 = that.位置;
            this.物品 = [];
            for (var i = 0; i < that.物品.length; i++) {
                this.物品[i] = that.物品[i];
            }
        }
    }
    赢青.玩家信息 = 玩家信息;
})(赢青 = exports.赢青 || (exports.赢青 = {}));
exports.InterFaces = {
    获取信息: ((PlayerID) => {
        var InfoData = Core.frame.ReadSystemConfig("赢青设定");
        if (InfoData[PlayerID.valueOf()] != undefined) {
        }
        else {
        }
    })
};
(() => {
    Core.AddListener((c, i) => {
        if (i.message.substr(0, 2) != "赢青") {
            return;
        }
        var C = i.message.replace("赢青", "");
        if (C == "信息") {
            var PlayerData = exports.InterFaces.获取信息(Core.GetUser(i.user_id));
            var message = `<赢青插件>\r\n玩家名:${Core.frame.At(Core.GetUser(i.user_id))}\r\n$当前地图:${void 0}`;
        }
    });
})();
