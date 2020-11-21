var stage = 0;

function keyupEvent(event) {
  switch (event.keyCode) {
    case 37:
      if (obj_list.player.rot_dir == 1)
        obj_list.player.rot_dir = 0;
      break;
    case 39:
      if (obj_list.player.rot_dir == -1)
        obj_list.player.rot_dir = 0;
      break;
    case 38://위
      if (obj_list.player.moving == 1)
        obj_list.player.moving = 0;
      //obj_list.player.direction_y=0;
      break;
    case 40://아래
      if (obj_list.player.moving == -1)
        obj_list.player.moving = 0;
      break;
    default:
      break;
  }
}
function input(event) {//key down
  userMoving = true;
  switch (event.keyCode) {
    case 37:
      obj_list.player.rot_dir = 1;
      obj_list.player.move();
      //obj_list.player.direction_x=-1;
      break;
    case 38:
      obj_list.player.direction_y = 1;
      obj_list.player.moving = 1;
      obj_list.player.move();
      break;
    case 39:
      obj_list.player.rot_dir = -1;
      obj_list.player.move();
      //obj_list.player.direction_x=1;
      break;
    case 40:
      obj_list.player.moving = -1;
      obj_list.player.direction_y = -1;
      obj_list.player.move();
      break;
    //spacebar
    case 32://setTimeout이용.
      obj_list.player.shoot();
      break;
  }
}

