
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
                this.gmmgr.stage_loader(result-1);

                // minimap load
                this.minimap.dataBind(this.gmmgr.obj_list);
                this.minimap.execuse();
            }
        }
        //game.keyEvent(e);
    }
    game_keyupEvent(event) {
        switch (event.keyCode) {
          case 37:
            if (this.gmmgr.obj_list.player.rot_dir == 1)
                this.gmmgr.obj_list.player.rot_dir = 0;
                break;
          case 39:
            if (this.gmmgr.obj_list.player.rot_dir == -1)
                this.gmmgr.obj_list.player.rot_dir = 0;
                break;
          case 38://위
            if (this.gmmgr.obj_list.player.moving == 1)
                this.gmmgr.obj_list.player.moving = 0;
            //obj_list.player.direction_y=0;
                break;
          case 40://아래
            if (this.gmmgr.obj_list.player.moving == -1)
                this.gmmgr.obj_list.player.moving = 0;
                break;
          default:
            break;
        }
      }
      game_keydownEvent(event) {//key down
        switch (event.keyCode) {
          case 37:
            this.gmmgr.obj_list.player.rot_dir = 1;
            //obj_list.player.direction_x=-1;
            break;
          case 38:
            this.gmmgr.obj_list.player.direction_y = 1;
            this.gmmgr.obj_list.player.moving = 1;
            break;
          case 39:
            this.gmmgr.obj_list.player.rot_dir = -1;
            //obj_list.player.direction_x=1;
            break;
          case 40:
            this.gmmgr.obj_list.player.moving = -1;
            this.gmmgr.obj_list.player.direction_y = -1;
            break;
          //spacebar
          case 32://setTimeout이용.
            this.gmmgr.obj_list.player.shoot();
            break;
        }
      }
      
}

var obj_indexer = 0;


window.onload = () => {
    manager = new Manager("ui-canvas", "gl-canvas", "minimap-canvas");

    window.addEventListener('keydown', (e) => manager.keyEvent(e));

    window.addEventListener('keydown', (e)=> manager.game_keydownEvent(e));
    window.addEventListener('keyup',(e)=>manager.game_keyupEvent(e));

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
