const Core = require("./Core");
exports.add={
    InterFaces:{

    },
    Control:function(connect,info){
        if(info["message"]=="Creeper?"){
            Core.frame.SendMsg(connect,info,"awww man!");
        }
        if(info["message"]=="awww man!"){
            Core.frame.SendMsg(connect,info,"So we back in the mine.");
        }
        if(info["message"]=="So we back in the mine."){
            Core.frame.SendMsg(connect,info,"Got  are pickaxr swingin' from side to side");
        }
        if(info["message"]=="Side to Side"){
            Core.frame.SendMsg(connect,info,"Side side to side");
        }
        if(info["message"]=="Side side to Side"){
            Core.frame.SendMsg(connect,info,"Night night diamonds tonight");
        }
        if(info["message"]=="Night night diamonds tonight"){
            Core.frame.SendMsg(connect,info,"Heads up.");
        }
        if(info["message"]=="Heads up."){
            Core.frame.SendMsg(connect,info,"You hear a sound turn around and look up");
        }
    }
}