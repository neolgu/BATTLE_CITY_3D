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
    case 32://setTimeout이용.
      if(userDefine)//그리고 유저가 발사할 수 있는 상황일 때 --> 이건 유저 함수에서
      {
        player.shoot();
      }
      break;
  }
}

