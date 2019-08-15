//game logic
import Asteroid from './asteroid';
import Ship from './ship';
import Laster from './laser';
export default class Game
{
  constructor()
  {
    var state = {current: "start"};
    this.shapes = {Asteroids: [
      [-3,-2,1,-4,4,-3,5,0,4,2,-1,4,-3,2,-3,-2],
      [-4,-1,-5,2,-3,4,-1,2,2,4,3,2,5,0,3,-2,2,-5,-1,-4,-4,-4,-4,-1],
      [-3,-3,2,-4,3,0,2,4,-3,5,-4,2,-2,0,-4,-2,-3,-3],
      [-4,-2,-2,-4,0,-4,3,-2,3,0,2,3,-1,3,-4,2,-5,-1,-4,-2],
      [-3,1,-6,-2,-3,-5,1,-4,0,-2,3,-4,5,-2,3,3,1,2,-3,1],
      [-3,-4,-1,-6,3,-5,2,-4,4,-4,5,-3,5,1,1,3,0,2,-3,2,-3,0,-5,-2,-3,-4]
    ],
    Sizes:
    [[1],
    [4],
    [2],
    [5],
    [3],
    [5]],
    Numbers:
    [
      [-1,-2,1,-2,1,2,-1,2,-1,-2], //0
      [-1,-1,0,-2,0,2,-1,2,1,2],
      [-1,-2,1,-2,1,0,-1,0,-1,2,1,2],
      [-1,-2,1,-2,1,0,-1,0,1,0,1,2,-1,2],
      [-1,-2,-1,0,1,0,1,-2,1,2],
      [1,-2,-1,-2,-1,0,1,0,1,2,-1,2],
      [-1,-2,-1,0,1,0,1,2,-1,2,-1,0],
      [-1,-2,1,-2,-1,2],
      [-1,-2,-1,0,1,0,1,2,-1,2,-1,0,1,0,1,-2,-1,-2],
      [1,0,-1,0,-1,-2,1,-2,1,2] //9
    ],
    Letters:
    [
      [-1,2,-1,-2,1,-2,1,0,-1,0,1,0,1,2], //A
      [-1,2,-1,-2,1,-2,1,-1,0,0,-1,0,0,0,1,1,1,2,-1,2],
      [1,-2,-1,-2,-1,2,1,2],
      [-1,2,-1,-2,0,-2,1,-1,1,1,0,2,-1,2],
      [1,-2,-1,-2,-1,0,1,0,-1,0,-1,2,1,2],
      [-1,2,-1,-2,1,-2,-1,-2,-1,0,0,0],
      [1,-2,-1,-2,-1,0,1,0,1,2,-1,2,-1,0],
      [-1,-2,-1,2,-1,0,1,0,1,-2,1,2], //H
      [-1,-2,1,-2,0,-2,0,2,-1,2,1,2],
      [-1,-2,1,-2,0,-2,0,0,0,1,0,2,-1,1],
      [-1,-2,-1,2,-1,0,1,-2,-1,0,1,2], //k
      [-1,-2,-1,2,1,2],
      [-1,2,-1,-2,0,0,1,-2,1,2], //m
      [-1,2,-1,-2,0,0,1,-2,1,2],
      [1,-2,-1,-2,-1,2,1,2,1,-2], //o
      [-1,2,-1,-2,1,-2,1,0,-1,0],
      [1,-2,-1,-2,-1,2,0,1,1,2,0,1,1,1,1,-2],
      [-1,2,-1,-2,1,-2,1,0,-1,0,1,2],
      [1,-2,-1,-2,-1,0,1,0,1,2,-1,2],
      [-1,-2,1,-2,0,-2,0,2],
      [-1,-2,-1,2,1,2,1,-2],
      [-1,-2,0,2,1,-2],//v
      [-1,-2,-1,2,0,2,0,-2,0,2,1,2,1,-2],
      [1,-2,-1,2,0,0,-1,-2,1,2],
      [-1,-2,0,0,1,-2,0,0,0,2],
      [-1,-2,1,-2,-1,2,1,2] // z
    ]
    };

    //stores numbers that correlate to keys on keyboard
    this.keyArray = [16, 27, 32, 37, 38, 39];
    //processing queue for inputted keys
    this.keys = [];
    this.ship = new Ship();
    this.lasers = [];
    //keeps track of how much time has passed
    this.time = 0;
    this.lastTime = 0;
    this.lastTimeWarped = 0;
    this.lastTimePaused = 0;
    this.damageTime = 0;
    this.onetime = 0;
    //canvas boundaries
    this.maxWidth = 1000;
    this.maxHeight = 1000;
    //initial game conditions
    this.currentLevel = 1;
    this.currentLives = 3;
    this.currentLivesVisual = [0,0,-8,4,-4,-12,0,-8,4,-12,8,4,0,0];
    this.score = 0;
    this.flip = false;


    //Sounds
    this.sfx_player_laser_shoot = new Audio("Sounds/Laser_Shoot.wav")
    this.sfx_player_laser_shoot.preload = "auto";
    this.sfx_player_laser_shoot.load();

    this.sfx_player_warp = new Audio("Sounds/Warp.wav")
    this.sfx_player_warp.preload = "auto";
    this.sfx_player_warp.load();

    this.sfx_next_level = new Audio("Sounds/Next_Level.wav")
    this.sfx_next_level.preload = "auto";
    this.sfx_next_level.load();

    this.sfx_player_explode = new Audio("Sounds/Ship_Explode.wav")
    this.sfx_player_explode.preload = "auto";
    this.sfx_player_explode.load();

    this.sfx_player_laser_hit = new Audio("Sounds/Laser_Hit.wav")
    this.sfx_player_laser_hit.preload = "auto";
    this.sfx_player_laser_hit.load();

    this.sfx_game_end = new Audio("Sounds/End_Game.wav")
    this.sfx_game_end.preload = "auto";
    this.sfx_game_end.load();

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    window.onkeydown = this.handleKeyDown;
    window.onkeyup = this.handleKeyUp;
    // Create the back buffer canvas
    this.backBufferCanvas = document.createElement('canvas');
    this.backBufferCanvas.width = this.maxWidth;
    this.backBufferCanvas.height = this.maxHeight;
    this.backBufferContext = this.backBufferCanvas.getContext('2d');
    // Create the screen buffer canvas
    this.screenBufferCanvas = document.createElement('canvas');
    this.screenBufferCanvas.width = this.maxWidth;
    this.screenBufferCanvas.height = this.maxHeight;
    document.body.appendChild(this.screenBufferCanvas);
    this.screenBufferContext = this.screenBufferCanvas.getContext('2d');
    // Create HTML UI Elements
    var message = document.createElement('div');
    message.id = "message";
    message.textContent = "";
    document.body.appendChild(message);
    //binding functions
    this.update = this.update.bind(this);
    this.gameOver = this.gameOver.bind(this);
    this.pointCollision = this.pointCollision.bind(this);
    this.render = this.render.bind(this);
    this.loop = this.loop.bind(this);
    this.level = this.makeLevel.bind(this);
    this.drawText = this.drawText.bind(this);
    this.drawMenu = this.drawMenu.bind(this);

    //create the first level
    this.level(this.currentLevel);
    //game instructions/controls
    var message = document.getElementById("message");
    message.innerHTML = "HOW TO PLAY: <br /> -SHOOT ASTEROIDS TO INCREASE SCORE <br /> -DESTROY ALL ASTEROIDS TO GO TO THE NEXT LEVEL <br /> -WARPING TAKES YOU TO A COMPLETELY RANDOM LOCATION ON SCREEN <br /> -IF YOU DIE, YOU HAVE 3 SECONDS BEFORE YOU CAN BE DAMAGED AGAIN <br /> <br />CONTROLS: <br />-ESC: HIDE HELP <br />-LEFT ARROW KEY: ROTATE COUNTER CLOCKWISE <br />-UP ARROW KEY: MOVE FORWARD <br />-RIGHT ARROW KEY: ROTATE CLOCKWISE <br />-SPACE: FIRE LASER <br />-SHIFT: ACTIVATE WARP";    this.interval = setInterval(this.loop, 1000/60);
  }


