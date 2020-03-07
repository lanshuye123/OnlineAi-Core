import * as Core from "./Core";
var ZExec:((Str:string)=>string) = ((Str)=>{return ""});
((R:RegExpConstructor,Info:Core.InfoType)=>{
    if(R.$1.indexOf("则")==-1){
        return "行动缺失";
    }
    var k = R.$1.split("则",2);
    console.log(`k:${k}k`);
    console.log(`${R.$1}`);
    console.log(ZExec(k[0]));
    console.log(eval(ZExec(k[1])));
    if(eval(ZExec(k[0]))){
        console.log(ZExec(k[1]));
        return eval(ZExec(k[1]));
    };
})(RegExp,new Core.InfoType());