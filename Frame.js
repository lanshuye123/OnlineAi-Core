const Core = require("./Core");
const net = require("net");
var ES_Server;
var ES_Socket = [/*new net.Socket()*/];
exports.add = {
    Interfaces:{
        
    },
    Init:function(connect){
        ES_Server = new net.Server();
        ES_Server.on("connection",(socket)=>{
            ES_Socket[ES_Socket.length] = socket
            socket.on("data",(data)=>{
                var data_obj = JSON.parse(data.toString());
                Core.frame.SendMsg(connect,data_obj,data_obj["msg"]);
            });
            socket.on("end",()=>{
                socket.end();
            });
            socket.on("close",()=>{
                socket.end();
            });
            socket.on("error",(err)=>{
                //console.log(err);
            });
        });
        ES_Server.listen(9632,"0.0.0.0");
    },
    Control:function(connect,info){
        for(var i=0;i<ES_Socket.length;i++){
            if(ES_Socket[i].readable){
                ES_Socket[i].write(JSON.stringify(info));
            }
        }
    }
}