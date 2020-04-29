declare interface Addons{
    Config:AddonsConfig,
    Base:AddonsBase,
    Using:any;
}
declare interface AddonsConfig{
    Name:String,
    Author:String
}
declare interface AddonsBase{
    Const:any,
    Function:any;
}
declare interface AddonsUsing{
    Content:String,
    Execute:Array<String>;
}