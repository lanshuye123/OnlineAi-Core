import * as 利刃 from "./Public";
import * as Core from "./../Core";
const Debug = require("./../Debug");
Core.AddListener((Connect,Info)=>{
    if(Info.message == "更新利刃" && Debug.add.Interfaces.IsAdmin(Info.user_id)){
        利刃.更新API();
        Core.frame.SendMsg(Connect,Info,"[利刃后端]更新成功!")
    }
    if(Info.message.substr(0,4) == "利刃执行"){
        if(!Debug.add.Interfaces.IsAdmin(Info.user_id)){
            Core.frame.SendMsg(Connect,Info,"只有Ai管理员才有权使用本指令");
            return;
        }
        var Command = Info.message.replace("利刃执行","").replace(/&#91;/g,"[").replace(/&#93;/g,"]");
        Core.frame.SendMsg(Connect,Info,利刃.解析(Command,Info));
    }
    var 利刃Ret = 利刃.核心(Info);
    if(利刃Ret != ""){
        Core.frame.SendMsg(Connect,Info,利刃Ret);
    }
});