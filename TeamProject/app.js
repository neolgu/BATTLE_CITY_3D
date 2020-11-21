
class Manager {
    constructor(uiCanvasId, gmCanvasId, minimapCanvasId) {
        this.gmmgr = new GameManager();
        this.gmmgr.initializer();

        this.uimgr = new UIManager(uiCanvasId);
        //this.graphic = new Graphic();

        this.minimap = new MiniMapManager(minimapCanvasId);
    }

    keyEvent(e) {
        var result = this.uimgr.UIkeyEvent(e);

        if (result != null){
            if(1<= result && result <= 5){// game, n-stage 시작
                //start n stage
                console.log("Game start, " + result + "-stage.");
                this.gmmgr.stage_loader(result);

                // minimap load
                this.minimap.dataBind(obj_list);
                this.minimap.execuse();
            }
        }
        //game.keyEvent(e);
    }
}

var obj_indexer = 0;


window.onload = () => {
    manager = new Manager("ui-canvas", "gl-canvas", "minimap-canvas");
    obj_list = new ObjectList();

    window.addEventListener('keydown', (e) => manager.keyEvent(e));

    window.addEventListener('keydown',input);
    window.addEventListener('keyup',keyupEvent);

    // ctx = document.getElementById("ui-canvas").getContext("2d");
    // ctx.strokeRect(0,0,document.getElementById("ui-canvas").width, document.getElementById("ui-canvas").height);

    gl = document.getElementById("gl-canvas");
    gl_ctx = gl.getContext("2d");

    gl_ctx.beginPath();
    gl_ctx.strokeRect(0, 0, gl.width, gl.height);
    gl_ctx.beginPath();
    gl_ctx.font = "70px Arial";
    gl_ctx.fillText("GAME SCREEN", 100, 400);
}
