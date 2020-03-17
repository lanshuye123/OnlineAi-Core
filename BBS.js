"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
//BBS.js => 提供一个论坛机制
var Core = __importStar(require("./Core"));
(function () {
    var BBSCore = {
        GetUserPermission: (function (User, BBS) {
            return;
        }),
    };
    Core.AddListener(function (connect, info) {
        if (info.raw_message.substr(0, 3) != "BBS") {
            return;
        }
    });
})();
