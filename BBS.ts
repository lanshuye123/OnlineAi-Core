//BBS.js => 提供一个论坛机制
import * as Core from "./Core";
(()=>{
    var BBSCore = {

        GetUserPermission:((User:Number|number,BBS:String)=>{//Get A User's Permission of A BBS Part.


            return;
        }),
    }
    Core.AddListener((connect,info)=>{
        if(info.raw_message.substr(0,3)!="BBS"){
            return;
        }
    });
})();