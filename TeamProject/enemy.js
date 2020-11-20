function Enemy(){
    this.tag="enemy";
    this.index=-1;
    this.x_pos=0;
    this.y_pos=0;
    this.shape=[0, 0];

    this.bulletDelay = 2000;
    this.speed = 0.005;
    this.center = [this.x_pos, this.y_pos];
    this.coord=[0,0];
    this.shape = [tankSize,tankSize];
    this.sight = 1.0;
    this.predict_sight = 0.8;
    this.direction=[0, -1];
    this.rot_dir = -1;
    this.theta=-90;
    this.r = 3.0;
    this.shoot_available = true;
    this.position= vec2(0, 0);

    this.team=false;
    this.sight_object=-1;
    this.moveable = true;

    this.vertex = [
        vec2(-0.5, 0.5),
        vec2(-0.5, -0.5),
        vec2(0.5, -0.5),
        vec2(0.5, 0.5)
      ];
      
    this.color = vec4(1, 0, 0, 1)
    this.constructor =function(position, scale, coord)
    {
      this.shape[0] = scale[0];
      this.shape[1] = scale[1];
      this.x_pos = position[0];
      this.y_pos = position[1];
      this.coord=coord;
      this.center =position;
    }

    // if, direction에 user가 있을 때 shoot 우선
    // 80% move& rotate --> ray에서 obj가 있을 때 rotate
    // 20% shoot
    this.ai_action = function(){
      var ray=false;
      if(userDefine)
        ray = check_ray(this, obj_list.player, this.sight, this.shape[0]/2);
      if(ray)
      {
        this.shoot();
      }
      else{
        if(this.sight_object==3||this.sight_object==2)
        {
            //rotate 5%의 확률로 쏘거나, 움직인다.
            var rand_state = Math.random()*10;
            if(rand_state>0.1)
              this.rot(this.rot_dir);
            else
              this.shoot();
        }
        else{
          var weight = Math.random();
          if(weight<0.001)
          {
            this.shoot();
          }
          else if(weight<0.5)
          {
            var n_post_x = (this.speed*this.direction[0]) + this.x_pos;
            var n_post_y = (this.speed*this.direction[1]) + this.y_pos;
            this.move([n_post_x, n_post_y]);
          }
        }
      }
    }
    this.move = function(coord)
    {
      if(this.moveable)
      {
        this.center = coord;
        this.x_pos = coord[0];
        this.y_pos = coord[1];
      }
      else{
        rot(this.rot_dir);
        var n_post_x = (this.speed*-this.direction[0]) + this.x_pos;
        var n_post_y = (this.speed*-this.direction[1]) + this.y_pos; 
        this.moveable=true;
      }
    }
    this.rot = function(dir)//dir은 theta가 어떤 방향으로 도는지
    {
      this.theta +=this.r * dir;
      var rad = Math.radians(this.theta);
      this.direction[0] = Math.cos(rad);
      this.direction[1] = Math.sin(rad);
    }
    this.setTheta = function(theta)
    {
      var rad = Math.radians(theta);
      this.theta = theta
      this.direction[0] = Math.cos(rad);
      this.direction[1] = Math.sin(rad);
    }
    this.shoot = function(){
        var b = new Bullet();
        b.team=this.team;
        b.setVelocity(0.015);
        if(this.shoot_available){
        //var direction = vec2(0, -1);//임시 direction
        var dir = vec2(this.direction[0], this.direction[1]);
        b.shoot([this.x_pos, this.y_pos], this.direction.slice());//direction은 추후 this.direction으로 대체
        obj_list.bullet_list.push(b);
        this.shoot_available=false;
        setTimeout(this.available_bullet.bind(this), this.bulletDelay);
      }
    }

    this.available_bullet = function()
    {
        this.shoot_available=true;
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
        //회전이 들어가야 함
        //-----------------------------------------------
        ctm = mult(ctm, scalem(this.shape[0], this.shape[1], 1));
        ctm = mult(ctm, rotate(this.theta, 0, 0, 1));
        var uMatrix = gl.getUniformLocation(program, "uMatrix");
        gl.uniformMatrix4fv(uMatrix, false, flatten(ctm));
        renderRect();
    }
    this.damaged = function()
    {
        console.log("damaged!")
    }
    this.free = function(idx)
    {
      //free하면서 일어나는 일들.
    }
  }
  
  var UserVertex = [
    vec2(-0.5, 0.5),
    vec2(-0.5, -0.5),
    vec2(0.5, -0.5),
    vec2(0.5, 0.5)
  ];
  