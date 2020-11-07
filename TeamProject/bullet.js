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
  this.shape=[0,0];
  //normalized vector
  this.direction = vec4(1, 0);
  this.vertex=[
      vec2(-0.1, 0.1),
      vec2(-0.1, -0.1),
      vec2(0.1, -0.1),
      vec2(0.1, 0.1)
    ];
}
