// Picer
import * as Core from "../Core"
Core.AddListener((c,i)=>{
    if(i.message.substr(0,3) == "PIC"){
        var u = i.message.replace("PIC","");
        Core.frame.SendImg(c,i,`https://pixiv.cat/${u}.jpg`);
    }
})