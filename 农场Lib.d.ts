interface 作物{
    种子:number|Number;
    售价:number|Number;
    生长:number|Number;
}
interface 农场Lib{
    农业:any;
}
interface User农场Data{
    菜地:作物单位[]
}
interface 作物单位{
    类型:String|string;
    成熟:Number|number;
    已采摘?:Boolean|boolean;
}