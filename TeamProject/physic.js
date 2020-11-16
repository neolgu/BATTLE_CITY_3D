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
  for(i=0; i<wall_list.length; i++)
  {
    //[width, width]는 벽돌의 크기가 제각기 다를 때 변형
    if(collisionRect(wall_list[i].center,wall_list[i].shape,[x_pos, y_pos],[tankSize, tankSize]))
    {
      result=true;
    }
  }
  return result;
}
//벽과의 충돌을 감지, 충돌 시 벽의 index를 반환.
//벽의 index는 프레임마다 refresh...
//추후에는 collision object를 반환하도록 변형.
function collision2D(center, shape)
{
  var result = -1;
  for(i=0; i<wall_list.length; i++)
  {
    //[width, width]는 벽돌의 크기가 제각기 다를 때 변형
    if(collisionRect(wall_list[i].center,wall_list[i].shape,center,shape))
    {
      result=i;
    }
  }
  console.log(result);
  return result;
}
//거리 체크
function getDistance(v1, v2)
{
  x1 = v1[0];
  y1 = v1[1];
  x2 = v2[0];
  y2 = v2[1];
  dis = Math.pow(x1- x2, 2) + Math.pow(y1-y2, 2);
  return Math.sqrt(dis);
}

//단순화 된 collision 체크.
//두개의 객체가 완벽히 정사각형일 때만 동작한다.
//일단은 벽과의 충돌체크.
function collision2D_simple(center, r)
{
  var result = -1;
  for(i=0; i<wall_list.length; i++)
  {
      var standard = (r/2) + (wall_list[i].shape[0]/2)
      if(getDistance(center, wall_list[i].center)<standard)
      {
        result=i;
        break;
      }
  }
  return result;
}
//obj는 ray를 쏘는 객체
function check_ray(obj, target, sight)
{
  var obj_direction = obj.direction.slice();
  var center = [x_pos, y_pos];//target.center;//로 바꿔야함
  var shape = [tankSize, tankSize];//target.shape;
  var obj_vector = vec2(center[0]-obj.center[0], center[1]-obj.center[1]);//벡터 계산
  var half = shape[0]/2;//반지름 계산
  var vec_distance = getDistance(obj.center, center);
  
  obj_direction[0] = obj_direction[0]/vec_distance;
  obj_direction[1] = obj_direction[1]/vec_distance; 
  var theta = Math.acos((obj_direction[0]*obj_vector[0])+(obj_direction[1]*obj_vector[1]));
  var direction_distance = Math.cos(theta)*vec_distance;
  
  if(Math.sin(theta)*vec_distance<half&&Math.abs(theta)<1.5&&direction_distance<sight)//cos로, direction과의 거리를 계산., 1.5는 90도
    return true;
  return false;
}

function collision2D_enemy(obj)
{
  result = -1;
  if(obj.tag=="player")
  {
    for(var u_i =0; u_i<enemy_list.length;u_i++)
    {
      if(collisionRect(enemy_list[u_i].center, enemy_list[u_i].shape, obj,center, obj.shape))
      {
        //user Collision Code ==-100
        result=-100;
        break;
      }
    }
  }
  else if(obj.tag==="bullet")//입력이 총알일 때
  {
    for(var u_i =0; u_i<enemy_list.length;u_i++)
    {
      if(obj.team==true)
      {
        var standard = (obj.shape[0]/2) + (enemy_list[u_i].shape[0]/2);
        if(getDistance(obj.center, enemy_list[u_i].center)<standard)
        {
          //user Collision Code ==-100
          result=u_i;
          console.log(result);
          break;
        }
      }
    }
  }
  return result;
}