  handleKeyUp(event)
  {
    //handles key up events
    event.preventDefault();
    if(event.keyCode === 16 || event.keyCode === 27 || event.keyCode === 32 || event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39)
    {
      this.keys[event.keyCode] = false;
    }

  }


  handleKeyDown(event)
  {
    //make an array to keep track of th keys and then use a for loop to go through each input
    event.preventDefault();
    if(event.keyCode === 16 || event.keyCode === 27 || event.keyCode === 32 || event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39)
    {
      this.keys[event.keyCode] = true;
    }
  }

  //algorithm based on https://wrf.ecse.rpi.edu//Research/Short_Notes/pnpoly.html
  pointCollision(checkObjectShape, checkObjectX, checkObjectY, x, y)
  {
    var intersection = false;
    var j = checkObjectShape.length - 2;
    for(var i = 0; i < checkObjectShape.length; i+=2)
    {
      //for a vertex
      var pointX1 = checkObjectShape[i] + checkObjectX;
      var pointX2 = checkObjectShape[j] + checkObjectX;
      var pointY1 = checkObjectShape[i+1] + checkObjectY;
      var pointY2 = checkObjectShape[j+1] + checkObjectY;

      if (( pointY1 > y != pointY2 >y ) && (x < (pointX2 - pointX1) * (y - pointY1) / (pointY2 - pointY1) + pointX1) )
      {
        intersection = !intersection;
      }
      j = i;
    }
    return intersection;
  }

