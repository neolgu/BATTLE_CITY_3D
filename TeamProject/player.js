function User(){
  this.tag="player";
  this.x_pos=0;
  this.y_pos=0;
  this.shape=[0, 0];
  this.bulletDelay = 0.5;
  this.center = [this.x_pos, this.y_pos];
  this.position= vec2(0, 0);

  this.vertex = [
      vec2(-0.5, 0.5),
      vec2(-0.5, -0.5),
      vec2(0.5, -0.5),
      vec2(0.5, 0.5)
    ];
  this.color = vec4(0, 1, 0, 1)
}

var UserVertex = [
  vec2(-0.5, 0.5),
  vec2(-0.5, -0.5),
  vec2(0.5, -0.5),
  vec2(0.5, 0.5)
];
