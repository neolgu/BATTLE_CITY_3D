import * as GRAPHIC from './3js.js'

class Manager {
  constructor(uiCanvasId, gmCanvasId, minimapCanvasId) {
    this.gmmgr = new GameManager();
    this.gmmgr.initializer();

    this.uimgr = new UIManager(uiCanvasId);
    this.minimap = new MiniMapManager(minimapCanvasId);
    this.graphicmgr = new GRAPHIC.GrapicManager(gmCanvasId);
    this.graphicmgr.init();
  }

  keyEvent(e) {
    var result = this.uimgr.UIkeyEvent(e);

    if (result != null) {
      if (1 <= result && result <= 5) {// game, n-stage 시작
        //start n stage
        console.log("Game start, " + result + "-stage.");
        this.gmmgr.stage_loader(result - 1);

        if (this.uimgr.nowUI instanceof GameUI) {
          this.uimgr.nowUI.initData(500,
            this.gmmgr.currentStage,
            this.gmmgr.obj_list.player,
            this.gmmgr);
          this.uimgr.nowUI.execuse();
        }

        // minimap load
        this.minimap.dataBind(this.gmmgr.obj_list);
        this.minimap.execuse();

        // graphic load
        this.graphicmgr.dataBind(this.gmmgr.obj_list);
        this.graphicmgr.execuse();
      }
      if (result == -1) {//all stop and reload
        this.minimap.stop();
        this.graphicmgr.stop();
        window.location.reload();
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


window.onload = () => {
  var manager = new Manager("ui-canvas", "gl-canvas", "minimap-canvas");

  window.addEventListener('keydown', (e) => manager.keyEvent(e));
  window.addEventListener('keydown', (e) => manager.game_keydownEvent(e));
  window.addEventListener('keyup', (e) => manager.game_keyupEvent(e));

}
