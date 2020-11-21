function Stage()
{
    this.axis_num=0;
    this.block_size = 1;
    this.object_list = new ObjectList();
    this.map = [
           2, 0, 0, 0, 0,
           3, 0, 0, 2, 0,
           3, 0, 0, 3, 3,
           0, 0, 3, 0, 0,
           0, 0, 3, 0, 0];
    this.initial_enemy_num = 0;
    this.spawn_point_list = [];
    this.enemy_num =0;
    this.lift = 0;
    this.score = 0;

    this.width = 0;
    this.half = 0;
    this.tankSize = 0;

    this.generator = function(map, enemy_num)
    {
      this.map = map.slice();
      this.enemy_num = enemy_num;
      
      
      this.width = 2/Math.sqrt(map.length);
      this.half = this.width/2;
      this.tankSize = this.width*0.7;
      
      var player = new Player;
      player.constructor([-0.75, -0.75], [this.tankSize, this.tankSize], [0, 0]);
      player.rot(0);
      obj_list.player = player;
      
      this.mapDefine();
      setInterval(this.frameWork.bind(this), 10);
    }
    this.frameWork = function()
    {
      //프레임 별 수행해야 할 동작
      if(this.enemy_num>0 && obj_list.enemy_list.length < this.initial_enemy_num)
      {
        this.spawn();
      }
      obj_list.frameWork();
      for(i=0;i<obj_list.wall_list.length;i++)
      {
        //wall이 frame에서 수행해야 할 작업.
        //이건 wall에 함수화 하셈
        //obj_list.wall_list[i].rendering();
      }
      for(e_i=0;e_i<obj_list.enemy_list.length;e_i++)
      {
        obj_list.enemy_list[e_i].ai_action();
        //obj_list.enemy_list[e_i].rendering();
      }
      //obj_list.player.rendering();
    }

    this.spawn = function()
    {
      //spawn point에서 생성
      console.log("Spawn!");
      var idx = Math.floor(Math.random() * this.spawn_point_list.length);
      var center = this.spawn_point_list[idx];
      center[1] = 1.5;
      var tankSize = this.tankSize;
      var index = [0, 0];
      var enemy_instance = new Enemy();
      enemy_instance.index = obj_indexer++;
      enemy_instance.rot(-2);
      enemy_instance.constructor(center, [tankSize, tankSize], index);
      obj_list.enemy_list.push(enemy_instance);
      this.enemy_num = this.enemy_num-1;
    }

    this.over = function()
    {
        for (var i = 1; i < 99999; i++)
          window.clearInterval(i);
        console.log("게임 오버_메인 화면으로");
    }

    this.mapDefine=function()//map initial
    {
      var map = this.map;
      var axis_num=Math.sqrt(map.length);
      var w = 2/axis_num;
      var x = -1+(w/2);//initial_coord
      var y = 1-w/2;
      this.generateSuperWall([2, 2]);
      for(i=0;i<axis_num;i++)
      {
        var currentY= y-(i*w);
        for(j=0;j<axis_num;j++)
        {
          var currentX=x+(j*w);
          //when wall exist...
          if(map[(i*axis_num)+j]==3)
          {
            var wall_instance = new Wall();
            wall_instance.index=obj_indexer++;
            wall_instance.constructor([currentX, currentY],[this.width, this.width],[j, i]);
            obj_list.wall_list.push(wall_instance);
          }
          if(map[(i*axis_num)+j]==2)
          {
            var enemy_instance=new Enemy();
            enemy_instance.index=obj_indexer++;
            enemy_instance.rot(-2);
            enemy_instance.constructor([currentX, currentY],[this.tankSize, this.tankSize],[j, i]);
            this.spawn_point_list.push([currentX, currentY]);
            obj_list.enemy_list.push(enemy_instance);
            this.initial_enemy_num++;
          }
        }
      }
    }

    this.generateSuperWall=function(shape)
    {
      var factor = shape[0]/2;
      var center_1 =[1+factor, 0];
      var center_2 = [-(1+factor), 0];
      var center_3 = [0, 1+factor];
      var center_4 = [0, -(1+factor)];
      var center_list = [center_1, center_2, center_3, center_4];
      for(var wall_index=0; wall_index<center_list.length;wall_index++)
      {
        var current_center = center_list[wall_index];
        var wall_instance = new Wall();
        wall_instance.index = obj_indexer++;
        wall_instance.constructor(current_center, shape, [-1, -1]);
        wall_instance.overwhelming = true;
        obj_list.wall_list.push(wall_instance);
      }
    }

    this.coordRefactor = function(object)
    {
      var axis_num = Math.sqrt(map1.length);
      var coord_x = object.x_pos+1;
      var coord_y = -object.y_pos+1;
      coord_x= Math.floor(coord_x/width);
      coord_y=Math.floor(coord_y/width);
    }
    //대충 맵구성, 적 수, etc 구현.
}
