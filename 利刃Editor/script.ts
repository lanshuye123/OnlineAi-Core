window.onload = (()=>{
    Core();
})
var Core = (()=>{
    var Using = 0;
    var Editing:Addons = {
        Config:{
            Name:"Addons",
            Author:"User"
        },
        Base:{
            Const:{},
            Function:{}
        },
        Using:{}
    }
    if(localStorage.getItem("[利刃]储存") != undefined && localStorage.getItem("[利刃]储存") != null){
        Editing = JSON.parse(localStorage.getItem("[利刃]储存") as string) as Addons;
    }
    var CommandName = document.getElementById("CommandName") as HTMLInputElement;
    var Main = document.getElementById("Main") as HTMLTextAreaElement;
    var Info = document.getElementById("Info") as HTMLAnchorElement;
    var OutPut = document.getElementById("OutPut") as HTMLButtonElement;
    var EditingExec = document.getElementById("Editing") as HTMLAnchorElement;
    var Last = document.getElementById("Last") as HTMLButtonElement;
    var Next = document.getElementById("Next") as HTMLButtonElement;
    var Execute = document.getElementById("Execute") as HTMLInputElement;
    CommandName.onchange = ((ev)=>{
        if(Editing.Using[CommandName.value]){
            Main.value = Editing.Using[CommandName.value].Content;
        }else{
            Main.value = "";
            Editing.Using[CommandName.value] = {Content:"",Execute:[]}
        }
        Using = 0;
        if(Editing.Using[CommandName.value].Execute[Using]){
            Execute.value = Editing.Using[CommandName.value].Execute[Using];
        }else{
            Editing.Using[CommandName.value].Execute[Using] = "";
            Execute.value = "";
        }
    });
    Main.onchange = ((ev)=>{
        console.log(Main.value);
        Editing.Using[CommandName.value].Content = Main.value;

        if(Main.value == ""){
            Editing.Using[CommandName.value] = undefined;
        }

        localStorage.setItem("[利刃]储存",JSON.stringify(Editing));
    });
    OutPut.onclick = ((ev)=>{
        var Z = Info;
        Z.href = window.URL.createObjectURL(new Blob([JSON.stringify(Editing)]));
        Z.download = "main.lib.json";
        setTimeout(()=>{
            Z.dispatchEvent(new MouseEvent("click"));
        },500);
    });
    EditingExec.innerText = `${Using}`;
    Last.onclick = (()=>{
        if(Using == 0){
            return;
        }
        Using = Using - 1;
        EditingExec.innerText = `${Using}`;
        if(Editing.Using[CommandName.value].Execute[Using]){
            Execute.value = Editing.Using[CommandName.value].Execute[Using];
        }else{
            Editing.Using[CommandName.value].Execute[Using] = "";
            Execute.value = "";
        }
    });
    Next.onclick = (()=>{
        Using = Using + 1;
        EditingExec.innerText = `${Using}`;
        if(Editing.Using[CommandName.value].Execute[Using]){
            Execute.value = Editing.Using[CommandName.value].Execute[Using];
        }else{
            Editing.Using[CommandName.value].Execute[Using] = "";
            Execute.value = "";
        }
    });
    Execute.onchange = (()=>{
        Editing.Using[CommandName.value].Execute[Using] = Execute.value;
    })
});