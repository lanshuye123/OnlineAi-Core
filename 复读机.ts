import * as Core from "./Core";
(()=>{
    var LastMsg:String = "";
	var LastMsg2:String = "";
    Core.AddListener((Connect,Info)=>{
        if(Info.message == LastMsg && Core.HOOK){
			if(LastMsg == LastMsg2){
				Core.frame.SendMsg(Connect,Info,LastMsg);	
			}else{
				LastMsg2 = LastMsg;
            }
        }
        LastMsg = Info.message;
    });
})();