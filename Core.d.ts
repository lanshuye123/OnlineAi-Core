import * as net from "net";
import * as Core from "./Core";
/**QQ用户类:一个QQ号对应的人*/export class QQUser{
    /**岁数*/age:Number|number;
    /**昵称*/nickname:String|string;
    /**性别*/sex:"male"|"unkonw"|""|String|string|undefined;
    /**QQ号*/user_id:number|Number;
    /**地区*/area:String|null|undefined;
    /**群名片*/card:String|string|undefined;
    /**发言等级*/level:String|string|undefined;
    /**群内角色*/role:"owner"|"user";
    /**群头衔*/title:string|String;
}
/**消息类:一个消息对应的东西*/export class InfoType{
    /**匿名信息*/anonymous:Object|null|undefined;
    /**字体*/font:number|Number;
    /**群号*/group_id:number|Number|undefined;
    /**消息内容*/message:String|string;
    /**消息号*/message_id:number|Number;
    /**消息类型*/message_type:"group"|"privace";
    /**未知*/post_type:String|string;
    /**消息*/raw_message:String|string;
    /**AiQQ*/self_id:number|Number|2142562417;
    /**发送者*/sender:QQUser;
    /**类型2*/sub_type:String|string;
    /**时间戳*/time:number|Number;
    /**发送者QQ*/user_id:number|Number;
}
/**原定于获取名称对应的QQ号，不过已经废弃了
 * @param user_id 用户名称*/export function GetUser(user_id:String|string|Number|number):number;
/**HOOK:是否发送过消息*/export var HOOK: Boolean | boolean;
declare interface InfoSocket{}
/**添加事件监听器
 * @param callback 回调函数
 */export function AddListener(/**回调函数*/callback:((Connect:InfoSocket,Info:InfoType)=>void)):void;
/**Config类型*/declare interface Config<T>{
    /**
     * 读取某个人的Config
     * @param QQ QQ
     */
    ReadValue(QQ:Number|number):T;
    /**
     * 写入某个人的Config
     * @param QQ QQ
     * @param value 内容
     */
    WriteValue(QQ:Number|number,value:T):void;
    API_GET():any;
    constructor(Value:Array<T>):any;
}
/**部分公开功能*/export namespace frame{
    /**禁言某人
     * @param connect 会话
     * @param info 消息
     * @param time 时长(单位:s)*/function Ban(connect:InfoSocket,info:InfoType,time:number):void;
    /**设置HOOK的内容
    * @param value TURE|FALSE;*/function SetHOOK(value:Boolean|boolean):void;
    /**发送消息
     * @param connect 会话
     * @param info 消息
     * @param msg 发送内容*/function SendMsg(connect:InfoSocket,info:InfoType,msg:String|string):void;
    /** \@某人
     * @param UserId QQ号
     */function At(UserId:number|Number):string;
     /** 读取某个配置项目
      * @param ConfigName 配置项名称
      */function NReadSystemConfig(ConfigName:String|string):Config<any>;
     /**写入某个配置项目
      * @param ConfigName 配置名称
      * @param ConfigValue 配置内容
      */function NWriteSystemConfig(ConfigName:String|string,ConfigValue:Config<any>):Boolean|boolean;
}