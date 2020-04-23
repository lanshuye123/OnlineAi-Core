"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
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
