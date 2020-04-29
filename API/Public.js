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
var fs = __importStar(require("fs"));
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
exports.更新API = (function () {
    APIs = [];
    fs.readdir("./API/Using/", function (err, files) {
        for (var i = 0; i < files.length; i++) {
            fs.readFile("./API/Using/" + files[i], function (err, data) {
                APIs[APIs.length] = JSON.parse(data.toString());
                APIs.forEach(function (OAPI) {
                    Object.keys(OAPI.Base.Const).forEach(function (Keys) {
                        API.Base.Const[Keys] = OAPI.Base.Const[Keys];
                    });
                    Object.keys(OAPI.Base.Function).forEach(function (Keys) {
                        API.Base.Function[Keys] = OAPI.Base.Function[Keys];
                    });
                    Object.keys(OAPI.Using).forEach(function (Keys) {
                        API.Using[Keys] = OAPI.Using[Keys];
                    });
                });
            });
        }
    });
});
exports.更新API();
exports.解析 = (function (内容, 收到) {
    var 返回 = 内容;
    var ConstKeys = Object.keys(API.Base.Const);
    ConstKeys.forEach(function (Key) {
        返回 = 返回.replace(new RegExp("\\[" + Key + "\\]", "g"), eval(API.Base.Const[Key]));
    });
    var FunctionKeys = Object.keys(API.Base.Function);
    // 函数预判
    FunctionKeys.forEach(function (Key) {
        返回 = 返回.replace(new RegExp("\\[" + Key + " ", "g"), "{" + Key + " ");
    });
    if (返回.indexOf("[") != -1) {
        return "[ERR]DISALLOW CALLING FUNCTIONS OR CONSTS WITHOUT DEFINIE";
    }
    返回 = 返回.replace(/\{/g, "[");
    FunctionKeys.forEach(function (Key) {
        var Function = new RegExp("^\\[" + Key + " (.*?)\\]$");
        Function.exec(返回.valueOf());
        var 处理 = RegExp.$1;
        if (处理.indexOf("[") != -1) {
            处理 = exports.解析(处理, 收到);
        }
        返回 = 返回.replace(Function, eval(API.Base.Function[Key] + "(\"" + 处理 + "\",\u6536\u5230)"));
    });
    return 返回;
});
exports.核心 = (function (收到) {
    var 内容 = 收到.message;
    var 消息 = "";
    Object.keys(API.Using).forEach(function (value) {
        if (new RegExp("^" + value + "$").test(内容.valueOf())) {
            var 过程 = API.Using[value];
            消息 = 过程.Content;
            过程.Execute.forEach(function (v, i) {
                消息 = 消息.replace(new RegExp("\\{" + i + "\\}", "g"), exports.解析(v, 收到).valueOf());
            });
        }
    });
    return 消息;
});
