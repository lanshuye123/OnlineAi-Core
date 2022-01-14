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
exports.使用用户保镖 = void 0;
// .i.ts : Interface TS文件
class 数字 extends Number {
}
;
const Core = __importStar(require("./Core"));
exports.使用用户保镖 = ((用户) => {
    var 数据 = Core.frame.ReadSystemConfig("保镖");
    if (数据[用户.valueOf()] == undefined || new Number(数据[用户.valueOf()]).valueOf() < 0) {
        return false;
    }
    else {
        数据[用户.valueOf()] = 数据[用户.valueOf()] - 1;
        Core.frame.WriteSystemConfig("保镖", 数据);
        return true;
    }
});
