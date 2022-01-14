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
exports.Creeper = void 0;
const Core = __importStar(require("./Core"));
exports.Creeper = ["Creeper?", "awwww man!", "So we back in the mine"];
var Creepering = 0;
Core.AddListener((c, info) => {
    if (Creepering != 0) {
        var temp = true;
        if (info.message == exports.Creeper[Creepering]) {
            Core.frame.SendMsg(c, info, exports.Creeper[Creepering + 1]);
            Creepering = Creepering + 2;
            temp = false;
            if (Creepering > exports.Creeper.length) {
                Core.frame.SendMsg(c, info, "The End");
            }
        }
        if (temp) {
            Core.frame.SendMsg(c, info, "有人发送了一个与Creeper无关的消息，Creeper进度已终止!");
            Creepering = 0;
        }
    }
    if (info.message == exports.Creeper[0] && Creepering == 0) {
        Creepering = 1;
        Core.frame.SendMsg(c, info, exports.Creeper[1]);
    }
});
