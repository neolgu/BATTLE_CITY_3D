//center1, width1 ==> 대상1, center2, width2 ==>대상2(움직이는 물체)
function collisionRect(center1, shape1, center2, shape2){
  //각 방향의 limit을 획득
  var result=false;
  // 움직이지 않는 대상(피)
  var left_limit = center1[0]-shape1[0]/2;
  var right_limit = center1[0]+shape1[0]/2;
  var top_limit = center1[1]+shape1[1]/2;
  var bot_limit = center1[1]-shape1[1]/2;
  // 주체
  //방향을 저장해놓는 배열

  var left_top = center2.slice();
  left_top[0] -= shape2[0]/2
  left_top[1] +=shape2[1]/2
  var right_top=center2.slice();
  right_top[0] += shape2[0]/2;
  right_top[1] +=shape2[1]/2;
  var left_bottom = center2.slice();
  left_bottom[0] -=shape2[0]/2;
  left_bottom[1] -=shape2[1]/2;
  var right_bottom = center2.slice();
  right_bottom[0] +=shape2[0]/2;
  right_bottom[1] -=shape2[1]/2;

  if(left_top[0]<right_limit&&left_top[0]>left_limit){
      if(left_top[1]>bot_limit&&left_top[1]<top_limit)
      {
        result=true;
      }
    }
  if(right_top[0]<right_limit&&right_top[0]>left_limit){
      if(right_top[1]>bot_limit&&right_top[1]<top_limit)
      {
        result=true;
      }
    }
  if(left_bottom[0]<right_limit&&left_bottom[0]>left_limit){
      if(left_bottom[1]>bot_limit&&left_bottom[1]<top_limit)
      {
        result=true;
      }
    }
  if(right_bottom[0]<right_limit&&right_bottom[0]>left_limit){
      if(right_bottom[1]>bot_limit&&right_bottom[1]<top_limit)
      {
        result=true;
      }
    }
  return result;
}

//center1, width1 ==> 대상1, center2, width2 ==>대상2(움직이는 물체)
//모든 object는 배열 형태의 center, shape를 갖는다. 이 둘은 길이가 2인 배열.
function collisionObject(object1, object2){
  //각 방향의 limit을 획득
  center1 = object1.center;
  center2 = object2.center;
  shape1= object1.shape;
  shape2 = object2.shape;
  var result=false;
  // 움직이지 않는 대상(피)
  var left_limit = center1[0]-shape1[0]/2;
  var right_limit = center1[0]+shape1[0]/2;
  var top_limit = center1[1]+shape1[1]/2;
  var bot_limit = center1[1]-shape1[1]/2;
  // 주체
  //방향을 저장해놓는 배열

  var left_top = center2.slice();
  left_top[0] -= shape2[0]/2
  left_top[1] +=shape2[1]/2
  var right_top=center2.slice();
  right_top[0] += shape2[0]/2;
  right_top[1] +=shape2[1]/2;
  var left_bottom = center2.slice();
  left_bottom[0] -=shape2[0]/2;
  left_bottom[1] -=shape2[1]/2;
  var right_bottom = center2.slice();
  right_bottom[0] +=shape2[0]/2;
  right_bottom[1] -=shape2[1]/2;

  if(left_top[0]<right_limit&&left_top[0]>left_limit){
      if(left_top[1]>bot_limit&&left_top[1]<top_limit)
      {
        result=true;
      }
    }
  if(right_top[0]<right_limit&&right_top[0]>left_limit){
      if(right_top[1]>bot_limit&&right_top[1]<top_limit)
      {
        result=true;
      }
    }
  if(left_bottom[0]<right_limit&&left_bottom[0]>left_limit){
      if(left_bottom[1]>bot_limit&&left_bottom[1]<top_limit)
      {
        result=true;
      }
    }
  if(right_bottom[0]<right_limit&&right_bottom[0]>left_limit){
      if(right_bottom[1]>bot_limit&&right_bottom[1]<top_limit)
      {
        result=true;
      }
    }
  return result;
}
//object 리스트, object를 입력으로 받아야한다. 고쳐~~~
function collisionTest(center, shape)
{
  var result = false;
  for(i=0; i<walls.length; i++)
  {
    //[width, width]는 벽돌의 크기가 제각기 다를 때 변형
    if(collisionRect(walls[i],[width, width],[x_pos, y_pos],[tankSize, tankSize]))
    {
      result=true;
    }
  }
  return result;
}
