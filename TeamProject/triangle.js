var canvas;
var gl;

var numVertices  = 36;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

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
//총알들을 저장하는 배열. 어차피 객체들이 정의 완료될 때 객체배열로 합쳐질 것이다.
var bullet_list =[];
//벽들의 shape를 저장하는 배열(어차피 형태가 같아서 의미 없다.)
var shapes =[];
var thetaLoc;
var uMatrix;

//initial point
var userPosition = [0, 0, 0];
var userMoving = false;
var maximumEnemy = 30;
//오류 방지를 위한 파트
var c_iter=1;
//1=user, 2=enemy, 3=wall, 4=commandCentor
var map1 = [
           0, 0, 0, 0, 0,
           3, 0, 0, 0, 0,
           3, 0, 3, 0, 3,
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


    //event listeners for buttons
    window.addEventListener('keydown',input);
    window.addEventListener('keyup',keyupEvent);

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

  mapGenerator(map1);
  drawRect([0, 1, 0, 1], [0, 0, 0, 0], tankSize, true);
  if(bullet_list.length>5)
    bullet_list.shift();
  for(i=0;i<bullet_list.length;i++)
  {
    bullet_list[i].calcNewPos();
    bullet_list[i].rendering();
    //collision 발생 시 splice이용, 제거 일단은 pop으로 제거한다.
  }
}




function drawRect(color, position, scale, player){

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
  if(player){
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
