"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// EasyTools : 提供语言分析(不准确)
exports.EasyTools = {
    分析: ((A, B) => {
        var KeyA = A.split("");
        var KeyB = B.split("");
        var EC = 0;
        KeyA.forEach((v, i) => {
            if (KeyB[i + 1] == v || KeyB[i] == v || KeyB[i - 1] == v) {
                EC = EC + 1;
            }
        });
        return (EC / (KeyA.length + KeyB.length) * 2);
    })
};
