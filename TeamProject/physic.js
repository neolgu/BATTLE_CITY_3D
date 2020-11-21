//center1, width1 ==> 대상1, center2, width2 ==>대상2(움직이는 물체)
function collisionRect(center1, shape1, center2, shape2, theta){
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
    if(result)
  return result;
}
function rotate(point, center, theta)
{
  var c = center.slice();
  var vector = [point[0]-c[0], point[1]-c[1]];
  vector = vectorNormalization(vector);
  var radian = Math.radians(theta);
  var new_x = Math.cos(radian)*vector[0]-Math.sin(radian)*vector[1];
  var new_y = Math.sin(radian)*vector[0]+Math.cos(radian)*vector[1];
  return [new_x+c[0], new_y+c[1]];
}

function vectorNormalization(vector)
{
  var r = Math.sqrt((vector[0]*vector[0])+(vector[1]*vector[1]))
  var result = [vector[0]/r, vector[1]/r];
  return result;
}
//center1, width1 ==> 대상1, center2, width2 ==>대상2(움직이는 물체)
//모든 object는 배열 형태의 center, shape를 갖는다. 이 둘은 길이가 2인 배열.
function collisionObject(object1, object2){
  //각 방향의 limit을 획득
  var center1 = object1.center;
  var center2 = object2.center;
  var shape1= object1.shape;
  var shape2 = object2.shape;
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
//일단은 벽과의 충돌체크에 이용
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

function CircleCollider(obj1, obj2)
{
  var center1= obj1.center;
  var center2 = obj2.center;
  
  var standard = (obj1.shape[0]/2) + (obj2.shape[0]/2);
  if(getDistance(center1, center2)<standard)
    return true;
  else return false;
}

//obj는 ray를 쏘는 객체
function check_ray(obj, target, sight, wid)
{
  var obj_direction = obj.direction.slice();
  var center = [target.x_pos, target.y_pos];//target.center;//로 바꿔야함
  var shape = target.shape.slice();
  var obj_vector = [center[0]-obj.center[0], center[1]-obj.center[1]];//벡터 계산
  var half = wid;//shape[0]/2;//반지름 계산
  var vec_distance = getDistance(obj.center, center);

  obj_direction[0] = obj_direction[0]/vec_distance;//normalization
  obj_direction[1] = obj_direction[1]/vec_distance;
  var theta = Math.acos((obj_direction[0]*obj_vector[0])+(obj_direction[1]*obj_vector[1]));

  var direction_distance = Math.cos(theta)*vec_distance;
  if(Math.abs(Math.sin(theta))*vec_distance<half&&Math.abs(theta)<1.5 &&direction_distance<sight)//cos로, direction과의 거리를 계산., 1.5는 90도
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

Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};
