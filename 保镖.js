"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.Interfaces = void 0;
// 保镖.ts 提供一个为你防护的保镖
const Core = __importStar(require("./Core"));
const Money = require("./Money");
const 保镖配置 = {
    聘请定价: 1000,
    使用次数: 5,
    禁言权重: 25
};
exports.Interfaces = {};
Core.AddListener((connect, info) => {
    if (info.message == "聘请保镖") {
        if (Money.add.Interfaces.GetUserMoney(Core.GetUser(info.user_id)) < 保镖配置.聘请定价) {
            Core.frame.SendMsg(connect, info, `${Core.frame.At(Core.GetUser(info.user_id))},你的余额不足${保镖配置.聘请定价},不能聘请保镖.`);
            return;
        }
        var Data = Core.frame.ReadSystemConfig(`保镖${new Date().getDay()}`);
        var User保镖 = new Number(Data[Core.GetUser(info.user_id)]);
        if (isNaN(User保镖)) {
            User保镖 = 0;
        }
        Money.add.Interfaces.CostUserMoney(Core.GetUser(info.user_id), 保镖配置.聘请定价);
        User保镖 = User保镖 + 保镖配置.使用次数;
        Data[Core.GetUser(info.user_id)] = User保镖;
        Core.frame.WriteSystemConfig(`保镖${new Date().getDay()}`, Data);
        Core.frame.SendMsg(connect, info, `${Core.frame.At(Core.GetUser(info.user_id))},聘请保镖成功,你现在拥有${User保镖}位保镖，花费${保镖配置.聘请定价}C点，还剩${Money.add.Interfaces.GetUserMoney(Core.GetUser(info.user_id))}C点`);
    }
    if (info.message == "保镖状况") {
        var Data = Core.frame.ReadSystemConfig(`保镖${new Date().getDay()}`);
        var User保镖 = new Number(Data[Core.GetUser(info.user_id)]);
        Core.frame.SendMsg(connect, info, `[保镖市场]\r\n聘请价格:${保镖配置.聘请定价}C点\r\n聘请数量:${保镖配置.使用次数}\r\n========\r\n你剩余的保镖:${User保镖}`);
    }
});
