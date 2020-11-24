function GameManager(){
    this.total_stage = 3;
    this.stage_list=[];
    this.currentStage = -1;
    this.map_list = []
    this.enemy_num_list=[];
    this.obj_list=-1;
    this.currentState = 2;
    this.initializer = function()
    {
      this.obj_list = new ObjectList();
      this.map_list.push(
        [  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
           3, 0, 0, 0, 0, 3, 0, 0, 2, 0,
           3, 0, 0, 3, 3, 3, 0, 0, 3, 3,
           0, 0, 3, 0, 0, 0, 0, 3, 0, 0,
           0, 0, 3, 0, 0, 0, 0, 3, 0, 0,
           0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
           3, 0, 0, 0, 0, 3, 0, 0, 0, 0,
           3, 0, 0, 3, 3, 3, 0, 0, 3, 3,
           0, 0, 3, 0, 0, 0, 0, 3, 0, 0,
           0, 4, 3, 0, 0, 0, 0, 3, 0, 0]
      );
      this.enemy_num_list.push(0);
      this.map_list.push(
        [ 2, 0, 0, 0, 0,
           3, 0, 0, 2, 0,
           3, 0, 0, 3, 3,
           3, 0, 3, 0, 0,
           0, 4, 3, 0, 0]
      );
      this.enemy_num_list.push(10);
      this.map_list.push(
        [  0, 0, 0, 0, 0, 2,
           0, 3, 0, 0, 2, 0,
           0, 3, 2, 0, 3, 3,
           0, 3, 0, 3, 0, 0,
           0, 0, 0, 3, 0, 0,
           0, 0, 4, 3, 0, 0]
      );
      this.enemy_num_list.push(15);
    }
    this.stage_loader = function(idx)
    {
      this.currentState = 0;
      this.obj_list.initializer();
      var currentMap = this.map_list[idx];
      var currentEnemy_num = this.enemy_num_list[idx];

      var stage = new Stage();
      stage.manager = this.game_state.bind(this);
      stage.obj_list = this.obj_list;
      stage.generator(currentMap, currentEnemy_num);
      this.currentStage = stage;
    }
    this.game_end=function()//게임 종료, 메인으로
    {
      if(this.currentStage!=-1)
      {
        this.currentStage.over();
        this.currentStage = -1;
      }
    }
    this.game_state = function(state)
    {
      if(state==1)
      {
        //게임 승리
        this.currentState = 1;
      }
      else if(state==-1)
      {
        //게임 패배
        this.currentState = -1;
      }
    }
}
