import Laser from './laser';

export default class Ship
{
  constructor()
  {
    this.x = 500;
    this.y = 500;
    var velocity = 0;
    //sets the angle to be parallel
    this.angle = 3*Math.PI/2;
    //0, -2 is the middle of the front of the ship
    this.vertices = [0,0,-2,1,-1,-3,0,-2,1,-3,2,1,0,0];
    this.thruster = [0,0,-1,1,-1,2,0,3,1,2,1,1,0,0];
    this.thrusting = false;
    this.length = this.vertices.length;
    this.velocity = {
      x: velocity*Math.cos(this.angle),
      y: velocity*Math.sin(this.angle)
    };
    this.scale = this.scale.bind(this);
    this.warp = this.warp.bind(this);
    this.shoot = this.shoot.bind(this);
    this.rotate = this.rotate.bind(this);
    this.thrust = this.thrust.bind(this);
    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
    this.scale(4);
  }

  //scales all vertices by the given factor
  scale(factor)
  {
    for(var i = 0; i < this.length; i++)
    {
      this.vertices[i] *= factor;
    }
    for(var i = 0; i < this.thruster.length; i++)
    {
      this.thruster[i] *= factor;
    }
  }

  warp()
  {
    this.x = Math.random() * 1000 + 100;
    this.y = Math.random() * 1000 + 100;
  }
  //rotates by the given angle
  rotate(theta)
  {
      var sin = Math.sin(theta);
      var cos = Math.cos(theta);
      this.angle += theta;

      for (var i = 0; i < this.length; i+=2)
      {
        var x = this.vertices[i];
        var y = this.vertices[i+1];

        this.vertices[i] = (cos*x - sin*y) ;
        this.vertices[i+1] = (sin*x + cos*y);
      }
      for (var i = 0; i < this.thruster.length; i+=2)
      {
        var x = this.thruster[i];
        var y = this.thruster[i+1];

        this.thruster[i] = (cos*x - sin*y) ;
        this.thruster[i+1] = (sin*x + cos*y);
      }
  }

  thrust()
  {
    this.thrusting = true;
    if(this.velocity.x *this.velocity.x + this.velocity.y * this.velocity.y < 20*20)
    {
      this.velocity.x += 0.06*Math.cos(this.angle);
      this.velocity.y += 0.06*Math.sin(this.angle);
    }
  }

  shoot()
  {
    var laser = new Laser(this.vertices[6] + this.x, this.vertices[7] + this.y, this.angle);
    return laser;
  }

  update()
  {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    if(this.x > 1000)
    {
      this.x = 0;
    }
    else if(this.x < 0)
    {
      this.x = 1000;
    }
    if(this.y > 1000)
    {
      this.y = 0;
    }
    if(this.y < 0)
    {
      this.y = 1000;
    }

  }

  render(ctx)
  {
    ctx.save();

    //for drawing the ship
    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(this.vertices[0] + this.x, this.vertices[1] + this.y);
    for(var i = 2; i < this.length; i += 2)
    {
      ctx.lineTo(this.vertices[i] + this.x, this.vertices[i + 1] + this.y);
    }
    ctx.stroke();
    ctx.closePath();

    //for drawing the engine fire
    if(this.thrusting === true)
    {
      ctx.beginPath();
      ctx.moveTo(this.thruster[0] + this.x, this.thruster[1] + this.y);
      for(var i = 2; i < this.thruster.length; i += 2)
      {
        ctx.lineTo(this.thruster[i] + this.x, this.thruster[i + 1] + this.y);
      }
      ctx.stroke();
      ctx.closePath();
      this.thrusting = false;
    }


    ctx.restore();
  }
}
