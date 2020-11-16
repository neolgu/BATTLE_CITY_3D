function Enemy(){
    this.tag="enemy";
    this.index=-1;
    this.x_pos=0;
    this.y_pos=0;
    this.shape=[0, 0];

    this.bulletDelay = 2000;
    this.speed = 0.01;
    this.center = [this.x_pos, this.y_pos];
    this.coord=[0,0];
    this.shape = [tankSize,tankSize];
    this.sight = 1.0;
    this.direction=vec2(0, -1);

    this.shoot_available = true;
    this.position= vec2(0, 0);

    this.team=false;


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
    // 50% move
    // 20% shoot
    // 30% rotate
    this.ai_action = function(){
      var ray=false;
      if(userDefine)
        ray = check_ray(this, player, this.sight);
      if(ray)
      {
        this.shoot();
      }
      else{
        var weight = Math.random()*100;
      }
    }
    this.shoot = function(){
        var b = new Bullet();
        b.team=this.team;
        b.setVelocity(0.015);
        if(this.shoot_available){
        //var direction = vec2(0, -1);//임시 direction
        b.shoot([this.x_pos, this.y_pos], this.direction);//direction은 추후 this.direction으로 대체
        bullet_list.push(b);
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
        enemy_list.splice(idx, 1);
    }
  }
  
  var UserVertex = [
    vec2(-0.5, 0.5),
    vec2(-0.5, -0.5),
    vec2(0.5, -0.5),
    vec2(0.5, 0.5)
  ];
  