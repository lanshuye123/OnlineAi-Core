const fs = require("fs");
const cp = require("child_process");
const Core = require("./Core");
var Loaded = false;
process.title = "OnlineAi by Lanshuye"
global.UpData = function(){
    cp.execSync("git reset --hard&git pull origin master");
    console.log(`[${new this.Date().toString()}][OnlineAI.js]获取更新完毕`);
}
fs.exists("./UserDataBase.json",(ex)=>{
    if(ex){
        console.log(`[${new Date().toString()}][OnlineAI.js]载入"UserDataBase.js"成功!`);
    }else{
        fs.writeFile("./UserDataBase.json","{}",(err)=>{
            console.log(`[${new Date().toString()}][OnlineAI.js]用户信息初始化完成!`)
        });
    }
});
global.Run = (()=>{
    if(DEBUG.Core){return}
    if(Loaded){process.exit(-1)}else{Loaded = true;}
    require("./CGI");
});
Run();
require("repl").start();