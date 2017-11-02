//lasers that the ship shoots

export default class Laser
{
  constructor(x, y, angle)
  {
    this.x = x;
    this.y = y;
    this.remove = false;

    var velocity = 5;
    this.velocity = {
      x: velocity*Math.cos(angle),
      y: velocity*Math.sin(angle)
    };

    this.getRemove = this.getRemove.bind(this);
    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
  }

  getRemove()
  {
    return this.remove;
  }

  update()
  {
    this.lastx = this.x;
    this.lasty = this.y;

    this.x += this.velocity.x;
    this.y += this.velocity.y;
    //set the laser to be destroyed if it goes OOB
    if(this.x > 1000)
    {
      this.remove = true;
    }
    else if(this.x < 0)
    {
      this.remove = true;
    }
    if(this.y > 1000)
    {
      this.remove = true;
    }
    if(this.y < 0)
    {
      this.remove = true;
    }
  }

  render(ctx)
  {
    ctx.save();
    ctx.strokeStyle = "#fff";
    ctx.beginPath()
    ctx.moveTo(this.lastx, this.lasty);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }
}