  update()
  {
    if(this.currentLives <= 0)
    {
      this.gameOver();
      return;
    }
    //keeps track of time
    this.time += 1;

    //checks if the player's ship can be damaged
    if(Math.abs(this.time - this.damageTime)  >= 180)
    {
      this.canBeDamaged = true;
    }

    /* Loop through the pressed down keys and due stuff
    16 = shift
    27 = esc
    32 = space
    37 = left
    38 = up
    39 = right
    */
    for(var i = 0; i < this.keyArray.length; i++)
    {
      if(this.keyArray[i] === 16 && this.keys[this.keyArray[i]] )
      {
        //shift key, warp
        if( Math.abs(this.time - this.lastTimeWarped)  >= 200)
        {
          this.lastTimeWarped = this.time;
          this.ship.warp();
          var sound = this.sfx_player_warp.cloneNode();
          sound.play();
        }

      }
      else if(this.keyArray[i] === 27 && this.keys[this.keyArray[i]] )
      {
        //escape key
        if( Math.abs(this.time - this.lastTimePaused)  >= 20)
        {
          this.lastTimePaused = this.time;
          this.drawMenu();
        }
      }
      else if(this.keyArray[i] === 32 && this.keys[this.keyArray[i]] )
      {
        //space key
        //restrict the amount of bullets a player can fire to 3 times a second
        if( Math.abs(this.time - this.lastTime)  >= 20)
        {
          this.lastTime = this.time;
          this.lasers.push(this.ship.shoot());
          var sound = this.sfx_player_laser_shoot.cloneNode();
          sound.play();
        }

      }
      else if(this.keyArray[i] === 37 && this.keys[this.keyArray[i]] )
      {
        //left key, rotate counter clockwise
        this.ship.rotate(-0.05);
      }
      else if(this.keyArray[i] === 38 && this.keys[this.keyArray[i]] )
      {
        //up key, move forward
        this.ship.thrust();
      }
      else if(this.keyArray[i] === 39 && this.keys[this.keyArray[i]] )
      {
        //right key, rotate clockwise
        this.ship.rotate(0.05);
      }
    }

    //update the ship position
    this.ship.update();

    //loop through all lasers and destroy them if they go off screen
    for(var i = 0; i < this.lasers.length; i++)
    {

      this.lasers[i].update();
      if(this.lasers[i].getRemove())
      {
        this.lasers.splice(i, 1);
      }
    }

    //loop through all asteroids and update them
    for(var i = 0; i < this.asteroids.length; i++)
    {

      var coll = false;
      //check for collisions between asteroids
      for(var a = 0; a < this.asteroids.length; a++)
      {
        //skip asteroid if it's the same
        if(a === i)
        {
          continue;
        }
        for(var b = 0; b < this.asteroids[a].vertices.length; b+=2)
        {

          if(this.pointCollision(this.asteroids[i].vertices, this.asteroids[i].x, this.asteroids[i].y, this.asteroids[a].vertices[b] + this.asteroids[a].x, this.asteroids[a].vertices[b+1] + this.asteroids[a].y) )
          {
            coll = true;
              this.asteroids[i].velocity.x *= -1.001;
              this.asteroids[i].velocity.y *= -1.001;

              this.asteroids[a].velocity.x *= -1.001;
              this.asteroids[a].velocity.y *= -1.001;

              this.asteroids[a].update();
              this.asteroids[i].update();

          }
        }
      }
      if(!coll)
      {
        this.asteroids[i].update();
      }



      //check for collision between ship and asteroid
      for(var l = 0; l < this.ship.vertices.length -2; l+=2)
      {
        if(this.pointCollision(this.asteroids[i].vertices, this.asteroids[i].x, this.asteroids[i].y, this.ship.vertices[l] + this.ship.x, this.ship.vertices[l+1] + this.ship.y) && this.canBeDamaged)
        {
          this.currentLives--;
          if(this.currentLives > 0)
          {
            var sound = this.sfx_player_explode.cloneNode();
            sound.play();
          }

          this.ship.x = 500;
          this.ship.y = 500;
          this.ship.velocity.x = 0;
          this.ship.velocity.y = 0;
          this.canBeDamaged = false;
          this.damageTime = this.time;

          if(this.currentLives <= 0)
          {
            return;
          }
        }
      }
      //start checking if a laser hits an asteroid
      for(var j = 0; j < this.lasers.length; j++)
      {
        if(this.pointCollision(this.asteroids[i].vertices, this.asteroids[i].x, this.asteroids[i].y, this.lasers[j].x, this.lasers[j].y))
        {
          this.lasers.splice(j, 1);
          //play sound on impact
          var sound = this.sfx_player_laser_hit.cloneNode();
          sound.play();
          if(this.asteroids[i].splitTimes < 2)
          {
            var xPad = this.asteroids[i].size+10;
            var yPad = this.asteroids[i].size+10;
            var angle = this.asteroids[i].angle;
            for(var k = 0; k < 2; k++)
            {
              //randomly chooses a shape
              var n = Math.round(Math.random() * (this.shapes.Asteroids.length-1));
              //make it fly off in a random direction
              var temp = new Asteroid(this.shapes.Asteroids[n], this.asteroids[i].x + xPad, this.asteroids[i].y + yPad, this.asteroids[i].size/ 2 , angle, (this.asteroids[i].velocity.x * this.asteroids[i].velocity.x + this.asteroids[i].velocity.y * this.asteroids[i].velocity.y ) * .5 + 1);
              this.asteroids.push(temp);
              temp.splitTimes = this.asteroids[i].splitTimes + 1;
              xPad = -xPad;
              yPad = -yPad;
              //make the new asteroids move in opposite directions
              angle = angle - Math.PI;
            }
            this.score += 50;
          }
          else
          {
            this.score += 100;
          }
          this.asteroids.splice(i, 1);
          //we added asteroids, so start over on counting
          i = -1;
          break;
        }
      }
      //end checking if a laser hits an asteroid

    }

    //create another level if the current one has no more asteroids
    if(this.asteroids.length === 0)
    {
      this.currentLevel += 1;
      this.makeLevel(this.currentLevel);
    }
  }

