
class Manager {
    constructor(uiCanvasId, gmCanvasId, minimapCanvasId) {
        //this.gmmgr = new GameUI();
        this.uimgr = new UIManager(uiCanvasId);
        //this.graphic = new Graphic();
    }

    keyEvent(e) {
        var result = this.uimgr.UIkeyEvent(e);

        if (result != null){
            if(1<= result && result <= 5){// game, n-stage 시작
                //gmmgr.start n stage
                console.log("Game start, " + result + "-stage.");
            }
        }
        //game.keyEvent(e);
    }
}

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


    mm = document.getElementById("minimap-canvas");
    mm_ctx = mm.getContext("2d");

    mm_ctx.beginPath();
    mm_ctx.strokeRect(0, 0, mm.width, mm.height);
    mm_ctx.beginPath();
    mm_ctx.font = "20px Arial";
    mm_ctx.fillText("Mini-Map", 30,100);

}
