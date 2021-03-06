import * as Core from "./Core";
const CGI = require("./CGI");
(()=>{
    var SendAble = Core.frame.ReadSystemConfig("SendAble") as any;
    var Ks = 1;
    Core.AddListener((c,i)=>{
        if(CGI.HOOK){
            return;
        }
        var delete_msg = ((msgid:Number)=>{
            if(i.group_id != undefined){
                Core.frame.SendMsg(c,i,"[!][警告]有一个未备案消息被发送，请管理员自行验证此消息是否合理。");
            }
        });
        if(!(i.group_id != 588932037)){
            if(SendAble[Core.GetUser(i.user_id)] != true){
                delete_msg(i.message_id);
                Core.frame.Ban(c,i,5*60*Ks);
                Ks = Ks + 1;
                Core.frame.SendMsg(c,i,`${Core.frame.At(Core.GetUser(i.user_id))},你的消息属于未备案消息，请私信Ai发送"备案"来获取消息备案。`);
            }
        }
        if(i.group_id == undefined&&i.message == "备案"){
            SendAble[i.user_id.valueOf()] = true
            Core.frame.WriteSystemConfig("SendAble",SendAble);
            Core.frame.SendMsg(c,i,"你已完成备案。现在你可以在主群中发表你的合理的、合法的、有建设性的意见或建议。");
        }
    });
})()