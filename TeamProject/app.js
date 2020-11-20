
class Manager {
    constructor(uiCanvasId, gmCanvasId, minimapCanvasId) {
        //this.gmmgr = new GameUI();
        this.uimgr = new UIManager(uiCanvasId);
        //this.graphic = new Graphic();
        this.minimap = new MiniMapManager(minimapCanvasId);
    }

    keyEvent(e) {
        var result = this.uimgr.UIkeyEvent(e);

        if (result != null){
            if(1<= result && result <= 5){// game, n-stage 시작
                //gmmgr.start n stage
                console.log("Game start, " + result + "-stage.");

                this.minimap.dataBind(gamedata);
                this.minimap.execuse();
            }
        }
        //game.keyEvent(e);
    }
}

// MINIMAP TEST DATA
var gamedata = {}
gamedata.player = {};
gamedata.player.x_pos = 0.5;
gamedata.player.y_pos = 0.5;

window.onload = () => {
    var manager = new Manager("ui-canvas", "gl-canvas", "minimap-canvas");

    window.addEventListener('keydown', (e) => manager.keyEvent(e));

    // ctx = document.getElementById("ui-canvas").getContext("2d");
    // ctx.strokeRect(0,0,document.getElementById("ui-canvas").width, document.getElementById("ui-canvas").height);

    gl = document.getElementById("gl-canvas");
    gl_ctx = gl.getContext("2d");

    gl_ctx.beginPath();
    gl_ctx.strokeRect(0, 0, gl.width, gl.height);
    gl_ctx.beginPath();
    gl_ctx.font = "70px Arial";
    gl_ctx.fillText("GAME SCREEN", 100, 400);

    // minimap test key event
    window.addEventListener('keydown', (e) => {
        if(e.key == "l"){
            gamedata.player.x_pos -= 0.1;
        }
        else if(e.key == "k"){
            gamedata.player.y_pos -= 0.1;
        }
    });
}
