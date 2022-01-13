import * as Core from "./Core"
var GGB = require("node-geogebra")
var Pool = new GGB.GGBPool({plotters:1,ggb:'local'});
var PoolReady:Boolean = false;
var Plotter:any;
(Pool.ready() as Promise<void>).then(async ()=>{
    PoolReady = true;
    Plotter = await (Pool.getGGBPlotter as Promise<any>)
});
Core.AddListener((c,i)=>{
    if(i.message.substring(0,2)!="绘图"){return};
    var Command = i.message.replace("绘图","");
    Plotter.evalGGBScript([Command]);
    Core.frame.SendMsg(c,i,"[GeoGeBra]执行完成，正在渲染。");
    Core.frame.SendImg(c,i,``);
    (Plotter.export64("png") as Promise<string>).then((v)=>{
        Core.frame.SendImg(c,i,`dara:image/png;${v}`);
    })
})