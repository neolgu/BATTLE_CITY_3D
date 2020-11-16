
function Wall()
{
  this.tag="wall";

  this.index=0;

  this.x_pos = 0;
  this.y_pos = 0;
  this.coord =[0, 0];
  this.center = [x_pos, y_pos];
  this.shape = [width,width];
  this.scale =0;
  //normalized vector
  this.vertex=[
      vec2(-0.5, 0.5),
      vec2(-0.5, -0.5),
      vec2(0.5, -0.5),
      vec2(0.5, 0.5)
    ];
  this.color = [1, 0, 1, 1];
  //initialize
  this.constructor =function(position, scale, coord)
  {
    this.shape[0] = scale[0];
    this.shape[1] = scale[1];
    this.x_pos = position[0];
    this.y_pos = position[1];
    this.coord=coord;
    this.center =position;
  }
  //set global index
  this.setIndex=function(index)
  {
    this.index=index;
  }
  this.collisionCheck=function()
  {
    collision2D(this.center, this.shape);
  }
  //모든 Object에게 공통적으로 존재하는 function. 자신의 vertex에 맞게, 자신의 color에 맞게
  //rendering을 수행한다. 호출은 triangle.js(main)에서 진행된다.
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
    ctm = mult(ctm, scalem(this.shape[0], this.shape[1], 1));
    var uMatrix = gl.getUniformLocation(program, "uMatrix");
    gl.uniformMatrix4fv(uMatrix, false, flatten(ctm));
    renderRect();
  }
  this.free = function(idx)
  {
    wall_list.splice(idx,1);
  }
}
