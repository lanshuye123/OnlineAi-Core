const fs = require("fs");
const cp = require("child_process");
if(fs.existsSync("./CGI.js")){
    fs.exists("./UserDataBase.json",(ex)=>{
        if(ex){
            console.log(`[${new Date().toString()}][OnlineAI.js]载入"UserDataBase.js"成功!`);
        }else{
            fs.writeFile("./UserDataBase.json",JSON.stringify({}),(err)=>{
                console.log(`[${new Date().toString()}][OnlineAI.js]用户信息初始化完成!`)
            });
        }
    });
    require("./CGI.js");
}else{
    console.log("请下载OnlineAI Core核心功能包。");
}