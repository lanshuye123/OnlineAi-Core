import * as Core from "./Core";
Core.AddListener(((connect,info)=>{
    if(info.message=='RMT'){
        Core.frame.SendMsg(connect,info,"test");
    }
}));