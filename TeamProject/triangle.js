var canvas;
var gl;


//사용자 객체값...
//x_pos와 y_pos는 추후 player의 객체 값으로 대체되어야 한다.
var speed = 0.01;
var direction_x = 0;
var direction_y = 0;
var x_dial=0;
var axis = 0;
var userDefine=false;
//상하좌우
var game;

var obj_list=-1;
var uMatrix;

var obj_indexer = 0;
//오류 방지를 위한 파트
//1=user, 2=enemy, 3=wall, 4=commandCentor
var map1 = [
           0, 0, 0, 0, 0,
           3, 0, 0, 2, 0,
           3, 0, 3, 3, 3,
           0, 0, 3, 0, 0,
           0, 0, 3, 0, 0];

var width = 2/Math.sqrt(map1.length); //
var center = width/2;
var tankSize = width*0.7;

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

  obj_list = new ObjectList();
  game = new GameManager();
  game.initializer();

};
//사살상 main역할
function frameWork()
{
  gl.clear(gl.COLOR_BUFFER_BIT);
  //drawRect([1, 0, 0, 1], [0.5, 0.5, 0, 0], width, false);
  //drawRect([1, 0, 0, 1], [-0.5, -0.5, 0, 0], width, false);

  //mapGenerator(map1);

  obj_list.frameWork();
  for(i=0;i<obj_list.wall_list.length;i++)
  {
    //wall이 frame에서 수행해야 할 작업.
    //이건 wall에 함수화 하셈
    obj_list.wall_list[i].rendering();
  }
  for(e_i=0;e_i<obj_list.enemy_list.length;e_i++)
  {
    obj_list.enemy_list[e_i].ai_action();
    obj_list.enemy_list[e_i].rendering();
  }
  //
  coordRefactor();
  //
  //userRendering...
  //drawRect([0, 1, 0, 1], [0, 0, 0, 0], tankSize, true);
  obj_list.player.rendering();
}
//map에서 block code는 3
function mapDefine(map)
{
  var axis_num=Math.sqrt(map.length);
  var w = 2/axis_num;
  x = -1+(w/2);//initial_coord
  y = 1-w/2;
  generateSuperWall([2, 2]);
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
        obj_list.wall_list.push(wall_instance);
      }
      if(map[(i*axis_num)+j]==2)
      {
        var enemy_instance=new Enemy();
        enemy_instance.index=obj_indexer++;
        enemy_instance.rot(-2);
        enemy_instance.constructor([currentX, currentY],[tankSize, tankSize],[j, i]);
        obj_list.enemy_list.push(enemy_instance);
      }
    }
  }
}
//뚫을 수 없는 벽 생성
function generateSuperWall(shape)
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
    wall_instance.index = obj_indexer++;
    wall_instance.constructor(current_center, shape, [-1, -1]);
    wall_instance.overwhelming = true;
    obj_list.wall_list.push(wall_instance);
  }
}
function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, 3 );
}
function renderRect(){
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

function coordRefactor()
{
  var axis_num = Math.sqrt(map1.length);
  var coord_x = obj_list.player.x_pos+1;
  var coord_y = -obj_list.player.y_pos+1;
  coord_x= Math.floor(coord_x/width);
  coord_y=Math.floor(coord_y/width);
}
