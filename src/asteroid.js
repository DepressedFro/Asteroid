export default class Asteroid
{
  constructor(vertices, x, y, factor, angle, velocity)
  {
    //copy sent vertices
    this.vertices = vertices.slice(0);
    //initial x/y position
    this.x = x;
    this.y = y;
    this.size = factor;
    this.angle = angle
    this.splitTimes = 0;
    this.velocity = {
      x: velocity*Math.cos(this.angle),
      y: velocity*Math.sin(this.angle)
    };
    this.length = this.vertices.length;

    this.rotate = this.rotate.bind(this);
    this.scale = this.scale.bind(this);
    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
    //create it with a random size
    this.scale(factor);
  }

//rotates by the given angle
  rotate(theta)
  {
      var sin = Math.sin(theta);
      var cos = Math.cos(theta);

      for (var i = 0; i < this.length; i+=2)
      {
        var x = this.vertices[i];
        var y = this.vertices[i+1];

        this.vertices[i] = (cos*x - sin*y) ;
        this.vertices[i+1] = (sin*x + cos*y);
      }
  }

  //scales all vertices by the given factor
  scale(factor)
  {
    for(var i = 0; i < this.length; i++)
    {
      this.vertices[i] *= factor;
    }
  }

  update()
  {
    this.rotate(.01);

    if(this.velocity.x < -4)
    {
      this.velocity.x = -4;
    }
    else if(this.velocity.x > 4)
    {
      this.velocity.x = 4;
    }
    if(this.velocity.y < -4)
    {
      this.velocity.y = -4;
    }
    else if(this.velocity.y > 4)
    {
      this.velocity.y = 4;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
    //OOB check
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
    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(this.vertices[0] + this.x, this.vertices[1] + this.y);
    for(var i = 2; i < this.length; i += 2)
    {
      ctx.lineTo(this.vertices[i] + this.x, this.vertices[i + 1] + this.y);
    }
    ctx.stroke();
    ctx.restore();
  }

}
