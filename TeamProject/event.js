function keyupEvent(event){
  switch(event.keyCode)
  {
    case 37:
      if(direction_x==-1)
        direction_x=0;
      break;
    case 39:
      if(direction_x==1)
        direction_x=0;
      break;
    case 38://위
      if(direction_y==1)
        direction_y=0;
      break;
    case 40://아래
      if(direction_y==-1)
        direction_y=0;
      break;
    default:
      break;
  }

}
function input(event){
  userMoving=true;
  switch(event.keyCode)
  {
    case 37:
      direction_x=-1;
      break;
    case 38:
      direction_y=1;
      break;
    case 39:
      direction_x=1;
      break;
    case 40:
      direction_y=-1;
      break;
    //spacebar
    case 32:
      if(userDefine)
      {
        var b = new Bullet();
        var direction = vec2(1, 0);//임시 direction
        b.shoot([x_pos, y_pos], direction);
        bullet_list.push(b);
        console.log(bullet_list.length);
      }
      break;
  }
}

