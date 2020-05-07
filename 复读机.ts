import * as Core from "./Core";
(()=>{
    var LastMsg:String = ""
    Core.AddListener((Connect,Info)=>{
        if(Info.message == LastMsg){
            Core.frame.SendMsg(Connect,Info,LastMsg);
        }
        LastMsg = Info.message;
    });
})();