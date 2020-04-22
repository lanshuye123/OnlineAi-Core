declare interface LibMoney{
    add:{
        GetUserMoney(UserID:Number):Number
        GiveUserMoney(UserID:Number,Count:Number):void;
        CostUserMoney(UserID:Number,Count:Number):void;
    }
}