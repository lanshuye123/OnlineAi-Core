// EasyTools : 提供语言分析(不准确)
const Width = 5;//默认权重
var FIn = ((Arr:string[],Location:Number,IsIt:string)=>{
    var Back = false;
    for(var i = -(Width-1)/2; i < Width ; i ++){
        if(Arr[Location.valueOf() + i] == IsIt){
            Back = true;
        }
    }
    return Back;
})
export var EasyTools = {
    分析:((A:String,B:String)=>{
        var KeyA = A.split("");
        var KeyB = B.split("");
        var EC = 0;
        KeyA.forEach((v,i)=>{
            if(FIn(KeyB,i,v)){
                EC = EC + 1;
            }
        });
        return (EC/(KeyA.length + KeyB.length) * 2);
    })
}