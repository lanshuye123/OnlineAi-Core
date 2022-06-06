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
const Core = __importStar(require("./Core"));
const fs = __importStar(require("fs"));
var GGB = require("node-geogebra");
var Pool = new GGB.GGBPool({ plotters: 1, ggb: 'local' });
var PoolReady = false;
var Plotter;
Pool.ready().then(async () => {
    PoolReady = true;
    Plotter = await Pool.getGGBPlotter;
});
Core.AddListener((c, i) => {
    if (i.message.substring(0, 2) != "绘图") {
        return;
    }
    ;
    var Command = i.message.replace("绘图", "");
    Plotter.evalGGBScript([Command]);
    Core.frame.SendMsg(c, i, "[GeoGeBra]执行完成，正在渲染。");
    Core.frame.SendImg(c, i, "");
    Plotter.export("png").then(function (v) {
        fs.writeFile("/home/pi/AI/temp/img.png", v, () => {
            Core.frame.SendImg(c, i, "/home/pi/AI/temp/img.png");
        });
    });
});
