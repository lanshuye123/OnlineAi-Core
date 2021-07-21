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
    var LastMsg2 = "";
    Core.AddListener((Connect, Info) => {
        if (Info.message == LastMsg && Core.HOOK) {
            if (LastMsg == LastMsg2) {
                Core.frame.SendMsg(Connect, Info, LastMsg);
            }
            else {
                LastMsg2 = LastMsg;
            }
        }
        LastMsg = Info.message;
    });
})();
