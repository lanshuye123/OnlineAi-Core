"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * <利刃后端>
 * 介绍:本后端提供了全新的中文编程方式,
 */
const fs = __importStar(require("fs"));
var APIs = [];
var API = {};
API.Base = {
    Const: {},
    Function: {}
};
API.Config = {
    Name: "[USING NAMESPACE]",
    Author: "OnlineAi"
};
API.Using = {};
exports.更新API = (() => {
    APIs = [];
    fs.readdir("./API/Using/", (err, files) => {
        for (var i = 0; i < files.length; i++) {
            fs.readFile(`./API/Using/${files[i]}`, (err, data) => {
                APIs[APIs.length] = JSON.parse(data.toString());
                APIs.forEach((OAPI) => {
                    Object.keys(OAPI.Base.Const).forEach((Keys) => {
                        API.Base.Const[Keys] = OAPI.Base.Const[Keys];
                    });
                    Object.keys(OAPI.Base.Function).forEach((Keys) => {
                        API.Base.Function[Keys] = OAPI.Base.Function[Keys];
                    });
                    Object.keys(OAPI.Using).forEach((Keys) => {
                        API.Using[Keys] = OAPI.Using[Keys];
                    });
                });
            });
        }
    });
});
exports.更新API();
exports.解析 = ((内容, 收到) => {
    var 返回 = 内容;
    var ConstKeys = Object.keys(API.Base.Const);
    ConstKeys.forEach((Key) => {
        返回 = 返回.replace(new RegExp(`\\[${Key}\\]`, "g"), eval(API.Base.Const[Key]));
    });
    var FunctionKeys = Object.keys(API.Base.Function);
    // 函数预判
    FunctionKeys.forEach((Key) => {
        返回 = 返回.replace(new RegExp(`\\[${Key} `, "g"), `{${Key} `);
    });
    if (返回.indexOf("[") != -1) {
        return "[ERR]DISALLOW CALLING FUNCTIONS OR CONSTS WITHOUT DEFINIE";
    }
    返回 = 返回.replace(/\{/g, "[");
    FunctionKeys.forEach((Key) => {
        var Function = new RegExp(`^\\[${Key} (.*?)\\]$`);
        if (Function.test(返回.valueOf())) {
            Function.exec(返回.valueOf());
            var 处理 = RegExp.$1;
            if (处理.indexOf("[") != -1) {
                处理 = exports.解析(处理, 收到);
            }
            返回 = 返回.replace(Function, eval(`${API.Base.Function[Key]}("${处理}",收到)`));
        }
    });
    return 返回;
});
exports.核心 = ((收到) => {
    var 内容 = 收到.message;
    var 消息 = "";
    Object.keys(API.Using).forEach((value) => {
        if (new RegExp(`^${value}$`).test(内容.valueOf())) {
            var 过程 = API.Using[value];
            消息 = 过程.Content;
            过程.Execute.forEach((v, i) => {
                消息 = 消息.replace(new RegExp(`\\{${i}\\}`, "g"), exports.解析(v, 收到).valueOf());
            });
        }
    });
    return 消息;
});
