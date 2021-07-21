import * as Core from "./Core";
export namespace 赢青{
    export interface 位置{
        名称:String|string;
        东:位置|undefined;
        南:位置|undefined;
        西:位置|undefined;
        北:位置|undefined;
    }
    export interface 物品配置{
        名称:String;
    }
    export interface 物品数据配置{
        实例:物品配置;
        数量:Number;
    }
    export interface 玩家信息{
        物品:物品数据配置[];
        位置:位置;
    }
    export class 玩家信息 implements 玩家信息{
        constructor(that:玩家信息){
            this.位置 = that.位置;
            this.物品 = []
            for(var i=0;i<that.物品.length;i++){
                this.物品[i] = that.物品[i];
            }
        }
    }
}

export var InterFaces = {
    获取信息:((PlayerID:Number|number)=>{
        var InfoData = Core.frame.ReadSystemConfig("赢青设定") as 赢青.玩家信息[];
        if(InfoData[PlayerID.valueOf()]!=undefined){
            
        }else{
            
        }
    })
};
(()=>{
    Core.AddListener((c,i)=>{
        if(i.message.substr(0,2)!="赢青"){
            return;
        }
        var C = i.message.replace("赢青","");
        if(C == "信息"){
            var PlayerData = InterFaces.获取信息(Core.GetUser(i.user_id));
            var message = `<赢青插件>\r\n玩家名:${Core.frame.At(Core.GetUser(i.user_id))}\r\n$当前地图:${void 0}`
        }
    });
})();