function Player(){
  //main variables
  this.tag="player";
  this.x_pos=0;
  this.y_pos=0;
  this.rot_dir =0;
  this.shape=[0, 0];
  this.r = 1.0;
  this.speed = 0.008;
  this.center = [this.x_pos, this.y_pos];
  this.position= [0, 0];
  this.obj_list = -1;
  //bullet variables
  this.health = 3;
  this.shoot_available=true;
  this.bulletDelay=800;
  this.team=true;
  this.rotating = false;
  this.moving= 0;
  this.controlable=true;
  this.coord = [];

  this.direction_buffer = [0,0];
  this.theta = 0;
  this.direction = [0, 0];
  
  this.vertex = new Float32Array([
      -0.5, 0.5,
      -0.5, -0.5,
      0.5, -0.5,
      0.5, 0.5
    ]);
  this.color = [0, 1, 0, 1];
  this.constructor =function(position, scale, coord)
    {
      this.shape[0] = scale[0];
      this.shape[1] = scale[1];
      this.x_pos = position[0];
      this.y_pos = position[1];
      this.coord=coord;
      this.center =position;
    }

  this.shoot = function()
  { 
    if(this.shoot_available){
      console.log("Shoot");
      var b = new Bullet();
      b.team=this.team;
      var direction = [this.direction[0], this.direction[1]];//임시 direction
      b.shoot([this.x_pos, this.y_pos], direction, [this.shape[0]*0.2, this.shape[1]*0.2]);//x_pos와 y_pos는 추후 this.x_pos, this.y_pos로 대체/
      this.obj_list.bullet_list.push(b);
      this.shoot_available=false;
      setTimeout(this.available_bullet.bind(this), this.bulletDelay);
    }
  }
  this.damaged = function()
  {
      this.health = this.health -1;
      if(this.health<=0)
      {
        return 0;
      }
      return 1;
  }
  this.available_bullet = function()
  {
    this.shoot_available=true;
  }
  this.rot = function(dir)
  {
    this.theta +=this.r*dir;
    var rad = Math.radians(this.theta)
    this.direction[0] = Math.cos(rad);
    this.direction[1] = Math.sin(rad);
  }

  this.move = function(collision)
  {
    // console.log(this.theta);
    if(this.controlable=false)
      return -1;
    if(this.rot_dir!=0)
    {
      this.rot(this.rot_dir);
    }
    var new_pos_x = (this.speed*this.direction[0])*this.moving + this.x_pos;
    var new_pos_y = (this.speed*this.direction[1])*this.moving + this.y_pos;
    if(Math.abs(new_pos_x)>1||Math.abs(new_pos_y)>1)
      return 0;
    if(!collision)
    {
      this.x_pos = new_pos_x;
      this.center[0] = new_pos_x;
      this.y_pos = new_pos_y;
      this.center[1] = new_pos_y;
    }
    else//충돌 발생
    {
      this.controlable=false;
      for(var times =0; times<5; times++){
        this.x_pos-=this.speed*this.direction_buffer.x*this.moving; //손을 놓으면 direction이 0이 되어버린다.
        this.y_pos-=this.speed*this.direction_buffer.y*this.moving;
        this.center = [this.x_pos, this.y_pos];
      }
      this.controlable=true;
      this.rot(1);
    }
    this.direction_buffer.x=this.direction[0];
    this.direction_buffer.y=this.direction[1];
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
    ctm = mult(ctm, translate(this.position[0], this.position[1], 0));
    //회전이 들어가야 함
    //-----------------------------------------------
    ctm = mult(ctm, translate(this.x_pos, this.y_pos, 0));//moving함수에 따로

    ctm = mult(ctm, rotate(this.theta, 0, 0, 1));
    //이동
    ctm = mult(ctm, scalem(this.shape[0], this.shape[1], 1));
    var uMatrix = gl.getUniformLocation(program, "uMatrix");
    gl.uniformMatrix4fv(uMatrix, false, flatten(ctm));
    renderRect();
  }
}

