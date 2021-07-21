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
        if(msg=="创建队伍"){
            fs.readFile("./Addons/PVP/MulBase.json",(err,data)=>{
                var data_obj = JSON.parse(data.toString());
                if(data_obj["Player"][user]==undefined){
                    data_obj["Player"][user]={"Team":-1};
                }else{
                    if(data_obj["Player"][user]["Team"]!=-1){
                        Core.frame.SendMsg(connect,info,`${Core.frame.At(Core.GetUser(user))}，你已经加入一个队伍了。`);
                        return;
                    }
                }
                var teams = new Array(data_obj["Team"]);
                data_obj["Player"][user]["Team"]=teams.length;
                data_obj["Player"][user]["ID"]=1;
                teams[teams.length] = [{"Attacking":-1,"Owner":user},{"ID":user,"Attacked":false,"HP":100,"PP":100}];
                data_obj["Team"]=teams;
                fs.writeFile("./Addons/PVP/MulBase.json",JSON.stringify(data_obj),(err2)=>{
                    Core.frame.SendMsg(connect,info,`${Core.frame.At(user)},队伍创建成功，队伍ID为${data_obj["Player"][user]["Team"]}。`);
                });
            });
        }
        if(msg.substr(0,4)=="加入队伍"){
            var teamId = new Number(msg.replace("加入队伍",""));
            fs.readFile("./Addons/PVP/MulBase.json",(err,data)=>{
                var data_obj = JSON.parse(data.toString());
                if(data_obj["Player"][user]==undefined){
                    data_obj["Player"][user]={"Team":-1};
                }else{
                    if(data_obj["Player"][user]["Team"]!=-1){
                        Core.frame.SendMsg(connect,info,`${Core.frame.At(Core.GetUser(user))}，你已经加入一个队伍了。`);
                        return;
                    }
                }
                var teams = new Array(data_obj["Team"]);
                if(teams.length<new Number(teamId)){
                    Core.frame.SendMsg(connect,info,`${Core.frame.At(user)},没有这个Mul-PVP队伍。`);
                    return;
                }
                var theTeam = new Array(teams[new Number(teamId)]);
                theTeam[theTeam.length] = {"ID":user,"Attacked":false,"HP":100,"PP":100};
                data_obj["Player"][user]["Team"] = new Number(teamId);
                data_obj["Player"][user]["ID"] = theTeam.length - 1;
                teams[teamId] = theTeam;
                data_obj["Team"] = teams;
                fs.writeFile("./Addons/PVP/MulBase.json",JSON.stringify(data_obj),(err2)=>{
                    Core.frame.SendMsg(connect,info,`${Core.frame.At(user)},加入队伍${teamId}成功!`);
                });
            });
        }
    }
}