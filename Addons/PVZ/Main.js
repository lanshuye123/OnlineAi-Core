const Core = require("./../../Core");
const fs = require("fs");
const efs = function(dir,info,call){
    console.log(`写入${info}到${dir}`);
    fs.writeFile(dir,info,call);
}
var PVZStart = false;
var GameMain = function(connect,info){
    var data_obj = JSON.parse(fs.readFileSync("./Addons/PVZ/GameData.json").toString());
    for(var i=0;i<64;i++){
        if(data_obj["Area"][i]==undefined){
            data_obj["Area"][i] = {};
        }
        var temp = data_obj["Area"][i]
        if(temp!=undefined){
            if(temp["Plant"]!=undefined&&temp["Plant"]!="NoThing"){
                for(var j=0;j<temp["Plant"]["Weapon"].length;j++){
                    if(temp["Plant"]["Weapon"][j]["LastTimer"]!=0&&temp["Plant"]["Weapon"][j]["LastTimer"]!=undefined){
                        temp["Plant"]["Weapon"][j]["LastTimer"] = temp["Plant"]["Weapon"][j]["LastTimer"] - 1;
                    }else{
                        temp["Plant"]["Weapon"][j]["LastTimer"] = temp["Plant"]["Weapon"][j]["Timer"];
                        if(temp["Plant"]["Weapon"][j]["Type"]=="Launcher"){
                            var k= Math.floor(i/8);
                            for(var n=0;n<8;n++){
                                if(data_obj["Area"][k*8+n]["Zombie"]!=undefined){
                                    data_obj["Area"][k*8+n]["Zombie"]["HP"] = data_obj["Area"][k*8+n]["Zombie"]["HP"] - temp["Plant"]["Weapon"][j]["Settings"]["Hurt"];
                                    if(data_obj["Area"][k*8+n]["Zombie"]["HP"]<0){
                                        Core.frame.SendMsg(connect,info,`位于${i}的${temp["Plant"]["Name"]}击败了位于${k*8+n}的${data_obj["Area"][k*8+n]["Zombie"]["Name"]}`);
                                        data_obj["Area"][k*8+n]["Zombie"] = undefined;
                                    }
                                }
                            }
                        }
                        if(temp["Plant"]["Weapon"][j]["Type"]=="PowerMaker"){
                            data_obj["Power"] = data_obj["Power"] + temp["Plant"]["Weapon"][j]["Settings"]["Count"];
                        }
                    }
                }
            }
            if(temp["Zombie"]!=undefined){
                if(temp["Zombie"]["MoveTimer"]!=undefined&&temp["Zombie"]["MoveTimer"]!=0){
                    temp["Zombie"]["MoveTimer"] = temp["Zombie"]["MoveTimer"] - 1;
                }else{
                    temp["Zombie"]["MoveTimer"] = temp["Zombie"]["Speed"];
                    var k=Math.floor(i/8)*8;
                    if(i-1<k){
                        Core.frame.SendMsg(connect,info,`位于${i}的僵尸进入你的家。`);
                    }else{
                        data_obj["Area"][i-1]["Zombie"] = temp["Zombie"];
                        temp["Zombie"] = undefined;
                    }
                }
            }
        }
        data_obj["Area"][i] = temp;
    }
    efs("./Addons/PVZ/GameData.json",JSON.stringify(data_obj),(err)=>{});
}
exports.add = {
    Interfaces:{
        /*GetPath:function(dir){
            return `./Addons/PVP/${dir}`;
        }*/
    },
    Control:function(connect,message,user,info){
        var msg = new String(message);
        if(msg.substr(0,4)=="进行游戏"){
            time = new Number(msg.replace("进行游戏",""));
            PVZStart = true;
            setInterval(()=>{
                if(PVZStart == true){
                    GameMain(connect,info);
                }
            },time*1000);
            Core.frame.SendMsg(connect,info,`已开始PVZ游戏`)
        };
        if(msg=="结束游戏"){
            PVZStart = false;
            Core.frame.SendMsg(connect,info,"已结束PVZ。");
        };
        if(msg.substr(0,2)=="种植"){
            var plant = msg.replace("种植","");
            if(plant.indexOf("||")==-1){
                Core.frame.SendMsg(connect,info,"请使用||将植物与位置分开。")
                return;
            }
            var temp = plant.split("||");
            fs.readFile("./Addons/PVZ/DataBase.json",(err,data)=>{
                var data_obj = JSON.parse(data.toString());
                if(data_obj["Plant"][temp[0]]==undefined){
                    Core.frame.SendMsg(connect,info,`没有${temp[0]}这个植物!!!`);
                    return;
                }
                if(temp[1]<0&&temp[1]>64){
                    Core.frame.SendMsg(connect,info,`没有${temp[1]}这个格子。`)
                    return;
                }
                fs.readFile("./Addons/PVZ/GameData.json",(err2,data2)=>{
                    var data2_obj = JSON.parse(data2.toString());
                    if(data2_obj["Area"][temp[1]]==undefined){
                        data2_obj["Area"][temp[1]] = {};
                    }
                    if(data2_obj["Area"][temp[1]]["Plant"]!=undefined&&data2_obj["Area"][temp[1]]["Plant"]!="NoThing"){
                        Core.frame.SendMsg(connect,info,`${temp[1]}已经有植物了。`);
                    }
                    data2_obj["Area"][temp[1]]["Plant"] = data_obj["Plant"][temp[0]];
                    efs("./Addons/PVZ/GameData.json",JSON.stringify(data2_obj),(err3)=>{
                        Core.frame.SendMsg(connect,info,`种植${temp[0]}到${temp[1]}成功!`);
                    });
                });
            });
        }
    }
}