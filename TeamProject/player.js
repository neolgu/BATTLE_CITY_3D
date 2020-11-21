function Player(){
  this.tag="player";
  this.x_pos=0;
  this.y_pos=0;
  this.rot_dir =0;
  this.shape=[tankSize, tankSize];
  this.bulletDelay = 0.5;
  this.speed = 0.008;
  this.center = [this.x_pos, this.y_pos];
  this.position= [0, 0];
  this.shoot_available=true;
  this.bulletDelay=800;
  this.r = 1.0;
  this.team=true;
  this.direction_x=0;
  this.direction_y=0;
  this.moving= 0;
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
  this.shoot = function()
  {
    var b = new Bullet();
    b.team=this.team;
    if(this.shoot_available){
      var direction = [this.direction[0], this.direction[1]];//임시 direction
      b.shoot([this.x_pos, this.y_pos], direction);//x_pos와 y_pos는 추후 this.x_pos, this.y_pos로 대체/
      obj_list.bullet_list.push(b);
      this.shoot_available=false;
      setTimeout(this.available_bullet.bind(this), this.bulletDelay);
    }
  }
  this.damaged = function()
  {
      console.log("damaged!");
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
  this.rendering = function()
  {
    if(this.rot_dir!=0)
    {
      this.rot(this.rot_dir);
    }

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
    var new_pos_x = (this.speed*this.direction[0])*this.moving + this.x_pos;
    var new_pos_y = (this.speed*this.direction[1])*this.moving + this.y_pos;

    var collision = obj_list.player_action();
    if(!collision)
    {
      this.x_pos = new_pos_x;//+=speed*direction_x;
      this.center[0] = new_pos_x;
      this.y_pos = new_pos_y;//+=speed*direction_y;
      this.center[1] = new_pos_y;
    }
    else//충돌 발생
    {
      if(this.direction_buffer!=[0,0])
      {
          this.x_pos-=this.speed*this.direction_buffer.x*(2)*this.moving; //손을 놓으면 direction이 0이 되어버린다.
          this.y_pos-=this.speed*this.direction_buffer.y*(2)*this.moving;
          this.direction_buffer=[0,0];
      }
      else
      {
        this.x_pos-=this.speed*this.direction_x*(2)*this.moving; //손을 놓으면 direction이 0이 되어버린다.
        this.y_pos-=this.speed*this.direction_y*(2)*this.moving;
      }


      this.direction_x=0;
      this.direction_y=0;
    }
    this.direction_buffer.x=this.direction[0];
    this.direction_buffer.y=this.direction[1];

    ctm = mult(ctm, translate(this.x_pos, this.y_pos, 0));//moving함수에 따로

    ctm = mult(ctm, rotate(this.theta, 0, 0, 1));
    //이동
    ctm = mult(ctm, scalem(this.shape[0], this.shape[1], 1));
    var uMatrix = gl.getUniformLocation(program, "uMatrix");
    gl.uniformMatrix4fv(uMatrix, false, flatten(ctm));
    renderRect();
  }
}


Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

