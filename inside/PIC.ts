// Picer
import * as Core from "./../Core"
Core.AddListener((c,i)=>{
    if(i.message.substr(0,3) == "PIC"){
        var u = i.message.replace("PIC","");
        Core.frame.SendURLImg(c, i, `https://pximg.rainchan.win/img?img_id=${u}`);
    }
})