  render()
  {
    if(this.currentLives <= 0)
    {
      return;
    }
    this.backBufferContext.fillStyle = '#000';
    this.backBufferContext.fillRect(0, 0, 1000, 1000);

    var ctx = this.backBufferContext;

    this.drawText(ctx, this.score, 6, 50, 60);
    this.drawText(ctx, "LVL", 6, 50, 130);
    this.drawText(ctx, this.currentLevel, 6, 110, 130);

    ctx.save();
    //for drawing the lives
    var spotx = 50;
    var spoty = 100;
    ctx.strokeStyle = "#fff";
    for(var j = 0; j < this.currentLives; j++)
    {
      ctx.beginPath();
      ctx.moveTo(this.currentLivesVisual[0] + spotx, this.currentLivesVisual[1] + spoty);
      for(var i = 2; i < this.currentLivesVisual.length; i += 2)
      {
        ctx.lineTo(this.currentLivesVisual[i] + spotx, this.currentLivesVisual[i + 1] + spoty);
      }
      ctx.stroke();
      ctx.closePath();
      spotx += 20;
    }
    ctx.restore();

    //end drawing lives

    //loop through all asteroids and render them
    var length = this.asteroids.length;
    for(var i = 0; i < length; i++)
    {
      this.asteroids[i].render(this.backBufferContext);
    }
    for(var i = 0; i < this.lasers.length; i++)
    {
      this.lasers[i].render(this.backBufferContext);
    }
    this.ship.render(this.backBufferContext);
    this.screenBufferContext.drawImage(this.backBufferCanvas,0,0);
  }

