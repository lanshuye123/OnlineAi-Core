// .i.ts : Interface TS文件
class 数字 extends Number{};
import * as Core from "./Core";
export var 使用用户保镖 = ((用户:数字)=>{
    var 数据 = Core.frame.ReadSystemConfig("保镖");
    if(数据[用户.valueOf()] == undefined || new Number(数据[用户.valueOf()]).valueOf() < 0){
        return false;
    }else{
        数据[用户.valueOf()] = 数据[用户.valueOf()] - 1;
        Core.frame.WriteSystemConfig("保镖",数据);
        return true;
    }
})