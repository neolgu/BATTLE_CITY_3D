var canvas;
var gl;

var numVertices  = 36;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
//사용자 객체값...
//x_pos와 y_pos는 추후 player의 객체 값으로 대체되어야 한다.
var player;

var x_pos=0;
var y_pos=0;
var direction_buffer=vec2(0,0);
var speed = 0.01;
var direction_x = 0;
var direction_y = 0;
var x_dial=0;
var axis = 0;
var userDefine=false;
//상하좌우
var can_move_direction = vec4(1,1,1,1);
var theta = [ 0, 0, 0 ];
//벽들(위치)을 저장하는 배열(vector 형태/ 중심값을 저장하고, width를 이용해 충돌판정.)
var walls =[];
var wall_list=[];
//총알들을 저장하는 배열. 어차피 객체들이 정의 완료될 때 객체배열로 합쳐질 것이다.
var bullet_list =[];
//벽들의 shape를 저장하는 배열(어차피 형태가 같아서 의미 없다.)
var shapes =[];
//적들을 저장하는 배열
var enemy_list=[];

var garbage_list=[];
var thetaLoc;
var uMatrix;

//initial point
var userPosition = [0, 0, 0];
var userMoving = false;
var maximumEnemy = 30;
//dep
var obj_indexer = 0;
//오류 방지를 위한 파트
var c_iter=1;
//1=user, 2=enemy, 3=wall, 4=commandCentor
var map1 = [
           0, 0, 0, 0, 0,
           3, 0, 0, 2, 0,
           3, 0, 3, 3, 3,
           0, 0, 3, 0, 3,
           0, 0, 3, 0, 0];

var width = 2/Math.sqrt(map1.length); //
var center = width/2;
var tankSize = width*0.7

var program;
var vertexBuffer;
var colorBuffer;

var mapBuffer;
var mapColorBuffer;

window.onload = function init()
{
  var canvas = document.getElementById( "gl-canvas" );
  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }

  var vertices =  new Float32Array([0, 0.5,
                  -0.5, -0.5,
                  0.5, -0.5]);

  var colors = [ vec4(1.0, 0.0, 0.0, 1.0),
                vec4(0.0, 1.0, 0.0, 1.0),
                vec4(0.0, 0.0, 1.0, 1.0)];

  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
  //var classTest = new testClass();
  //classTest.functionTest("hello");

  program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );

  vertexBuffer = gl.createBuffer();
  colorBuffer = gl.createBuffer();
  mapDefine(map1);

  //event listeners for buttons
  window.addEventListener('keydown',input);
  window.addEventListener('keyup',keyupEvent);
  player = new Player();
  x_pos=-0.75;
  y_pos=-0.75;
  userDefine=true;
  setInterval(frameWork, 10);
};
//사살상 main역할
function frameWork()
{
  gl.clear(gl.COLOR_BUFFER_BIT);
  //drawRect([1, 0, 0, 1], [0.5, 0.5, 0, 0], width, false);
  //drawRect([1, 0, 0, 1], [-0.5, -0.5, 0, 0], width, false);

  //mapGenerator(map1);

  if(bullet_list.length>5)
    bullet_list.shift();
  for(t=0;t<bullet_list.length;t++)
  {
    //bullet이 frame에서 수행해야 할 작업.
    //이건 bullet에 함수화 하셈.
    var obj = -1;
    bullet_list[t].calcNewPos();
    result = bullet_list[t].collisionCheck_tank(t);
    //if(!bullet_list[t].collide)//충돌한 적이 없을 때...
    //  result = collision2D_simple(bullet_list[t].center, bullet_list[t].shape[0]);
    if(result==-1)
      result = bullet_list[t].collisionCheck(t);
    if(result==9999)//잠시 안쓰도록
    {
      bullet_list[t].free(t);
      //wall_list[result].free(result);//마음에 안드는데 방법이 없음
      break;
    }
    bullet_list[t].rendering();
    //collision 발생 시 splice이용, 제거 일단은 pop으로 제거한다.
  }
  for(i=0;i<wall_list.length;i++)
  {
    //wall이 frame에서 수행해야 할 작업.
    //이건 wall에 함수화 하셈
    wall_list[i].rendering();
  }
  for(e_i=0;e_i<enemy_list.length;e_i++)
  {
    enemy_list[e_i].rendering();
  }
  //garbage_list에 있는 객체들 전부 제거
  garbage_list.sort(function(a, b){
    a.idx>b.idx?-1:a.idx<b.idx?1:0;
  });
  for(var g=0; g<garbage_list.length;g++)
  {
    remove_object(garbage_list[g]);
  }
  garbage_list.length=0;//initialize..
  //userRendering...
  drawRect([0, 1, 0, 1], [0, 0, 0, 0], tankSize, true);
}
function remove_object(target)
{
  if(target.tag==3)
  {
    wall_list[target.idx].free(target.idx);
  }
  else if(target.tag==4)
  {
    bullet_list[target.idx].free(target.idx); 
  }
  else if(target.tag==2)
  {
    enemy_list[target.idx].free(target.idx);
  }
  else if(target.tag==1)
  {
    console.log("You Died");
  }
}



