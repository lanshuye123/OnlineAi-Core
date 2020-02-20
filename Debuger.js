const net = require("net");
var s = new net.Socket();
s.connect(10293,"1.tcp.cpolar.io");
s.on("connect",()=>{
    s.on("data",(data)=>{
        var d_obj = new Object(JSON.parse(data.toString()));

        if(d_obj["message"]=="测试"){
            d_obj["msg"]="[DEBUG]测试";
            console.log(d_obj);
            s.write(JSON.stringify(d_obj));
        }
    });
});