//这是Debug用的OnlineAI扩展包，只允许AI管理员使用此扩展包里面的方法
const fs=require("fs");
const Core = require("./Core");
const child_p = require("child_process");
var SandBox = Core.frame.ReadSystemConfig("SandBox");
var Sudo = false;
var Upload = (()=>{
    child_p.spawn("git",["add","."]).on("exit",()=>{
        child_p.spawn("git",["commit","-m",`Auto Upload [${new Date().getTime()}]`]).on("exit",()=>{
            child_p.spawn("git",["push"])
        })
    })
})
exports.add={
    Interfaces:{
        IsAdmin:function(user){
            if(Sudo){
                Sudo = false;
                return true;
            }
            if(!fs.existsSync("./Debug.json")){
                fs.writeFile("./Debug.json",JSON.stringify({}),(err)=>{
                    console.log(`[${new Date().toString()}][Debug.js]加载Debug.json成功!`);
                });
                return false;
            }
            var data = JSON.parse(fs.readFileSync("./Debug.json").toString());
            if(data[user] == true){
                return true;
            }else{
                return false;
            }
        },
        ExecutePython:function(command,info){
            fs.writeFile(".\\ExecuteDir\\Python.py",command,()=>{
                child_p.exec("python .\\ExecuteDir\\Python.py",(err,std)=>{
                    console.error(err);
                    console.log(std);
                    var n = std;
                    for(;n.match("\r\n");){
                        n = n.replace("\r\n","\r\n");
                    }
                    Core.frame.SendMsg(Core.connect,info,n);
                })
            });
        },
        ExecuteCmd:function(command,info){
            fs.writeFile(".\\ExecuteDir\\cmd.cmd",command,()=>{
                child_p.exec(".\\ExecuteDir\\cmd.cmd",(err,std)=>{
                    console.error(err);
                    console.log(std);
                    var n = std;
                    for(;n.match("\r\n");){
                        n = n.replace("\r\n","\r\n");
                    }
                    Core.frame.SendMsg(Core.connect,info,n);
                })
            });
        },
        ExecutePHP:function(command,info){
            fs.writeFile(".\\ExecuteDir\\PHP.PHP",command,()=>{
                child_p.exec("PHP-win.exe .\\ExecuteDir\\PHP.PHP",(err,std)=>{
                    console.error(err);
                    console.log(std);
                    var n = std;
                    for(;n.match("\r\n");){
                        n = n.replace("\r\n","\\r\\n");
                    }
                    Core.frame.SendMsg(Core.connect,info,n);
                })
            });
        },
		RetValue:((Str,info)=>{
			var Str2 = new String(Str);
            var data_obj = new Object(JSON.parse(fs.readFileSync("./MessCode.json").toString()));
            console.log(data_obj);
            var keys = Object.keys(data_obj);
            var ZExec = exports.add.Interfaces.RetValue;
            var temp0 = [];
            for(var i=0;i<keys.length;i++){
                temp0[i] = new RegExp(`\\[${keys[i]}\\]`,"g");
                console.log(temp0[i])
                if(temp0[i].test(Str2)){
                    console.log(temp0[i].exec(Str2));
                    console.log(Str2);
                    console.log(RegExp)
                    temp0[i].exec(Str2);
                    try{
                        eval(`var temp1 = ${data_obj[keys[i]]}`);
                        Str2 = Str2.replace(temp0[i],temp1);
                    }catch(err){
                        console.error(err);
                        Str2 = err;
                    }
                }
            }
			return Str2;
		})
    },
    Control:function(connect,info){
        const Debug = {
            log:function(msg){
                msg = new String(msg);
                msg = msg.replace("\n","\r\n");
                Core.frame.SendMsg(connect,info,msg);
                console.log("["+new Date().toString()+"][Debug.js]"+msg);
            },
            SaveVar:function(){
                var n = Object.keys(SandBox);
                for(var i=0;i<n.length;i++){
                    SandBox[n[i]]=SandBox[n[i]].toString();
                };
                Core.frame.WriteSystemConfig("SandBox",SandBox);
            },
            LoadVar:function(){
                SandBox = Core.frame.ReadSystemConfig("SandBox");
                var n = Object.keys(SandBox);
                for(var i=0;i<n.length;i++){
                    if(new String(SandBox[n[i]]).substr(0,8)=="function"){
                        eval("SandBox[\""+n[i]+"\"] = "+SandBox[n[i]]); 
                    }
                };
            },
            AddMoney:function(user,money){
                require("./Money").add.Interfaces.GiveUserMoney(user,money);
                Debug.log("[Debug.js]指令执行完毕。")
            },
            ExecutePython:function(command){
                exports.add.Interfaces.ExecutePython(command,info);
            },
            ExecuteCmd:function(command){
                exports.add.Interfaces.ExecuteCmd(command,info);
            },
            ExecutePHP:function(command){
                exports.add.Interfaces.ExecutePHP(command,info);
            },
        }
        global.Debug = Debug
        //console.log("["+new Date().toString()+"][Debug.js]正在处理");
        Debug.LoadVar();
        var Temp1 = new String(info["raw_message"]);
        if(Temp1 == "AI管理员"){
            var data = new Object(JSON.parse(fs.readFileSync("./Debug.json").toString()));
            var aia = Object.keys(data);
            var message = "目前有权管理AI的人员如下:";
            for(var i=0;i<aia.length;i++){
                message = message  + "\r\n" + `${i+1}.` +aia[i];
            }
            Core.frame.SendMsg(connect,info,message);
        }

        if(Temp1=="获取更新"){
            if(!exports.add.Interfaces.IsAdmin(Core.GetUser(info["user_id"]))){
                Core.frame.SendMsg(connect,info,"此功能只允许机器人管理员使用。");
                return;
            }
            (()=>{
                child_p.spawn("git",["pull"]).stdout.on("data",(c)=>{
                    Debug.log(c);
                    process.exit(0);
                })
            })
            Debug.log("获取更新成功!");
        }

        if(Temp1 == "管理员授权"){
            if(exports.add.Interfaces.IsAdmin(Core.GetUser(info["user_id"]))){
                Sudo = true;
                Core.frame.SendMsg(connect,info,"[DEBUG]已进行授权!");
            }else{
                Core.frame.SendMsg(connect,info,"[DEBUG]未进行授权!理由:非管理员身份");
            }
        }

        if(Temp1=="重启Ai"){
            if(!exports.add.Interfaces.IsAdmin(Core.GetUser(info["user_id"]))){
                Core.frame.SendMsg(connect,info,"此功能只允许机器人管理员使用。");
                return;
            }
            Debug.log("RESTARTING!");
            process.exit(0);
        }

        if(Temp1.substr(0,4)=="执行代码"){
            if(!exports.add.Interfaces.IsAdmin(Core.GetUser(info["user_id"]))){
                Core.frame.SendMsg(connect,info,"此功能只允许机器人管理员使用。");
                return;
            }
            var command = Temp1.replace("执行代码","");
            command = command.replace("&#91;","[");
            command = command.replace("&#93;","]");
            command = command.replace("&amp;","&");
            var time = process.uptime();
            var Ret = "";

            new Promise(()=>{
                var Ret = [];
                try{
                    Ret = eval(command);
                }catch(error){
                    Core.frame.SendMsg(connect,info,error);
                    console.log(error);
                }
                var te2 = process.uptime() - time;
                Debug.SaveVar();
                Core.frame.SendMsg(connect,info,`指令执行完毕，共耗时${te2}秒。返回结果${Ret}`);
                return void 0;
            }).catch((reason)=>{
                Core.frame.SendMsg(connect,info,reason);
                console.log(reason);
            });
            
        };

        if(Temp1 == "说明书"||Temp1 == "用户手册"||Temp1 == "帮助"){
            Core.frame.SendMsg(connect,info,`https://docs.qq.com/doc/DRXNQU0ZtRlVBSFpn`);
        }

        if(!fs.existsSync("./Message.json")){
            fs.writeFile("./Message.json",JSON.stringify({}),(err)=>{
                console.log(`[${new Date().toString()}][Debug.js]Message.json创建完毕。`)
            });
        }
        if(!fs.existsSync("./MessCode.json")){
            fs.writeFile("./MessCode.json",JSON.stringify({"[时间:时]":"new Date().getHours()"}),(err)=>{
                console.log(`[${new Date().toString()}][Debug.js]MessCode.json创建完毕。`)
            });
        }
        fs.readFile("./Message.json",(err,data)=>{
            var data2 = JSON.parse(data.toString());
            Object.keys(data2).forEach((v,i) => {
                var Width = require("./EasyTools").EasyTools.分析(v,info["message"]);
                if(Width > 0.5 && Width < 1.5){
                    Core.frame.SendMsg(connect,info,exports.add.Interfaces.RetValue(data2[v],info));
                }
            });
        });

        if(Temp1.substr(0,3)=="指令+"){
            Core.frame.SetHOOK(true);
            if(!exports.add.Interfaces.IsAdmin(Core.GetUser(info["user_id"]))){
                Core.frame.SendMsg(connect,info,"此功能只允许机器人管理员使用。");
                return;
            }
            Temp1 = Temp1.replace("指令+","");
            Temp1 = Temp1.replace(/&#91;/g,"[");
            Temp1 = Temp1.replace(/&#93;/g,"]");
            Temp2 = Temp1.split("+",2);
            Core.frame.SetHOOK(true);
            fs.readFile("./Message.json",(err,data)=>{
                var data2 = JSON.parse(data.toString());
                data2[Temp2[0]] = Temp2[1];
                fs.writeFile("./Message.json",JSON.stringify(data2),()=>{
                    Core.frame.SendMsg(connect,info,"指令创建完毕。");
                });
            });
        }
        if(Temp1.substr(0,3)=="指令-"){
            Core.frame.SetHOOK(true);
            if(!exports.add.Interfaces.IsAdmin(Core.GetUser(info["user_id"]))){
                Core.frame.SendMsg(connect,info,"此功能只允许机器人管理员使用。");
                return;
            }
            Temp1 = Temp1.replace("指令-","");
            fs.readFile("./Message.json",(err,data)=>{
                var data2 = JSON.parse(data.toString());
                data2[Temp1] = undefined;
                Core.frame.SendMsg();
                fs.writeFile("./Message.json",JSON.stringify(data2),()=>{
                    Core.frame.SendMsg(connect,info,"指令删除完毕。");
                });
            });
        }
    }
}
setInterval(Upload,6*60*60*1000)