function drawRect(color, position, scale, isPlayer){

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(rectVertex), gl.STATIC_DRAW);
//Set Attribute Position
  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);
//Set Attribute Color
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  var tColor = gl.getAttribLocation(program, "tColor");

  if(typeof(color[0])=='object'){
    gl.vertexAttribPointer(tColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(tColor);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(color), gl.STATIC_DRAW);
  }
  else{
    gl.disableVertexAttribArray(tColor);
    gl.vertexAttrib4fv(tColor, color);
  }

  ctm = mat4();
  ctm = mult(ctm, translate(position[0], position[1], 0));//moving함수에 따로
  collision=false;
  if(isPlayer){
    new_pos_x = speed*direction_x + x_pos;
    new_pos_y = speed*direction_y + y_pos;

    collision = collisionTest()
    if(!(collision))
    {
      x_pos=new_pos_x;//+=speed*direction_x;
      y_pos=new_pos_y;//+=speed*direction_y;
      direction_buffer.x=direction_x;
      direction_buffer.y=direction_y;
    }
    else
    {
      if(direction_buffer!=vec2(0,0))
      {
         x_pos-=speed*direction_buffer.x*(2); //손을 놓으면 direction이 0이 되어버린다.
         y_pos-=speed*direction_buffer.y*(2);
         direction_buffer=vec2(0,0);
      }
      else
      {
      x_pos-=speed*direction_x*(2); //손을 놓으면 direction이 0이 되어버린다.
      y_pos-=speed*direction_y*(2);
      }
      direction_x=0;
      direction_y=0;
    }
    ctm = mult(ctm, translate(x_pos, y_pos, 0));//moving함수에 따로

  }
  ctm =mult(ctm, scalem(scale, scale, scale));//scaling
  //setStartPoint
  var uPosition = gl.getUniformLocation(program, "uPosition");
  var uMatrix = gl.getUniformLocation(program, "uMatrix");
  gl.uniformMatrix4fv(uMatrix, false, flatten(ctm));
  renderRect();
}



//map에서 block code는 3
//지금은 안쓰이는 함수
function mapGenerator(map)
{
  var axis_num=Math.sqrt(map.length);
  var w = 2/axis_num;
  x = -1+(w/2);//initial_coord
  y = 1-w/2;
  for(i=0;i<axis_num;i++)
  {
    var currentY= y-(i*w);
    for(j=0;j<axis_num;j++)
    {
      var currentX=x+(j*w);
      //when wall exist...
      if(map[(i*axis_num)+j]==3)
      {
        walls.push([currentX, currentY]);
        drawRect([1, 0, 0, 1], [currentX, currentY, 0, 0], width, false);
      }
    }
  }
}

//map에서 block code는 3
function mapDefine(map)
{
  var axis_num=Math.sqrt(map.length);
  var w = 2/axis_num;
  x = -1+(w/2);//initial_coord
  y = 1-w/2;
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
        wall_instance.constructor([currentX, currentY],[width, width],[j, i]);
        wall_list.push(wall_instance);
      }
      if(map[(i*axis_num)+j]==2)
      {
        var enemy_instance=new Enemy();
        enemy_instance.index=obj_indexer++;
        enemy_instance.constructor([currentX, currentY],[tankSize, tankSize],[j, i]);
        enemy_list.push(enemy_instance);
      }
    }
  }
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, 3 );
}
function renderRect(){
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}
var rectVertex=[vec2(-0.5, 0.5),
               vec2(-0.5, -0.5),
               vec2(0.5, -0.5),
               vec2(0.5, 0.5)];
