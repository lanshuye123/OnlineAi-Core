const Core = require("./../../Core");
const fs = require("fs");
exports.add = {
    Interfaces:{
        /*GetPath:function(dir){
            return `./Addons/PVP/${dir}`;
        }*/
    },
    Control:function(connect,message,user,info){
        var msg = new String(message);
        console.log("0");
        if(msg.substr(0,2)=="购买"){
            msg = msg.replace("购买","");
            console.log("1");
            fs.readFile("./Addons/PVP/DataBase.json",(err,data)=>{
                var data_obj = JSON.parse(data.toString())
                if(data_obj["PVP"]["物品"][msg]==undefined){
                    Core.frame.SendMsg(connect,info,"没有这样的物品。");
                    return;
                }
                fs.readFile("./Addons/PVP/UserData.json",(err2,data2)=>{
                    var data2_obj = JSON.parse(data2.toString());
                    if(data2_obj[user]==undefined){
                        Core.frame.SendMsg(connect,info,"没有你的账户，发送\\\"PVP注册\\\"注册账户！");
                        return;
                    }
                    for(var i=0;i<data2_obj[user]["仓库"].length;i++){
                        if(data2_obj[user]["仓库"][i]==msg){
                            Core.frame.SendMsg(connect,info,"你已经有这个物品了");
                            return;
                        }
                    }
                    if(data_obj["PVP"]["物品"][msg]["价格"]==null){
                        Core.frame.SendMsg(connect,info,"这是非卖品");
                        return
                    }
                    if(data2_obj[user]["余额"]<data_obj["PVP"]["物品"][msg]["价格"]){
                        Core.frame.SendMsg(connect,info,"你的PVP代币不足");
                        return;
                    }
                    data2_obj[user]["余额"] = data2_obj[user]["余额"] - data_obj["PVP"]["物品"][msg]["价格"];
                    data2_obj[user]["仓库"][data2_obj[user]["仓库"].length] = msg;
                    fs.writeFile("./Addons/PVP/UserData.json",JSON.stringify(data2_obj),(err3)=>{
                        Core.frame.SendMsg(connect,info,"购买成功");
                    });
                });
            });
        }
        if(msg=="我的物品"){
            fs.readFile("./Addons/PVP/UserData.json",(err,data)=>{
                data_obj = JSON.parse(data.toString());
                if(data_obj[user]==undefined){
                    Core.frame.SendMsg(connect,info,"没有你的账户，发送\\\"PVP注册\\\"注册账户！");
                    return;
                }
                var Str = `你的物品`;
                for(var i=0;i<data_obj[user]["仓库"].length;i++){
                    Str = Str + "\\r\\n" + `${i+1}.`+ data_obj[user]["仓库"][i];
                };
                Core.frame.SendMsg(connect,info,Str);
            });
        }

        if(msg.substr(0,2)=="装备"){
            var item = msg.replace("装备","");
            fs.readFile("./Addons/PVP/UserData.json",(err,data)=>{
                var data_obj = JSON.parse(data.toString());
                if(data_obj[user]==undefined){
                    Core.frame.SendMsg(connect,info,`${Core.frame.At(user)},你暂未注册PVP插件，请发送"PVP注册"。`);
                    return;
                }
                if(data_obj[user]["装备"]==item){
                    Core.frame.SendMsg(connect,info,`${Core.frame.At(user)},你已经装备此物品，请勿重复装备。`);
                    return;
                }
                for(var i=0;i<data_obj[user]["仓库"].length;i++){
                    if(item == data_obj[user]["仓库"][i]){
                        data_obj[user]["装备"] = item;
                        fs.writeFile("./Addons/PVP/UserData.json",JSON.stringify(data_obj),(err)=>{
                            Core.frame.SendMsg(connect,info,`${Core.frame.At(user)},装备物品${item}成功!`);
                            return;
                        });
                        return;
                    }
                }
                Core.frame.SendMsg(connect,info,`${Core.frame.At(user)},你没有物品${item}。`);
                return;
            });
        }

        if(msg=="注册"){
            fs.readFile("./Addons/PVP/UserData.json",(err,data)=>{
                data_obj = new Object(JSON.parse(data.toString()));
                if(data_obj[user]!=undefined){
                    Core.frame.SendMsg(connect,info,"你已经注册了账户。");
                    return;
                }
                data_obj[user]={"余额":1000,"装备":"木制剑","仓库":["木制剑"]}
                fs.writeFile("./Addons/PVP/UserData.json",JSON.stringify(data_obj),(err2)=>{
                    Core.frame.SendMsg(connect,info,"注册成功，获得系统赠送1000枚PVP代币以及一把木制剑。");
                    return;
                });
            });
        }
        if(msg.substr(0,4)=="查看物品"){
            msg = msg.replace("查看物品","");
            msg = msg.replace("[CQ:at,qq=","");
            msg = msg.replace(" ","");
            msg = msg.replace("]","");
            fs.readFile("./Addons/PVP/UserData.json",(err,data)=>{
                data_obj = new Object(JSON.parse(data.toString()));
                if(data_obj[msg]==undefined){
                    Core.frame.SendMsg(connect,info,`${Core.frame.At(msg)}没有注册PVP。`);
                    return;
                }
                var Str = `${Core.frame.At(msg)}的物品`;
                for(var i=0;i<data_obj[msg]["仓库"].length;i++){
                    Str = Str + "\\r\\n" + `${i+1}.`+ data_obj[msg]["仓库"][i];
                };
                Core.frame.SendMsg(connect,info,Str);
            });
        }
        if(msg.substr(0,2)=="对战"){
            msg = msg.replace("对战","");
            msg = msg.replace("[CQ:at,qq=","");
            msg = msg.replace(" ","");
            msg = msg.replace("]","");
            if(user==msg){
                Core.frame.SendMsg(connect,info,"不能和自己进行PVP!");
                return;
            }
            if(msg=="2142562417"){
                Core.frame.SendMsg(connect,info,"萌萌还不会PVP呢");
                return;
            }
            fs.readFile("./Addons/PVP/UserData.json",(err,data)=>{
                data_obj = new Object(JSON.parse(data.toString()));
                if(data_obj[user]==undefined){
                    Core.frame.SendMsg(connect,info,`你没有注册PVP。`);
                    return;
                }
                if(data_obj[msg]==undefined){
                    Core.frame.SendMsg(connect,info,`${Core.frame.At(msg)}没有注册PVP。`);
                    return;
                }
                if(data_obj[user]["Playing"]!=undefined&&data_obj[user]["Playing"]!=-1){
                    Core.frame.SendMsg(connect,info,`你正与其他人PVP中。`);
                    return;
                }
                if(data_obj[msg]["Playing"]!=undefined&&data_obj[msg]["Playing"]!=-1){
                    Core.frame.SendMsg(connect,info,`${Core.frame.At(msg)}正在与其他人PVP中。`);
                    return;
                }
                if(data_obj[user]["Saving"]==true){
                    Core.frame.SendMsg(connect,info,`你在保护状态中，不可PVP，发送\\"PVP解除保护\\"来结束保护`);
                    return;
                }
                if(data_obj[msg]["Saving"]==true){
                    Core.frame.SendMsg(connect,info,`${Core.frame.At(msg)}正处于保护状态中。`);
                    return;
                }
                data_obj["#PVPROOM"][data_obj["#PVPROOM"].length] = {"P1":{"ID":user.toString(),"HP":100,"Hold":"Attacked"},"P2":{"ID":msg.toString(),"HP":100,"Hold":"Attacked"}};
                data_obj[user]["Playing"] = data_obj["#PVPROOM"].length-1;
                data_obj[msg]["Playing"] = data_obj["#PVPROOM"].length-1;
                fs.writeFile("./Addons/PVP/UserData.json",JSON.stringify(data_obj),(err)=>{
                    Core.frame.SendMsg(connect,info,"PVP设定完成，发送相关PVP指令来进行PVP吧。");
                });
            });
        }
        if(msg=="攻击"){
            fs.readFile("./Addons/PVP/UserData.json",(err,data)=>{
                data_obj = new Object(JSON.parse(data.toString()));
                if(data_obj[user]["Playing"]!=undefined&&data_obj[user]["Playing"]!=-1){
                    //DoNothing();
                }else{
                    Core.frame.SendMsg(connect,info,`${Core.frame.At(user)}，你没有进行PVP!`);
                    return;
                }
                var room = data_obj["#PVPROOM"][data_obj[user]["Playing"]];

                if(room["P1"]["ID"]==user){
                    var thisPlayerID = "P1";
                    var OtherPlayerID = "P2";
                }
                if(room["P2"]["ID"]==user){
                    var OtherPlayerID = "P1";
                    var thisPlayerID = "P2";
                }

                if(room[thisPlayerID]["Hold"]!="Attacked"){
                    Core.frame.SendMsg(connect,info,`${Core.frame.At(user)},你已经攻击过了;请等待其他玩家攻击。`);
                    return;
                }else{
                    room[thisPlayerID]["Hold"]="DoAttacked";
                }
                if(room[OtherPlayerID]["Hold"]!="Attacked"){
                    room[thisPlayerID]["Hold"]="Attacked";
                    room[OtherPlayerID]["Hold"]="Attacked";
                }
                var thisPlayerWeapon = data_obj[user]["装备"];
                fs.readFile("./Addons/PVP/DataBase.json",(err,data2)=>{
                    data2_obj = JSON.parse(data2.toString());
                    var WeaponInfo = data2_obj["PVP"]["物品"][thisPlayerWeapon];
                    if(WeaponInfo["加成"]["我方"]==undefined){
                        var 我方加成 = {"Att":0,"Def":0};
                    }else{
                        var 我方加成 = WeaponInfo["加成"]["我方"];
                    }
                    if(WeaponInfo["加成"]["敌方"]==undefined){
                        var 敌方加成 = {"Att":0,"Def":0};
                    }else{
                        var 敌方加成 = WeaponInfo["加成"]["敌方"];
                    }
                    if(我方加成["Att"]==undefined){
                        我方加成["Att"] = 0;
                    }
                    if(我方加成["Def"]==undefined){
                        我方加成["Def"] = 0;
                    }
                    if(敌方加成["Att"]==undefined){
                        我方加成["Att"] = 0;
                    }
                    if(敌方加成["Def"]==undefined){
                        敌方加成["Def"] = 0;
                    }
                    var 我方总攻击 =Math.floor( 20 * (1 + 0.01 * 我方加成["Att"]) * Math.random() - 5 * (1 + 0.01 * 敌方加成["Def"]) * Math.random() * 0.5);

                    room[OtherPlayerID]["HP"] = new Number(room[OtherPlayerID]["HP"]) - 我方总攻击;
                    console.log("A");
                    var Umsg = `${Core.frame.At(user)},你使用了${thisPlayerWeapon}对${Core.frame.At(room[OtherPlayerID]["ID"])}进行打击，扣除对方${我方总攻击}点血量，对方剩余${room[OtherPlayerID]["HP"]}`
                    console.log("B");
                    console.log("HPI");
                    console.log(new Number(room[OtherPlayerID]["HP"]));
                    console.log(new Number(room[OtherPlayerID]["HP"]).valueOf()>0);
                    if(!(new Number(room[OtherPlayerID]["HP"]).valueOf()>0)){
                        console.log("HPI");
                        console.log(new Number(room[OtherPlayerID]["HP"]));
                        var temp = data_obj[user]["Playing"];
                        data_obj[user]["Playing"] = undefined;
                        data_obj[room[OtherPlayerID]["ID"]]["Playing"] = undefined;
                        Umsg = `${Umsg}\\r\\n${Core.frame.At(user)},${Core.frame.At(room[OtherPlayerID]["ID"])}已战败。`;
                        data_obj[room[OtherPlayerID]["ID"]]["Saving"] = true;
                        room = {};
                        data_obj["#PVPROOM"][temp] = room;
                    }
                    console.log("C");
                    data_obj["#PVPROOM"][data_obj[user]["Playing"]] = room;
                    fs.writeFile("./Addons/PVP/UserData.json",JSON.stringify(data_obj),(err)=>{
                        Core.frame.SendMsg(connect,info,`${Umsg}\\r\\nPVP信息保存成功!\\r\\nPVP插件作者:蓝树叶`); 
                        console.log("E");
                    });
                    console.log("D");
                });
            });
        }
        if(msg=="删档"){
            if(!require("./../../Debug.js").add.Interfaces.IsAdmin(user)){
                Core.frame.SendMsg(connect,info,"只有管理员才有权执行此命令。");
                return;
            }
            fs.readFile("./Addons/PVP/UserData.json",(err,data)=>{
                data_obj = JSON.parse(data.toString());
                data_obj["#PVPROOM"] = [];
                fs.writeFile("./Addons/PVP/UserData.json",JSON.stringify(data_obj),(err)=>{
                    Core.frame.SendMsg(connect,info,"删除临时数据完成!");
                });
            });
        }
        if(msg=="投降"){
            fs.readFile("./Addons/PVP/UserData.json",(err,data)=>{
                var data_obj = JSON.parse(data.toString());
                if(data_obj[user]==undefined){
                    Core.frame.SendMsg(connect,info,`你没有注册PVP。`);
                    return;
                }
                if(data_obj[user]["Playing"]==undefined){
                    Core.frame.SendMsg(connect,info,`你没有进行PVP。`);
                    return;
                }
                var P1 = data_obj["#PVPROOM"][data_obj[user]["Playing"]]["P1"];
                var P2 = data_obj["#PVPROOM"][data_obj[user]["Playing"]]["P2"];
                data_obj[P1["ID"]]["Playing"] = -1;
                data_obj[P2["ID"]]["Playing"] = -1;
                fs.writeFile("./Addons/PVP/UserData.json",JSON.stringify(data_obj),(err2)=>{
                    Core.frame.SendMsg(connect,info,"投降成功!");
                });
            });
        }
        if(msg=="解除保护"){
            fs.readFile("./Addons/PVP/UserData.json",(err,data)=>{
                var data_obj = JSON.parse(data.toString());
                if(data_obj[user]["Saving"]==true){
                    data_obj[user]["Saving"] = false;
                    fs.writeFile("./Addons/PVP/UserData.json",JSON.stringify(data_obj),(err2)=>{
                        Core.frame.SendMsg(connect,info,"解除保护成功，现在你可以PVP了!");
                    })
                }else{
                    Core.frame.SendMsg(connect,info,"你本来就没有被保护。");
                }
            });
        }
        //Core.frame.SendMsg(connect,info,"PVP插件暂未开发。");
    }
}