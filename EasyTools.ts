// EasyTools : 提供语言分析(不准确)
export var EasyTools = {
    分析:((A:String,B:String)=>{
        var KeyA = A.split("");
        var KeyB = B.split("");
        var EC = 0;
        KeyA.forEach((v,i)=>{
            KeyB.forEach((v2,i2)=>{
                if(i2 < i){
                    return
                }
                if(v == v2){
                    EC = EC + 1;
                }
            })
        });
        return (EC/(KeyA.length + KeyB.length) * 2);
    })
}