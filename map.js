class mapMode extends Gamemode {
  resetMaps(){
    maps = {
            carPark:new CarPark(),
               shop:new Shop(),
              road1:new Road1(),
              road2:new Road2(),
              road3:new Road3(),
              road4:new Road4(),
              road5:new Road5(),
              road6:new Road6(),
              road7:new Road7(),
              road8:new Road8(),
              road9:new Road9(),
             road10:new Road10(),
             road11:new Road11(),
             road12:new Road12(),
           };
  }
  
  setupArea(){
    areaSizeX = this.area.areaSizeX;
    areaSizeY = this.area.areaSizeY;
    scalar = (worldViewWidth/areaSizeX);
    this.zombies = this.area.zombies;
    this.bullets = [];
  }
  
  constructor(){
    super();
    this.reset();
    this.resetMaps();
    this.area = maps.carPark;
    this.setupArea();
    this.x = this.area.startPos[0];
    this.y = this.area.startPos[1];
    this.inv = [];
    this.carMode = false;
    this.car = null;
  }
  
  enterCar(car){
    this.x = car.x;
    this.y = car.y;
    this.dir = car.dir;
    this.car = car;
    this.carMode = true;
  }
  
  exitCar(){
    this.x += 70*cos(this.car.dir+HALF_PI);
    this.y -= 70*sin(this.car.dir+HALF_PI);
    this.car = null;
    this.carMode = false;
  }
  
  accelerateCar(direction){
    if (direction == 1){
      if (this.car.velo >= 0){
        this.car.velo += 1-((this.car.velo**0.5)/this.car.topSpeed)
      }else{
        this.car.velo++;
      }
    }else if (this.car.velo > -15){
      this.car.velo--;
    }
  }
  
  drawQuarterLight(sourceX, sourceY, sourceAngle){
    fill(0, 0, 0, 255-(155*((this.flashlightTimer**0.5)/200)));                         //Lit area gets darker with less flashlight battery
    quad(0, 0, 0, worldViewHeight, worldViewWidth, worldViewHeight, worldViewWidth, 0); //Fill screen with ambient darkness
    let lightAngle = QUARTER_PI;
    let segments = [];
    for(let i=0;i<this.area.obstacles.length;i++){
      for(let j=0;(j+2)<this.area.obstacles[i].points.length;j+=2){              //Create array of obstacle line segments
        segments.push( {a:{x:this.area.obstacles[i].points.slice(-j-4)[0],
                           y:this.area.obstacles[i].points.slice(-j-3)[0]},
                        b:{x:this.area.obstacles[i].points.slice(-j-2)[0],
                           y:this.area.obstacles[i].points.slice(-j-1)[0]}} );

      }
    }
    segments.push({a:{x:0, y:0}, b:{x:0, y:areaSizeY}});                         //Add world edges to segment array
    segments.push({a:{x:0, y:areaSizeY}, b:{x:areaSizeX, y:areaSizeY}});
    segments.push({a:{x:areaSizeX, y:areaSizeY}, b:{x:areaSizeX, y:0}});
    segments.push({a:{x:areaSizeX, y:0}, b:{x:0, y:0}});

    if (sourceAngle < QUARTER_PI && sourceAngle > -QUARTER_PI){      //Add edges of lit area (flashlight cone) to segment array
      segments.push({a:{x:sourceX-1, y:sourceY},
                     b:{x:areaSizeX, y:sourceY+((areaSizeX-sourceX)*tan((lightAngle)-sourceAngle))}});

      segments.push({a:{x:sourceX-1, y:sourceY},
                     b:{x:areaSizeX, y:sourceY-((areaSizeX-sourceX)*tan((lightAngle)+sourceAngle))}});

    }else if(sourceAngle < -QUARTER_PI && sourceAngle > -(3*QUARTER_PI)){
      segments.push({a:{x:sourceX, y:sourceY-1},
                     b:{x:sourceX-((areaSizeY-sourceY)*tan(((lightAngle)-sourceAngle)-HALF_PI)), y:areaSizeY}});

      segments.push({a:{x:sourceX, y:sourceY-1},
                     b:{x:sourceX+((areaSizeY-sourceY)*tan(((lightAngle)+sourceAngle)-HALF_PI)), y:areaSizeY}});

    }else if(sourceAngle < -(3*QUARTER_PI) || sourceAngle > (3*QUARTER_PI)){
      segments.push({a:{x:sourceX+1, y:sourceY},
                     b:{x:0, y:sourceY-(sourceX*tan(((lightAngle)-sourceAngle)-PI))}});

      segments.push({a:{x:sourceX+1, y:sourceY},
                     b:{x:0, y:sourceY+(sourceX*tan(((lightAngle)+sourceAngle)-PI))}});

    }else{
      segments.push({a:{x:sourceX, y:sourceY+1},
                     b:{x:sourceX-(sourceY*tan(((lightAngle)+sourceAngle)+HALF_PI)), y:0}});

      segments.push({a:{x:sourceX, y:sourceY+1},
                     b:{x:sourceX+(sourceY*tan(((lightAngle)-sourceAngle)+HALF_PI)), y:0}});
    }

    var points = (function(segments){           //Make array of individual points from the segment array
        var c = [];
        segments.forEach(function(seg){
            c.push(seg.a,seg.b);
        });
        return c;
    })(segments);
    var uniquePoints = (function(points){       //Filter out duplicate points in point array
        var set = {};
        return points.filter(function(p){
            var key = p.x+","+p.y;
            if(key in set){
                return false;
            }else{
                set[key]=true;
                return true;
            }
        });
    })(points);

    var uniqueAngles = [];                      //Make array of angles from source to points in point array
    for(let j=0;j<uniquePoints.length;j++){     //Slightly variant angles added to account for walls behind walls
      
        uniqueAngles.push((Math.atan2((uniquePoints[j].y*scalar)-(sourceY*scalar),
                               (uniquePoints[j].x*scalar)-(sourceX*scalar)))-0.00001,
                          (Math.atan2((uniquePoints[j].y*scalar)-(sourceY*scalar),
                               (uniquePoints[j].x*scalar)-(sourceX*scalar))),
                          (Math.atan2((uniquePoints[j].y*scalar)-(sourceY*scalar),
                               (uniquePoints[j].x*scalar)-(sourceX*scalar)))+0.00001);
    }

    if (sourceY+((areaSizeX-sourceX)*tan((lightAngle)-sourceAngle)) < sourceY ||  //Angles too low are rewrapped (angle += 2PI)
        sourceY-((areaSizeX-sourceX)*tan((lightAngle)+sourceAngle)) > sourceY){
      if (sourceAngle < HALF_PI && sourceAngle > -HALF_PI){
        if ((sourceX-((areaSizeY-sourceY)*tan(((lightAngle)-sourceAngle)-HALF_PI)))*scalar > sourceX*scalar ||
            (sourceX-((areaSizeY-sourceY)*tan(((lightAngle)-sourceAngle)-HALF_PI)))*scalar > sourceX*scalar){
          for(let j=0;j<uniqueAngles.length;j++){
            if (uniqueAngles[j] < 0){
              uniqueAngles[j] = uniqueAngles[j] + (2*PI)
            }
          }
        }
      }else{
        for(let j=0;j<uniqueAngles.length;j++){
          if (uniqueAngles[j] < 0){
            uniqueAngles[j] = uniqueAngles[j] + (2*PI)
          }
        }
      }
    }

    var intersects = [];                       //Makes array of intersections between rays from source at angles in angle array 
    for(let j=0;j<uniqueAngles.length;j++){    //and segments in segment array
        let angle = uniqueAngles[j];

        var dx = Math.cos(angle);
        var dy = Math.sin(angle);

        var ray = {
            a:{x:(sourceX*scalar),y:(sourceY*scalar)},
            b:{x:((sourceX*scalar)+dx),y:((sourceY*scalar)+dy)}
        };

        var closestIntersect = null;                                             //Filters intersection array to only closest intersects
        for(var i=0;i<segments.length;i++){
            let c = {a:{x:segments[i].a.x*scalar, y:segments[i].a.y*scalar},
                     b:{x:segments[i].b.x*scalar, y:segments[i].b.y*scalar}};

            var intersect = getIntersection(ray,c);
            if(!intersect) continue;
            if(!closestIntersect || intersect.param<closestIntersect.param){
                closestIntersect=intersect;
            }
        }

        if(!closestIntersect) continue;
          closestIntersect.angle = angle;

        intersects.push(closestIntersect);
    }

    intersects = intersects.sort(function(a,b){   //Sorts intersects by angle from source
        return a.angle-b.angle;
    }); 

    fill(0, 0, 0, 250);                           //Draws polygon of shadows from intersect array
    strokeWeight(0);

    beginShape();
    vertex(0, intersects[0].y);
    vertex(0, worldViewHeight);
    vertex(worldViewWidth, worldViewHeight);
    vertex(worldViewWidth, 0);
    vertex(0, 0);
    vertex(0, intersects[0].y);
    for(let i=0; i<intersects.length; i++){
      vertex(intersects[i].x, intersects[i].y);
    }
    vertex(intersects[0].x, intersects[0].y);
    endShape();
    strokeWeight(1);
  }
  
  
  drawInteract(x, y, px, py, txt){
    let xDif = px - x;
    let yDif = py - y;
    let dir;

    if (xDif > 0) {
      if (yDif > 0) {
        dir = atan(yDif / xDif);
      } else {
        dir = -atan(-yDif / xDif);
      }

    } else if (xDif < 0) {
      if (yDif > 0) {
        dir = PI - (atan(-yDif / xDif));
      } else {
        dir = -PI + (atan(yDif / xDif));
      }

    } else {
      if (yDif > 0) {
        dir = HALF_PI;
      } else {
        dir = -HALF_PI;
      }
    }
    dir += PI;
    
    push();
    stroke(0);
    fill(255);
    strokeWeight(2);
    stroke(255);
    line(x*scalar, y*scalar,
         (x+(30*cos(dir)))*scalar, (y+(30*sin(dir)))*scalar);
    stroke(0);
    textSize(20*scalar);
    text(txt+": "+String.fromCharCode(controlDict.interact), (x+(60*cos(dir)))*scalar,
         (y+(60*sin(dir)))*scalar);
    pop();
  }
  
  
  drawFlashlight(){
    if(flashlight){
      if(this.carMode){
        this.drawQuarterLight((50*cos(-this.dir)) + this.x, (50*sin(-this.dir)) + this.y, this.dir);
      }else{
        this.drawQuarterLight(this.x, this.y, this.dir);
      }
      
      if (this.flashlightTimer != 0){
        this.flashlightTimer--;
      }
    }
  }
  
  drawHUD(){
    push();
    stroke(0);
    this.drawHealthBar();
    if (flashlight){
      fill(255);
    }else{
      fill(0);
    }
    if(this.carMode){
      //debug
      push();
      stroke(255);
      renderText(((this.car.velo)*0.3).toFixed(2), width/2, 30, 24, CENTER);
      pop();
      //debug
    }
    
    this.drawFlashlightBattery();
    
    stroke(255);
    strokeWeight(2);
    if (this.reloading){
      renderText(str(this.ammo)+"...", worldViewWidth-30, worldViewHeight-30, 24, RIGHT);
    }else{
      renderText(str(this.ammo), worldViewWidth-30, worldViewHeight-30, 24, RIGHT);
    }
    stroke(0);
    fill(255, 0, 0, 100-this.health);
    rect(0, 0, worldViewWidth, worldViewHeight);
    pop();
    
    if(glitched){
      fill(80, 90 + (50*sin(frameCount/50)));
      rect(0, 0, worldViewWidth, worldViewHeight);
    }
  }
  
  exitCheck(){
    let exit = false;
    let exitLoc;
    let entryPoint;
    for (let i=0; i<this.area.exits.length; i++){
      if (intersect( [((20*scalar) * sin(this.dir + QUARTER_PI)) + (this.x*scalar),
                      ((20*scalar) * cos(this.dir + QUARTER_PI)) + (this.y*scalar)],
                     [((20*scalar) * sin(this.dir - QUARTER_PI)) + (this.x*scalar),
                      ((20*scalar) * cos(this.dir - QUARTER_PI)) + (this.y*scalar)],
                     [this.area.exits[i].points[0]*scalar,
                      this.area.exits[i].points[1]*scalar],
                     [this.area.exits[i].points[2]*scalar,
                      this.area.exits[i].points[3]*scalar] )){
        exit = true;
        exitLoc = this.area.exits[i].exitTo;
        entryPoint = this.area.exits[i].entryPoint;
        
      }else if (intersect( [((20*scalar) * sin(this.dir - QUARTER_PI)) + (this.x*scalar),
                      ((20*scalar) * cos(this.dir - QUARTER_PI)) + (this.y*scalar)],
                     [((20*scalar) * sin(this.dir - (3 * QUARTER_PI))) + (this.x*scalar),
                      ((20*scalar) * cos(this.dir - (3 * QUARTER_PI))) + (this.y*scalar)],
                     [this.area.exits[i].points[0]*scalar,
                      this.area.exits[i].points[1]*scalar],
                     [this.area.exits[i].points[2]*scalar,
                      this.area.exits[i].points[3]*scalar] )){
        exit = true;
        exitLoc = this.area.exits[i].exitTo;
        entryPoint = this.area.exits[i].entryPoint;
        
      }else if (intersect( [((20*scalar) * sin(this.dir - (3 * QUARTER_PI))) + (this.x*scalar),
                      ((20*scalar) * cos(this.dir - (3 * QUARTER_PI))) + (this.y*scalar)],
                     [((20*scalar) * sin(this.dir + (3 * QUARTER_PI))) + (this.x*scalar),
                      ((20*scalar) * cos(this.dir + (3 * QUARTER_PI))) + (this.y*scalar)],
                     [this.area.exits[i].points[0]*scalar,
                      this.area.exits[i].points[1]*scalar],
                     [this.area.exits[i].points[2]*scalar,
                      this.area.exits[i].points[3]*scalar] )){
        exit = true;
        exitLoc = this.area.exits[i].exitTo;
        entryPoint = this.area.exits[i].entryPoint;
        
      }else if (intersect( [((20*scalar) * sin(this.dir + (3 * QUARTER_PI))) + (this.x*scalar),
                      ((20*scalar) * cos(this.dir + (3 * QUARTER_PI))) + (this.y*scalar)],
                     [((20*scalar) * sin(this.dir + QUARTER_PI)) + (this.x*scalar),
                      ((20*scalar) * cos(this.dir + QUARTER_PI)) + (this.y*scalar)],
                     [this.area.exits[i].points[0]*scalar,
                      this.area.exits[i].points[1]*scalar],
                     [this.area.exits[i].points[2]*scalar,
                      this.area.exits[i].points[3]*scalar] )){
        exit = true;
        exitLoc = this.area.exits[i].exitTo;
        entryPoint = this.area.exits[i].entryPoint;
      }
    }
    
    if (exit){
      if(this.carMode){
        for(let i=0; i<this.area.cars.length; i++){ 
           if (this.area.cars[i] == this.car){
             this.area.cars.splice(i, 1); 
           }
        }

        this.area = maps[exitLoc];
        this.area.cars.push(this.car);
      }else{
        this.area = maps[exitLoc];
      }
      this.x = entryPoint[0];
      this.y = entryPoint[1];
      this.setupArea();
    }
  }
  
  obstacleCheck(){
    let checkSpeed = playerSpeed;
    let points = [[((20*scalar) * sin(this.dir + QUARTER_PI)) + (this.x*scalar),
                  ((20*scalar) * cos(this.dir + QUARTER_PI)) + (this.y*scalar)],
                  [((20*scalar) * sin(this.dir - QUARTER_PI)) + (this.x*scalar),
                  ((20*scalar) * cos(this.dir - QUARTER_PI)) + (this.y*scalar)],
                  [((20*scalar) * sin(this.dir - (3 * QUARTER_PI))) + (this.x*scalar),
                  ((20*scalar) * cos(this.dir - (3 * QUARTER_PI))) + (this.y*scalar)],
                  [((20*scalar) * sin(this.dir + (3 * QUARTER_PI))) + (this.x*scalar),
                  ((20*scalar) * cos(this.dir + (3 * QUARTER_PI))) + (this.y*scalar)]];
    
    if(this.carMode){
      checkSpeed = this.car.velo*0.3;
      if (checkSpeed < 0){
        checkSpeed = -checkSpeed;
      }
      
      points = this.car.points;
    }
    
    points.push(points[0]);
    
    for (let i=0; i<this.area.obstacles.length; i++){                       //Each obstacle
      for (let j=0; (2+j)<this.area.obstacles[i].points.length; j+=2){      //Each line segment in the obstacle
        if (this.carMode && intersect( [((75 * cos(-this.dir))+this.x)*scalar, ((75 * sin(-this.dir))+this.y)*scalar],
                     [((75 * cos(PI-this.dir))+this.x)*scalar, ((75 * sin(PI-this.dir))+this.y)*scalar],
                       [this.area.obstacles[i].points.slice(-j-4)[0]*scalar,
                        this.area.obstacles[i].points.slice(-j-3)[0]*scalar],
                       [this.area.obstacles[i].points.slice(-j-2)[0]*scalar,
                        this.area.obstacles[i].points.slice(-j-1)[0]*scalar] )){
          this.x += checkSpeed * cos(this.area.obstacles[i].normals.slice(-j/2 - 1)[0]);
          this.y -= checkSpeed * sin(this.area.obstacles[i].normals.slice(-j/2 - 1)[0]);
        }

        
        for(let n=0; n<points.length-1; n++){          //Checks for intersection with each line that makes up the player
          if (intersect( points[n], points[n+1],
                       [this.area.obstacles[i].points.slice(-j-4)[0]*scalar,
                        this.area.obstacles[i].points.slice(-j-3)[0]*scalar],
                       [this.area.obstacles[i].points.slice(-j-2)[0]*scalar,
                        this.area.obstacles[i].points.slice(-j-1)[0]*scalar] )){
            this.x += checkSpeed * cos(this.area.obstacles[i].normals.slice(-j/2 - 1)[0]);
            this.y -= checkSpeed * sin(this.area.obstacles[i].normals.slice(-j/2 - 1)[0]);
          }
        }
      }
    }
    
    for (let a=0; a<this.area.cars.length; a++){
      if(this.area.cars[a] != this.car){
        let carPoints = this.area.cars[a].points;
        carPoints.push(carPoints[0]);

        for (let b=0; b<carPoints.length-1; b++){
          if (this.carMode && intersect( [((75 * cos(-this.dir))+this.x)*scalar, ((75 * sin(-this.dir))+this.y)*scalar],
                   [((75 * cos(PI-this.dir))+this.x)*scalar, ((75 * sin(PI-this.dir))+this.y)*scalar],
                     carPoints[b], carPoints[b+1] )){
            this.x += checkSpeed * cos(this.area.cars[a].normals[b]);
            this.y -= checkSpeed * sin(this.area.cars[a].normals[b]);
          }

          for(let n=0; n<points.length-1; n++){          //Checks for intersection with each line that makes up the player
            if (intersect(points[n], points[n+1], carPoints[b], carPoints[b+1])){
              this.x += checkSpeed * cos(this.area.cars[a].normals[b]);
              this.y -= checkSpeed * sin(this.area.cars[a].normals[b]);
            }
          }
        }
      }
    }
  }
  
  zombieObstacleCheck(){
    for (let i=0; i<this.zombies.length; i++){
      this.zombies[i].obstacleCheck(this.area.obstacles);
    }
  }
  
  bulletObstacleCheck(stepDivide){
    for (let i=0; i<this.bullets.length; i++){
      let spliced = false;
      for (let j=0; j<stepDivide && !spliced; j++){
        this.bullets[i].dist += (10/stepDivide)
        this.bullets[i].x = (this.bullets[i].dist * sin(this.bullets[i].dir)) + this.bullets[i].centx;
        this.bullets[i].y = (this.bullets[i].dist * cos(this.bullets[i].dir)) + this.bullets[i].centy;
        
        let bulletPoints = [[(this.bullets[i].x-3)*scalar, (this.bullets[i].y-3)*scalar],
                            [(this.bullets[i].x+3)*scalar, (this.bullets[i].y-3)*scalar],
                            [(this.bullets[i].x+3)*scalar, (this.bullets[i].y+3)*scalar],
                            [(this.bullets[i].x-3)*scalar, (this.bullets[i].y+3)*scalar],];
        
        bulletPoints.push(bulletPoints[0]);
        
        for (let a=0; a<this.area.obstacles.length && !spliced; a++){
          for (let b=0; (2+b)<this.area.obstacles[a].points.length; b+=2){
            for (let c=0; c<bulletPoints.length-1; c++){
              if (intersect( bulletPoints[c], bulletPoints[c+1],
                           [this.area.obstacles[a].points.slice(-b-4)[0]*scalar,
                            this.area.obstacles[a].points.slice(-b-3)[0]*scalar],
                           [this.area.obstacles[a].points.slice(-b-2)[0]*scalar,
                            this.area.obstacles[a].points.slice(-b-1)[0]*scalar] )){
                this.bullets.splice(i, 1);
                spliced = true;
                break;
              }
            }
          }
        }
        
        for (let a=0; a<this.area.cars.length && !spliced; a++){
          let carPoints = this.area.cars[a].points;
          carPoints.push(carPoints[0]);
          for (let b=0; b+1<carPoints.length; b++){
            for (let c=0; c<bulletPoints.length-1; c++){
              if (intersect(bulletPoints[c], bulletPoints[c+1], carPoints[b], carPoints[b+1])){
                this.bullets.splice(i, 1);
                spliced = true;
                break;
              }
            }
          }
        }
      }
    }
  }
  
  checkBulletHits(){
    for(let i = 0; i < this.zombies.length; i++){
      let abort = false;
      for(let j = 0; j < this.bullets.length && !abort; j++){
        if (this.bullets[j].x > this.zombies[i].x-15 && this.bullets[j].x < this.zombies[i].x+15 &&
            this.bullets[j].y > this.zombies[i].y-15 && this.bullets[j].y < this.zombies[i].y+15){
          this.hitShots++;
          this.zombies[i].health -= this.bullets[j].damage;
          this.zombies[i].agro = true;
          this.bullets.splice(j, 1);
          
          if (this.zombies[i].health <= 0){
            playZombieDeath(this.x, this.y, this.zombies[i]);
            this.zombies.splice(i, 1);
            kills++;
            abort = true;
          }
        }
      }
    }
    if (kills >= this.currentWeapon.milestone && this.currentWeapon.milestone != 0){
      this.currentWeapon = this.currentWeapon.next;
      this.reloading = false;
      this.ammo = this.currentWeapon.magSize;
    }
  }
  
  updateBullets(){
    this.bulletObstacleCheck(3);
    for(let i = 0; i < this.bullets.length; i++){
      this.bullets[i].draw();
      if (this.bullets[i].x < 0 || this.bullets[i].x > areaSizeX || this.bullets[i].y < 0 || this.bullets[i].y > areaSizeY){
        this.bullets.splice(i, 1);
      }
    }
  }
  
  updateZombies(){
    if(zombiesActive){
      for(let i = 0; i < this.zombies.length; i++){
        if (!this.zombies[i].agro && ((((this.zombies[i].y-this.y)**2) + ((this.x - this.zombies[i].x)**2)) **0.5) < 300){
          this.zombies[i].agro = true;
        }
        if (this.zombies[i].agro){
          this.zombies[i].move(this.x, this.y, this.zombies);
        }
        this.zombies[i].draw();
      }
    }
  }
  
  checkInteracts(){
    for(let i=0; i<this.area.cars.length; i++){
      if((((this.area.cars[i].x - this.x)**2) + ((this.area.cars[i].y - this.y)**2))**0.5 < 200){
        if(this.carMode){
          if(interactPressed){
            this.exitCar();
          }
          
        }else{
          this.drawInteract(this.area.cars[i].x, this.area.cars[i].y, this.x, this.y, "Drive");

          if(interactPressed){
            this.enterCar(this.area.cars[i]);
          }
        }
      }
    }
  }
  
  handleInputs(){
    let fired = false;
    if (mouseWasPressed){
      this.mouseHeld = true;
      if (this.currentWeapon.name == "Shotgun" && this.reloading && this.ammo != 0){
        this.reloading = false;
        this.reloadTimer = 0;
      }
      if (this.currentWeapon.name == "Pistol" && !this.reloading){
        let ls = this.currentWeapon.fire(this.x, this.y, this.dir+HALF_PI);
        this.firedShots += ls.length;
        this.bullets = this.bullets.concat(ls);
        this.heldCount = this.currentWeapon.cooldown;
        this.ammo--;
      }
    } 
    if (mouseWasReleased){
      this.mouseHeld = false;
    }
    
    if (keyIsDown(controlDict.pause)){
      if(!glitched){
        currentMusic.pause();
      }
      stateDict.pauseScreen.previous = "mapMode";
      setGameState("pauseScreen");
    }
    if (keyIsDown(32)){
      this.screenShake = 30;
    }
    
    if (keyIsDown(controlDict.reload) && !this.reloading){
      soundDict.weapon[this.currentWeapon.reloadSound].play();
      this.reloadTimer = this.currentWeapon.reload;
      this.reloading = true;
    }
    if(!this.carMode){
      if (keyIsDown(controlDict.up) && this.y - 13 > 0) {
        this.y -= playerSpeed;
      } else if (keyIsDown(controlDict.down) && this.y + 13 < areaSizeY) {
        this.y += playerSpeed;
      }
      if (keyIsDown(controlDict.left) && this.x - 13 > 0) {
        this.x -= playerSpeed;
      } else if (keyIsDown(controlDict.right) && this.x + 13 < areaSizeX) {
        this.x += playerSpeed;
      }
    }else{
      if (keyIsDown(controlDict.up)) {
        this.accelerateCar(1);
      } else if (keyIsDown(controlDict.down)) {
        this.accelerateCar(0);
      }
      
      if (keyIsDown(controlDict.left)) {
        this.dir += 0.05*(this.car.velo/50);
      } else if (keyIsDown(controlDict.right)) {
        this.dir -= 0.05*(this.car.velo/50);
      }
      if (this.dir < -PI){
        this.dir += TWO_PI;
      }else if (this.dir > PI){
        this.dir -= TWO_PI;
      }
    }
    this.exitCheck();
    this.obstacleCheck();
    
    if (this.mouseHeld){
      if (this.heldCount == 0 && this.ammo > 0 && !this.reloading && !fired){
        let ls = this.currentWeapon.fire(this.x, this.y, this.dir+HALF_PI);
        this.firedShots += ls.length;
        this.bullets = this.bullets.concat(ls);
        this.heldCount = this.currentWeapon.cooldown;
        this.ammo--;
        fired = true;
      }
    }
    if (this.heldCount != 0){
      this.heldCount--;
    }
  }
  
  drawBG(){
    image(imgDict[this.area.bg], 0, 0, worldViewWidth, worldViewHeight);
  }
  
  drawExits(){
    for(let i=0;i<this.area.exits.length;i++){
      this.area.exits[i].draw();
    }
  }
  
  drawAreaCars(){
    for(let i=0; i<this.area.cars.length; i++){
      this.area.cars[i].move();
      this.area.cars[i].draw();
    }
  }
  
  update(){
    this.counter++;
    
    push(); //Separates drawn parts that are affected/not affected by screen shake.
    this.shakeScreen();
    this.drawBG();
    this.drawExits();
    if (!this.carMode){
      this.rotatePlayer();
    }
    this.handleInputs();
    
    this.updateBullets();
    this.updateZombies();
    this.msgBar.update();
    this.zombieObstacleCheck();
    this.checkBulletHits();
    this.checkZombieHits();
    this.checkAmmo();
    
    if(this.carMode){
      this.x = this.car.x;
      this.y = this.car.y;
      this.car.dir = this.dir;
    }
    
    this.drawFlashlight();
    this.drawPlayer(this.x*scalar, this.y*scalar, this.dir);
    this.drawAreaCars();
    this.checkInteracts();
    pop();
    
    this.drawHUD();
    this.msgBar.draw();
    this.checkHealth();
  }
}
