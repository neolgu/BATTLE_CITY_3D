var stage = 0;

function keyupEvent(event){
  if(userDefine)
  {
    switch(event.keyCode)
    {
      case 37:
        if(obj_list.player.rot_dir==1)
          obj_list.player.rot_dir=0;
        break;
      case 39:
        if(obj_list.player.rot_dir==-1)
          obj_list.player.rot_dir=0;
        break;
      case 38://위
        if(obj_list.player.moving==1)
          obj_list.player.moving = 0;
          //obj_list.player.direction_y=0;
        break;
      case 40://아래
        if(obj_list.player.moving==-1)
          obj_list.player.moving=0;
        break;
      default:
        break;
    }
  }

}
function input(event){//key down
  userMoving=true;
  if(userDefine)
  {
    switch(event.keyCode)
    {
      case 37:
        obj_list.player.rot_dir=1;
        //obj_list.player.direction_x=-1;
        break;
      case 38:
        obj_list.player.direction_y=1;
        obj_list.player.moving=1;
        break;
      case 39:
        obj_list.player.rot_dir=-1;
        //obj_list.player.direction_x=1;
        break;
      case 40:
        obj_list.player.moving = -1;
        obj_list.player.direction_y=-1;
        break;
      //spacebar
      case 32://setTimeout이용.
        if(userDefine)//그리고 유저가 발사할 수 있는 상황일 때 --> 이건 유저 함수에서
        {
          obj_list.player.shoot();
        }
        break;
    }
  }
  if(event.keyCode==49)
  {
    game.stage_loader(stage);
    console.log(obj_list.wall_list.length);
    stage++;
  }
}

