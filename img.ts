import * as Core from "./Core";
import * as canvas from "canvas";
import * as fs from "fs";
(()=>{
    var con = new canvas.Canvas(100,100);
    var mai = con.getContext("2d");
    mai.fillStyle = "#ffffff";
    mai.fillRect(0,0,100,100);
    mai.fillStyle = "#000000";
    mai.font = "24px '思源宋体'";
    // mai.fillText("天依没了",10,50);
    var Buf = con.toBuffer("image/png");
    fs.writeFile("D:\\APPS\\MIRAI\\plugins\\MiraiAPIHTTP\\images\\1.png",Buf,()=>{

    });
    Core.AddListener((c,i)=>{
        if(i.message == "图片测试"){
            Core.frame.SendImg(c,i,"1.png");
        }
    });
})();