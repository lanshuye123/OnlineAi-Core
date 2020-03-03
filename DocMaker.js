const btoa = require("btoa");
const Core = require("./Core");
const request = require('request');
exports.add = {
    Interfaces:{
        MakeURL:function(docs){
            var e = {"TITLE":"本文档生成自OnlineAI Core","Context":[{"Text":docs}]};
            var s = JSON.stringify(e);
            var n = encodeURIComponent(s);
            var k = btoa(n);
            return `https://computer_internet_inc.gitee.io/jsondoc/?${k}`;
        },
        GetShortURL:function(LongURL){
            
        }
    },
    Control:function(connect,info){
        if(info["message"].substr(0,4)=="生成文档"){
            var msg = info["message"].replace("生成文档","");
            var url = exports.add.Interfaces.MakeURL(msg);
            Core.frame.SendMsg(connect,info,`${url}`);
        }
    }
}