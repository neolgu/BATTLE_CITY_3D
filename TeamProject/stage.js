function Stage()
{
    this.obj_indexer=0;
    this.obj_list = -1;
    this.axis_num=0;
    this.block_size = 1;
    this.object_list = new ObjectList();
    this.map = [];
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
      this.obj_list.over = false;
      this.map = map.slice();
      this.enemy_num = enemy_num;
      console.log(enemy_num);
      
      this.width = 2/Math.sqrt(map.length);
      this.half = this.width/2;
      this.tankSize = this.width*0.7;
      
      var player = new Player;
      player.obj_list= this.obj_list;

      player.constructor([-0.75, -0.75], [this.tankSize, this.tankSize], [0, 0]);
      player.rot(0);
      this.obj_list.player = player;
      
      this.mapDefine();
      setInterval(this.frameWork.bind(this), 10);
    }

    this.frameWork = function()
    {
      if(this.obj_list.over)
        this.over();
      //프레임 별 수행해야 할 동작
      if(this.enemy_num>0 && this.obj_list.enemy_list.length < this.initial_enemy_num)
      {
        this.spawn();
      }
      this.obj_list.frameWork();
      for(var i=0;i<this.obj_list.wall_list.length;i++)
      {

      }
      for(var enemy_index=0;enemy_index<this.obj_list.enemy_list.length;enemy_index++)
      {
        this.coordRefactor(this.obj_list.enemy_list[enemy_index]);
        this.obj_list.enemy_list[enemy_index].ai_action();
      }
      this.coordRefactor(this.obj_list.player);
    }

    this.spawn = function()
    {
      //spawn point에서 생성
      console.log("Spawn!");
      var idx = Math.floor(Math.random() * this.spawn_point_list.length);
      var center = this.spawn_point_list[idx];
      center[1] = 0.99;
      var tankSize = this.tankSize;
      var index = [0, 0];
      var enemy_instance = new Enemy();
      enemy_instance.obj_list = this.obj_list;
      enemy_instance.index = this.obj_indexer++;
      enemy_instance.rot(-2);
      enemy_instance.constructor(center, [tankSize, tankSize], index);
      this.obj_list.enemy_list.push(enemy_instance);
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
            wall_instance.index=this.obj_indexer++;
            wall_instance.constructor([currentX, currentY],[this.width, this.width],[j, i]);
            this.obj_list.wall_list.push(wall_instance);
          }
          if(map[(i*axis_num)+j]==2)
          {
            var enemy_instance=new Enemy();
            enemy_instance.index=this.obj_indexer++;
            enemy_instance.rot(-2);
            enemy_instance.obj_list= this.obj_list;
            enemy_instance.constructor([currentX, currentY],[this.tankSize, this.tankSize],[j, i]);
            this.spawn_point_list.push([currentX, currentY]);
            this.obj_list.enemy_list.push(enemy_instance);
            this.initial_enemy_num++;
          }
          if(map[(i*axis_num)+j]==4)
          {
            
            var wall_instance = new Wall();
            wall_instance.index=this.obj_indexer++;
            wall_instance.constructor([currentX, currentY],[this.width, this.width],[j, i]);
            wall_instance.health=3;
            console.log(wall_instance.center);
            this.obj_list.commandCenter = wall_instance;
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
        wall_instance.index = this.obj_indexer++;
        wall_instance.constructor(current_center, shape, [-1, -1]);
        wall_instance.overwhelming = true;
        this.obj_list.wall_list.push(wall_instance);
      }
    }

    this.coordRefactor = function(object)
    {
      var axis_num = Math.sqrt(this.map.length);
      var coord_x = object.x_pos+1;
      var coord_y = -object.y_pos+1;
      coord_x= Math.floor(coord_x/this.width);
      coord_y=Math.floor(coord_y/this.width);
      object.coord = [coord_x, coord_y];
    }
    //대충 맵구성, 적 수, etc 구현.
}
