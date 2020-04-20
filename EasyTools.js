"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// EasyTools : 提供语言分析(不准确)
exports.EasyTools = {
    分析: (function (A, B) {
        var KeyA = A.split("");
        var KeyB = B.split("");
        var EC = 0;
        KeyA.forEach(function (v, i) {
            KeyB.forEach(function (v2, i2) {
                if (i2 < i) {
                    return;
                }
                if (v == v2) {
                    EC = EC + 1;
                }
            });
        });
        return (EC / (KeyA.length + KeyB.length) * 2);
    })
};
