function Player(){
  this.tag="player";
  this.x_pos=0;
  this.y_pos=0;
  this.shape=[0, 0];
  this.bulletDelay = 800;
  this.center = [this.x_pos, this.y_pos];
  this.position= vec2(0, 0);
  this.shoot_available=true;
  this.bulletDelay=800;
  this.team=true;
  
  this.vertex = [
      vec2(-0.5, 0.5),
      vec2(-0.5, -0.5),
      vec2(0.5, -0.5),
      vec2(0.5, 0.5)
    ];
  this.color = vec4(0, 1, 0, 1)
  this.shoot = function()
  {
    var b = new Bullet();
    b.team=this.team;
    if(this.shoot_available){
      var direction = vec2(1, 0);//임시 direction
      b.shoot([x_pos, y_pos], direction);//x_pos와 y_pos는 추후 this.x_pos, this.y_pos로 대체/
      bullet_list.push(b);
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
}

var UserVertex = [
  vec2(-0.5, 0.5),
  vec2(-0.5, -0.5),
  vec2(0.5, -0.5),
  vec2(0.5, 0.5)
];
