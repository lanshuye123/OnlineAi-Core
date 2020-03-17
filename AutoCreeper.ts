import * as Core from "./Core";
export var Creeper = ["Creeper?", "awwww man!","So we back in the mine"];
var Creepering = 0;
Core.AddListener((c, info) => {
    if (Creepering != 0) {
        var temp = true;
        if (info.message == Creeper[Creepering]) {
            Core.frame.SendMsg(c, info, Creeper[Creepering + 1]);
            Creepering = Creepering + 2;
            temp = false;
            if (Creepering > Creeper.length) {
                Core.frame.SendMsg(c, info, "The End");
            }
        }
        if (temp) {
            Core.frame.SendMsg(c, info, "有人发送了一个与Creeper无关的消息，Creeper进度已终止!");
        }
    }
    if (info.message == Creeper[0]) {
        Creepering = 1;
        Core.frame.SendMsg(c, info, Creeper[1]);
    }
});