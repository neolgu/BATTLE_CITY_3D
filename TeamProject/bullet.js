function testClass()
{
  this.name="name";
  this.functionTest = printTest;
}

function printTest(param)
{
  alert(param)
}

function Bullet()
{
  this.tag="bullet";
  this.x_pos=0;
  this.y_pos=0;
  this.center=[x_pos, y_pos];
  this.shape=[tankSize*0.2,tankSize*0.2];
  this.team= true;
  //normalized vector
  this.direction = vec2(1, 0);
  this.velocity = 0.02;
  this.vertex=[
      vec2(-0.1, 0.1),
      vec2(-0.1, -0.1),
      vec2(0.1, -0.1),
      vec2(0.1, 0.1)
    ];
  this.color = [0, 0, 1, 1];
  //initialize
  this.shoot =function(position, direction)
  {
    this.direction=direction;
    this.x_pos = position[0];
    this.y_pos = position[1];
    this.center =position;
  }
  //calculate new Position
  this.calcNewPos = function()
  {
    this.x_pos += this.direction[0]*this.velocity;
    this.y_pos += this.direction[1]*this.velocity;
    this.center = [this.x_pos, this.y_pos];
  }
  this.collisionCheck=function()
  {
    collision2D(this.center, this.shape);
  }
  this.rendering = function()
  {

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vertex), gl.STATIC_DRAW);
    //Set Attribute Position
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    //Set Attribute Color
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    var tColor = gl.getAttribLocation(program, "tColor");

    if(typeof(this.color[0])=='object'){
      gl.vertexAttribPointer(tColor, 4, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(tColor);
      gl.bufferData(gl.ARRAY_BUFFER, flatten(this.color), gl.STATIC_DRAW);
    }
    else{
      gl.disableVertexAttribArray(tColor);
      gl.vertexAttrib4fv(tColor, this.color);
    }
    //set mat
    ctm = mat4();
    ctm = mult(ctm, translate(this.center[0], this.center[1], 0));
    var uMatrix = gl.getUniformLocation(program, "uMatrix");
    gl.uniformMatrix4fv(uMatrix, false, flatten(ctm));
    renderRect();
  }

}

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
