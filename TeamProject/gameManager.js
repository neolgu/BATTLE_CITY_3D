function GameManager(){
    this.total_stage = 3;
    this.stage_list=[];
    this.currentStage = -1;
    this.map_list = []
    this.enemy_num_list=[];
    this.initializer = function()
    {
      this.map_list.push(
        [  0, 0, 0, 0, 0,
           3, 0, 0, 2, 0,
           3, 0, 0, 3, 3,
           0, 0, 3, 0, 0,
           0, 0, 3, 0, 0]
      );
      this.enemy_num_list.push(5);
      this.map_list.push(
        [ 2, 0, 0, 0, 0,
           3, 0, 0, 2, 0,
           3, 0, 0, 3, 3,
           3, 0, 3, 0, 0,
           0, 0, 3, 0, 0]
      );
      this.enemy_num_list.push(10);
      this.map_list.push(
        [  0, 0, 0, 0, 0, 2,
           0, 3, 0, 0, 2, 0,
           0, 3, 2, 0, 3, 3,
           0, 3, 0, 3, 0, 0,
           0, 0, 0, 3, 0, 0,
           0, 0, 0, 3, 0, 0]
      );
      this.enemy_num_list.push(15);
    }
    this.stage_loader = function(idx)
    {
      obj_list.initializer();
      var currentMap = this.map_list[idx];
      var currentEnemy_num = this.map_list[idx];

      var stage = new Stage();
      stage.generator(currentMap, currentEnemy_num);
    }
    this.game_end=function()//게임 종료, 메인으로
    {
      if(this.currentStage!=-1)
      {
        this.currentStage.over();
        this.currentStage = -1;
      }
    }

}
