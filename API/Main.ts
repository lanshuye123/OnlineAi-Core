import * as 利刃 from "./Public";
import * as Core from "./../Core";
const Debug = require("./../Debug");
Core.AddListener((Connect,Info)=>{
    if(Info.message == "更新利刃" && Debug.add.Interfaces.IsAdmin(Info.user_id)){
        利刃.更新API();
        Core.frame.SendMsg(Connect,Info,"[利刃后端]更新成功!")
    }
    var 利刃Ret = 利刃.核心(Info);
    if(利刃Ret != ""){
        Core.frame.SendMsg(Connect,Info,利刃Ret);
    }
});