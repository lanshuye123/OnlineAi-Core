declare interface LibMoney{
    add:{
        Interfaces:{
            GetUserMoney(UserID:Number):Number
            GiveUserMoney(UserID:Number,Count:Number):void;
            CostUserMoney(UserID:Number,Count:Number):void;
        }
    }
}
declare interface LibDebug{
    add:{
        Interfaces:{
            /**
             * 查询一个用户是否为Ai管理员
             * @param UserID 要查询的用户的QQ
             */
            IsAdmin(UserID:Number):Boolean;
        }
    }
}