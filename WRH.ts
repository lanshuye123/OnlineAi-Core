// Word Recitation Helper
// 单词背诵助手

import * as Core from "./Core";
const command = {
    "prefix":"WRH",
    "answer":"ANS ",
    "key":"KEY",
    "require":"REQ",
    "select":"SEL ",
    "rankinglist":"RAL"
}
Core.AddListener((c,i)=>{
    
    if(i.message.substring(0,command.prefix.length) == command.prefix){
        var subcommand = i.message.replace(command.prefix,"");
        subcommand
    }
})