  drawMenu()
  {
    if(this.flip)
    {
      var message = document.getElementById("message");
      message.innerHTML = "HOW TO PLAY: <br /> -SHOOT ASTEROIDS TO INCREASE SCORE <br /> -DESTROY ALL ASTEROIDS TO GO TO THE NEXT LEVEL <br /> -WARPING TAKES YOU TO A COMPLETELY RANDOM LOCATION ON SCREEN <br /> -IF YOU DIE, YOU HAVE 3 SECONDS BEFORE YOU CAN BE DAMAGED AGAIN <br /> <br />CONTROLS: <br />-ESC: HIDE HELP <br />-LEFT ARROW KEY: ROTATE COUNTER CLOCKWISE <br />-UP ARROW KEY: MOVE FORWARD <br />-RIGHT ARROW KEY: ROTATE CLOCKWISE <br />-SPACE: FIRE LASER <br />-WARP: ACTIVATE WARP";
    }
    else
    {
      var message = document.getElementById("message");
      message.innerHTML = "";
    }
    this.flip = !this.flip;
  }

  //takes an a string and draws it
  drawText(ctx, text, scale, drawX, drawY)
  {

    text = text.toString().toUpperCase();
    var numberBeginning = "0".charCodeAt(0);
    var letterBeginning = "A".charCodeAt(0);
    var spaceBeginning = " ".charCodeAt(0);
    //for spacing out our text
    var space = 3 * scale;
    var vertices;
    //focus the text
    drawX += 0.5;
    drawY += 0.5;
    ctx.save();
    ctx.strokeStyle = "#fff";
    for(var i = 0; i < text.length; i++)
    {
      var char = text.charCodeAt(i);
      //if there's a space, put it in there for the next draw
      if(char === spaceBeginning)
      {
        drawX += space;
        continue;
      }
      //if it falls in the letter range then print letters, otherwise numbers
      if(char - letterBeginning >= 0)
      {
        vertices = this.shapes.Letters[char - letterBeginning];
      }
      else
      {
        vertices = this.shapes.Numbers[char - numberBeginning];
      }

      ctx.beginPath();
      ctx.moveTo( (vertices[0] * scale) + drawX, (vertices[1] * scale) + drawY);
      for(var j = 2; j < vertices.length; j += 2)
      {
        ctx.lineTo( (vertices[j] * scale) + drawX, (vertices[j + 1] * scale) + drawY);
      }
      ctx.stroke();
      ctx.closePath();
      drawX += space;
    }
    ctx.restore();
  }

  loop()
  {
   if(this.currentLives <= 0)
   {
     this.gameOver();
   }
   else
   {
     this.update();
     this.render();
   }
  }

  makeLevel(level)
  {
    var sound = this.sfx_next_level.cloneNode();
    sound.play();

    this.asteroids = [];
    this.ship = new Ship();
    this.lasers = [];
    level *= 10;
    var flipper = true;
    var initX = 0;
    var initY = 0;
    //create 10 asteroid objects
    for(var i = 0; i < level; i++)
    {
      //randomly chooses a shape
      var n = Math.round(Math.random() * (this.shapes.Asteroids.length-1));

      //attempt to make asteroids not spawn on top of each other
      if(Math.random() > 0.5)
      {
        initX = Math.random() * this.maxWidth;
        if(flipper)
        {
          initY = Math.random() * 100;
        }
        else {
          initY = Math.random() * (1000-900) + 900;
        }
      }
      else
      {
        initY = Math.random() * this.maxHeight;
        if(flipper)
        {
          initX = Math.random() * 10;
        }
        else {
          initX = Math.random() * (1000-900) + 900;
        }
      }
      flipper = !flipper;
      //make it fly off in a random direction
      var angle = 2*Math.PI*Math.random();
      var speed = 1.5 + Math.round(Math.random() * 1);
      var size = 8+ Math.round(Math.random() * 10)
      var temp = new Asteroid(this.shapes.Asteroids[n], initX, initY, size, angle, speed);
      this.asteroids.push(temp);
    }
  }

  gameOver()
  {
    if(this.onetime === 0)
    {
      var sound = this.sfx_game_end.cloneNode();
      sound.play();
      this.onetime = 2;
    }

    this.backBufferContext.fillStyle = '#000';
    this.backBufferContext.fillRect(0, 0, 1000, 1000);
    var ctx = this.backBufferContext;
    this.drawText(ctx, "GAME OVER", 20, 250, 500);
    this.drawText(ctx, "SCORE", 10, 370, 600);
    this.drawText(ctx, this.score, 10, 560, 600);

    this.screenBufferContext.drawImage(this.backBufferCanvas,0,0);
  }
}
