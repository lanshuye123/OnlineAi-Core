"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Core = __importStar(require("./Core"));
var ZExec = (function (Str) { return ""; });
(function (R, Info) {
    if (R.$1.indexOf("则") == -1) {
        return "行动缺失";
    }
    var k = R.$1.split("则", 2);
    console.log("k:" + k + "k");
    console.log("" + R.$1);
    console.log(ZExec(k[0]));
    console.log(eval(ZExec(k[1])));
    if (eval(ZExec(k[0]))) {
        console.log(ZExec(k[1]));
        return eval(ZExec(k[1]));
    }
    ;
})(RegExp, new Core.InfoType());
