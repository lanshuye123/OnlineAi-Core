//固定资产
const fs=require("fs");
const Core = require("./Core");
const Money = require("./Money");
fs.exists("./Data",(ex)=>{
    if(!ex){
        fs.mkdir("./Data");
    }
})
fs.exists("./Data/公会.json",(ex)=>{
    if(!ex){
        fs.writeFile("./Data/公会.json",JSON.stringify({}),(err)=>{
            console.log(`[${new Date().toString()}][${module.filename}]创建公会档案记录。`)
        });
    }
});
exports.add={
    Interfaces:{
        GetUserPublic:function(UserID){
            var data = Core.frame.ReadSystemConfig("公会系统");
            if(data[UserID]==undefined||null||NaN){
                return "[无工会]";
            }else{
                return data[UserID];
            }
            
        },
        SetUserPublic:function(UserID,公会){
            var data = Core.frame.ReadSystemConfig("公会系统");
            data[UserID] = 公会;
            Core.frame.WriteSystemConfig("公会系统",data);
            return;
        },
        CreatePublic:function(info,gh){
            公会 = gh[0]
            var data = JSON.parse(fs.readFileSync("./Data/公会.json").toString());
            data[公会]={};
            data[公会]["Name"] = 公会;
            data[公会]["Owner"] = Core.GetUser(info["user_id"]);
            data[公会]["Admin"] = {};
            data[公会]["Admin"][Core.GetUser(info["user_id"])] = true;
            data[公会]["Higher"] = gh[1];
            data[公会]["Info"] = "暂无介绍";
            if(info["group_id"]!=undefined){
                data[公会]["CreationByGroup"] = info["group_id"];
            }else{
                data[公会]["CreationByGroup"] = "暂无";
            }
            data[公会]["Downer"] = [];
            fs.writeFileSync("./Data/公会.json",JSON.stringify(data));
            var data2 = Core.frame.ReadSystemConfig("公会系统");
            data2[Core.GetUser(info["user_id"])] = 公会;
            Core.frame.WriteSystemConfig("公会系统",data2);
        },
        GetPublicInfo:function(公会){
            if(!exports.add.Interfaces.IsPublic(公会)){return `${false}`;}
            var data = JSON.parse(fs.readFileSync("./Data/公会.json").toString());
            var br = "\\r\\n"
            var info = `公会名称:${data[公会]["Name"]}${br}会长:${data[公会]["Owner"]}${Core.frame.At(data[公会]["Owner"])}${br}介绍:${data[公会]["Info"]}${br}交流群:${data[公会]["CreationByGroup"]}`;
            return info;
        },
        IsPublic:function(公会){
            var data =JSON.parse(fs.readFileSync("./Data/公会.json").toString());
            if(data[公会]!=undefined||NaN||null){
                return true;
            }else{
                return false;
            }
        },
        SetPublicValue:function(公会,Key,Value){
            fs.readFile("./Data/公会.json",(err,data)=>{
                d2 = JSON.parse(data.toString());
                d2[公会][Key] = Value;
                fs.writeFile("./Data/公会.json",JSON.stringify(d2),()=>{

                });
            });
        },
        GetPublicValue:function(公会,Key){
            console.log(公会);
            console.log(Key);
            var data = JSON.parse(fs.readFileSync("./Data/公会.json").toString());
            console.log(data);
            return data[公会][Key];
        },
        GetuserLeven:function(公会,user){
            console.log(公会);
            console.log(user);
            var data = JSON.parse(fs.readFileSync("./Data/公会.json").toString());
            console.log(data);
            if(user == data[公会]["Owner"]){
                return 3;//公会会长
            };
            var od = new Object(data[公会]["Admin"]);
            for(var i=0;i<Object.keys(od).length;i++){
                if(user == Object.keys(od)[i]){
                    return 2;//公会管理员
                }
            }
            if(exports.add.Interfaces.GetUserPublic(user) == 公会){
                return 1;//公会成员
            }
            return 0;//有啥关?没啥关!!!
        }
    },
    Control:function(connect,info){
        //console.log("["+new Date().toString()+"][公会系统.js]正在处理");
        var data = Core.frame.ReadSystemConfig("领工资");
        const date = new Date();
        var msg = new String(info["raw_message"]);
        if(msg=="领工资"){
            if(data[Core.GetUser(info["user_id"])]==date.getFullYear().toString()+date.getMonth().toString()+date.getDay().toString()){
                Core.frame.SendMsg(connect,info,Core.frame.At(Core.GetUser(info["user_id"]))+"已领过工资了!");
            }else{
                Money.add.Interfaces.GiveUserMoney(Core.GetUser(info["user_id"]),500);
                Core.frame.SendMsg(connect,info,Core.frame.At(Core.GetUser(info["user_id"]))+"领工资成功，获得500RMB，当前余额"+Money.add.Interfaces.GetUserMoney(Core.GetUser(info["user_id"])));
                data[Core.GetUser(info["user_id"])]=date.getFullYear().toString()+date.getMonth().toString()+date.getDay().toString();
	Core.frame.WriteSystemConfig("领工资",data);
            };
        };
        if(msg.substr(0,4)=="创建公会"){
            if(Money.add.Interfaces.GetUserMoney(Core.GetUser(info["user_id"]))<5000){
                Core.frame.SendMsg(connect,info,"您的余额不足5000，无法创建公会！");
            }else{
                if(exports.add.Interfaces.GetUserPublic(Core.GetUser(info["user_id"]))!="[无工会]"){
                    Core.frame.SendMsg(connect,info,"您已经加入了一个公会！");
                }else{
                    var n = msg.replace("创建公会","");
                    n2 = n.split("+");
                    if(n.length==0){
                        Core.frame.SendMsg(connect,info,"请输入公会名称");
                    }else{
                        if(exports.add.Interfaces.IsPublic(n)){
                            Core.frame.SendMsg(connect,info,"此公会已存在，请输入别的公会名称");
                        }else{
                            exports.add.Interfaces.CreatePublic(info,n2);
                            Core.frame.SendMsg(connect,info,Core.frame.At(Core.GetUser(info["user_id"]))+",创建公会成功！");
                        }
                    }
                }
            }
        };
        if(msg=="公会列表"){
            var data = JSON.parse(fs.readFileSync("./Data/公会.json").toString());
            var o = Object.keys(data);
            var f="公会列表如下:";
            for(var i=0;i<o.length;i++){
                f = f +"\\r\\n" + (i+1) + "." + o[i]
            }
            Core.frame.SendMsg(connect,info,f);
        };
        if(msg.substr(0,4)=="加入公会"){
            if(exports.add.Interfaces.GetUserPublic(Core.GetUser(info["user_id"]))!="[无工会]"){
                Core.frame.SendMsg(connect,info,"您已经加入了一个公会！");
            }else{
                var n = msg.replace("加入公会","");
                if(n.length==0){
                    Core.frame.SendMsg(connect,info,"请输入公会名称");
                }else{
                    exports.add.Interfaces.SetUserPublic(Core.GetUser(info["user_id"]),n);
                    Core.frame.SendMsg(connect,info,Core.frame.At(Core.GetUser(info["user_id"]))+",加入公会成功！");
                }
            }
        };
        if(msg=="查看我的公会"){
            console.log(exports.add.Interfaces.GetUserPublic(Core.GetUser(info["user_id"])));
            Core.frame.SendMsg(connect,info,exports.add.Interfaces.GetPublicInfo(exports.add.Interfaces.GetUserPublic(Core.GetUser(info["user_id"]))));
        };
        if(msg=="退出公会"){
            exports.add.Interfaces.SetUserPublic(Core.GetUser(info["user_id"]),"[无工会]");
            Core.frame.SendMsg(connect,info,Core.frame.At(Core.GetUser(info["user_id"]))+",退出公会成功！");
        };
        if(msg.substr(0,4)=="查看公会"){
            var n = msg.replace("查看公会","");
            if(n.length==0){
                Core.frame.SendMsg(connect,info,"请输入公会名称");
            }else{
                Core.frame.SendMsg(connect,info,exports.add.Interfaces.GetPublicInfo(n));
            }
        };
        if(msg.substr(0,6)=="设置公会简介"){
            var n = msg.replace("设置公会简介","");
            if(n.length==0){
                Core.frame.SendMsg(connect,info,"请输入简介内容");
            }else{
                if(exports.add.Interfaces.GetuserLeven(exports.add.Interfaces.GetUserPublic(Core.GetUser(info["user_id"])))>=2){
                    Core.frame.SendMsg(connect,info,"你不是公会管理员");
                }
                exports.add.Interfaces.SetPublicValue(exports.add.Interfaces.GetUserPublic(Core.GetUser(info["user_id"])),"Info",n);
                Core.frame.SendMsg(connect,info,"设置完毕");
            }
        };
        if(msg.substr(0,6)=="设置公会管理"){
            var n = msg.replace("设置公会管理","");
            n = n.replace("[CQ:At,qq=","");
            n = n.replace("]","");
            n = n.replace(" ","");
            if(exports.add.Interfaces.GetuserLeven(exports.add.Interfaces.GetUserPublic(Core.GetUser(info["user_id"])),Core.GetUser(info["user_id"])) == 3){
                var data = exports.add.Interfaces.GetPublicValue(exports.add.Interfaces.GetUserPublic(Core.GetUser(info["user_id"])),"Admin");
                data[n] = true;
                exports.add.Interfaces.SetPublicValue(exports.add.Interfaces.GetUserPublic(Core.GetUser(info["user_id"])),"Admin",data);
                Core.frame.SendMsg(connect,info,"设置完毕");
            }else{
                Core.frame.SendMsg(connect,info,"必须公会会长才可以设置管理员");
            }
        }
    }
}