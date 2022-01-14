"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
var Dict = {
    1: 201,
    2: 202,
    3: 203,
    4: 204,
    5: 205,
    6: 206,
    7: 207,
    8: 208,
    9: 209,
    0: 210,
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5,
    f: 6,
    g: 7,
    h: 8,
    i: 9,
    j: 10,
    k: 11,
    l: 12,
    m: 13,
    n: 14,
    o: 15,
    p: 16,
    q: 17,
    r: 18,
    s: 19,
    t: 20,
    u: 21,
    v: 22,
    w: 23,
    x: 24,
    y: 25,
    z: 26,
    A: 101,
    B: 102,
    C: 103,
    D: 104,
    E: 105,
    F: 106,
    G: 107,
    H: 108,
    I: 109,
    J: 110,
    K: 111,
    L: 112,
    M: 113,
    N: 114,
    O: 115,
    P: 116,
    Q: 117,
    R: 118,
    S: 119,
    T: 120,
    U: 121,
    V: 122,
    W: 123,
    X: 124,
    Y: 125,
    Z: 126,
};
(0, fs_1.readFile)("./Main.js", (err, data) => {
    var Code = data.toString("base64");
    Object.keys(Dict).forEach((v, i) => {
        Code = Code.replace(new RegExp(`${v}`, "g"), new String(`${Dict[v]}|`).valueOf());
    });
    (0, fs_1.writeFile)("Safe2", Code, (err) => { });
});
