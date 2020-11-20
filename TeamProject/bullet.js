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
  this.index=0;
  this.x_pos=0;
  this.y_pos=0;
  this.center=[0, 0];
  this.shape=[tankSize*0.2,tankSize*0.2];
  this.collide=false;
  this.c_object = -1;
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

  this.setVelocity=function(v)
  {
    this.velocity=v;
  }

  //set unique index(global index)
  this.setIndex=function(index)
  {
    this.index=index;
  }
  //calculate new Position
  this.calcNewPos = function()
  {
    this.x_pos += this.direction[0]*this.velocity;
    this.y_pos += this.direction[1]*this.velocity;
    this.center = [this.x_pos, this.y_pos];
  }
  this.collisionCheck=function(i_b)
  {
    result=-1;
    var c = this.center.slice();
    var s = this.shape.slice();
    if(!this.collide){
      var collider=collision2D_simple(c, s[0]);//collision2D(c, s);
      if(collider!=-1)
      {
        garbage_list.push({tag:3, idx:collider});//tag 3 is wall
        garbage_list.push({tag:4, idx:i_b});//tag 4 is bullet
        this.collide=true;
      }
    }
    return collider;
  }
  //tank와 collision Check
  this.collisionCheck_tank=function(i_b)
  {
    result = -1;
    //다를때만 충돌체크
    var collider = collision2D_enemy(this);
    if(collider!=-1)
    {
      garbage_list.push({tag:2, idx:collider});//tag 3 is enemy
      garbage_list.push({tag:4, idx:i_b});//tag 4 is bullet
      this.collide=true;
      console.log("is C!!");
    }
    return collider;
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
  this.frameWork = function()
  {
    this.rendering();
    this.calcNewPos();
  }
  this.free = function(idx)
  {
    if(obj_list!=-1)
    {
      obj_list.bullet_list.splice(idx, 1);
    }
  }
}

