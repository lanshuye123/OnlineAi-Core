const fs = require("fs");
const cp = require("child_process");
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
try{
require("./CGI.js")
}catch(err){
   console.log("请下载OnlineAI Core核心功能包(https://gitee.com/computer_internet_inc/OnlineAi-Core)")
    process.exit();
}