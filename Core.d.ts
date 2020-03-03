import * as net from "net";
export class InfoType{
    message:String|string;
    raw_message:String|string;
    sender:any;
    user_id:number|Number;
    constructor();
}
export function GetUser(user_id:String|string|Number|number):number;
export var HOOK:Boolean|boolean;
export namespace frame{
    function Ban(connect:net.Socket,info:InfoType,time:number):void;
    function SetHOOK(value:Boolean|boolean):void;
    function SendMsg(connect:net.Socket,info:InfoType,msg:String|string):void;
    function At(UserId:number|Number):string;
}