"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Core = __importStar(require("./Core"));
(() => {
    var LastMsg = "";
    Core.AddListener((Connect, Info) => {
        if (Info.message == LastMsg) {
            Core.frame.SendMsg(Connect, Info, LastMsg);
        }
        LastMsg = Info.message;
    });
})();
