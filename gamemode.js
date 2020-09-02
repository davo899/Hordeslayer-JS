class Gamemode{
  reset(){
    this.x = areaSizeX/2;
    this.y = areaSizeY/2;
    this.dir = 0;
    this.health = 100;
    this.bullets = [];
    this.specialBullets = [];
    this.zombies = [];
    this.counter = 0;
    this.mouseHeld = false;
    this.heldCount = 0;
    this.currentWeapon = new Pistol();
    this.ammo = 8;
    this.zombieCount = 0;
    this.accuracy = 100;
    this.firedShots = 0;
    this.hitShots = 0;
    this.reloading = false;
    this.reloadTimer = 0;
    this.flashlightTimer = 40000;
    this.screenShake = 0;
    this.msgBar = new MessageBar();
    this.carVelo = 0;
  }
  
  resize(){}
  
  drawFlashlightBattery(){
    if(flashlight){
      push();
      fill(255);
      noStroke();
      rect(30, worldViewHeight-70, 95, 30);
      rect(125, worldViewHeight-60, 5, 10);
      fill(0);
      rect(35, worldViewHeight-65, 82, 20);
      
      fill(255);
      if (this.flashlightTimer > 30000){
        rect(97, worldViewHeight-63, 18, 16);
      }
      if(this.flashlightTimer > 20000){
        rect(77, worldViewHeight-63, 18, 16);
      }
      if(this.flashlightTimer > 10000){
        rect(57, worldViewHeight-63, 18, 16);
      }
      if(this.flashlightTimer > 5000){
        rect(37, worldViewHeight-63, 18, 16);
      }else if(this.flashlightTimer > 0){
        if (frameCount % 60 > 30){
          rect(37, worldViewHeight-63, 18, 16);
        }
      }
      pop();
    }
  }
  
  shakeScreen(){
    if(this.screenShake > 0){
      if (frameCount%3 == 0){
        translate(this.screenShake, 0);
      }else if (frameCount%3 == 1){
        translate(-this.screenShake, 0);
      }
      this.screenShake--;
    }
  }
  
  rotatePlayer() {
    let xDif = (mouseX/scalar) - this.x;
    let yDif = this.y - (mouseY/scalar);

    if (xDif > 0) {
      if (yDif > 0) {
        this.dir = atan(yDif / xDif);
      } else {
        this.dir = -atan(-yDif / xDif);
      }

    } else if (xDif < 0) {
      if (yDif > 0) {
        this.dir = PI - (atan(-yDif / xDif));
      } else {
        this.dir = -PI + (atan(yDif / xDif));
      }

    } else {
      if (yDif > 0) {
        this.dir = HALF_PI;
      } else {
        this.dir = -HALF_PI;
      }
    }
  }
  
  drawPlayer(xPos, yPos, dire) {
    let c = color(255, 0, 0);
    let scaledX = 20*scalar
    let scaledY = 20*scalar
    fill(c);
    quad( (scaledX * sin(dire + QUARTER_PI)) + xPos,
          (scaledY * cos(dire + QUARTER_PI)) + yPos,
          (scaledX * sin(dire - QUARTER_PI)) + xPos,
          (scaledY * cos(dire - QUARTER_PI)) + yPos,
          (scaledX * sin(dire - (3 * QUARTER_PI))) + xPos,
          (scaledY * cos(dire - (3 * QUARTER_PI))) + yPos,
          (scaledX * sin(dire + (3 * QUARTER_PI))) + xPos,
          (scaledY * cos(dire + (3 * QUARTER_PI))) + yPos );
    if(glitched){
      fill(255, 0, 0, 100);
      let x = ((Math.random()*60)-30)*(width/areaSizeX);
      let y = ((Math.random()*60)-30)*(width/areaSizeX);
      quad( (scaledX * sin(dire + QUARTER_PI)) + xPos+x,
            (scaledY * cos(dire + QUARTER_PI)) + yPos+y,
            (scaledX * sin(dire - QUARTER_PI)) + xPos+x,
            (scaledY * cos(dire - QUARTER_PI)) + yPos+y,
            (scaledX * sin(dire - (3 * QUARTER_PI))) + xPos+x,
            (scaledY * cos(dire - (3 * QUARTER_PI))) + yPos+y,
            (scaledX * sin(dire + (3 * QUARTER_PI))) + xPos+x,
            (scaledY * cos(dire + (3 * QUARTER_PI))) + yPos+y );
      
      fill(255, 0, 0, 150);
      x = ((Math.random()*40)-20)*(width/areaSizeX);
      y = ((Math.random()*40)-20)*(width/areaSizeX);
      quad( (scaledX * sin(dire + QUARTER_PI)) + xPos+x,
            (scaledY * cos(dire + QUARTER_PI)) + yPos+y,
            (scaledX * sin(dire - QUARTER_PI)) + xPos+x,
            (scaledY * cos(dire - QUARTER_PI)) + yPos+y,
            (scaledX * sin(dire - (3 * QUARTER_PI))) + xPos+x,
            (scaledY * cos(dire - (3 * QUARTER_PI))) + yPos+y,
            (scaledX * sin(dire + (3 * QUARTER_PI))) + xPos+x,
            (scaledY * cos(dire + (3 * QUARTER_PI))) + yPos+y );
      
      fill(255, 0, 0, 200);
      x = ((Math.random()*20)-10)*(width/areaSizeX);
      y = ((Math.random()*20)-10)*(width/areaSizeX);
      quad( (scaledX * sin(dire + QUARTER_PI)) + xPos+x,
            (scaledY * cos(dire + QUARTER_PI)) + yPos+y,
            (scaledX * sin(dire - QUARTER_PI)) + xPos+x,
            (scaledY * cos(dire - QUARTER_PI)) + yPos+y,
            (scaledX * sin(dire - (3 * QUARTER_PI))) + xPos+x,
            (scaledY * cos(dire - (3 * QUARTER_PI))) + yPos+y,
            (scaledX * sin(dire + (3 * QUARTER_PI))) + xPos+x,
            (scaledY * cos(dire + (3 * QUARTER_PI))) + yPos+y );
    }
  }
  
  drawHealthBar(){
    fill(0);
    rect(30, worldViewHeight-25, 100, 10);
    fill(255, 0, 0);
    rect(30, worldViewHeight-25, this.health, 10);
  }
  
  checkZombieHits(){
    if(zombiesActive){
      for(let i = 0; i < this.zombies.length; i++){
        if (checkOverlap(this.x-15, this.y-15, this.x+15, this.y+15,
                         this.zombies[i].x-15, this.zombies[i].y-15,
                         this.zombies[i].x+15, this.zombies[i].y+15)){
          this.health -= 10;
          this.zombies[i].x -= 20 * sin(this.zombies[i].dir);
          this.zombies[i].y -= 20 * cos(this.zombies[i].dir);
          soundDict.hit.play();
        }
      }
    }
  }
  
  attemptSpawnZombie(){
    if(zombiesActive){
      this.zombieCount++;
      if (this.currentWeapon.name != "Pistol"){
        if (this.counter%Math.floor(60/(((1/100)*(this.counter**0.5))+0.9)) == 0){
          switch(Math.floor(Math.random() * 4)){
            case 0:
              this.zombies.push(new Zombie(Math.floor(Math.random() * areaSizeX), 10,
                                           ((1/3000000)*(this.counter**2))+20, 1+(Math.random()*1.5), this.zombieCount));
              break;
            case 1:
              this.zombies.push(new Zombie(areaSizeX-10, Math.floor(Math.random() * areaSizeY),
                                           ((1/3000000)*(this.counter**2))+20, 1+(Math.random()*1.5), this.zombieCount));
              break;
            case 2:
              this.zombies.push(new Zombie(Math.floor(Math.random() * areaSizeX), areaSizeY-10,
                                           ((1/3000000)*(this.counter**2))+20, 1+(Math.random()*1.5), this.zombieCount));
              break;
            case 3:
              this.zombies.push(new Zombie(10, Math.floor(Math.random() * areaSizeY),
                                           ((1/3000000)*(this.counter**2))+20, 1+(Math.random()*1.5), this.zombieCount));
              break;
          }
        }
      }else{
        if (this.counter%Math.floor(60/0.8) == 0){
          switch(Math.floor(Math.random() * 4)){
            case 0:
              this.zombies.push(new Zombie(Math.floor(Math.random() * areaSizeX), 10,
                                           ((1/3000000)*(this.counter**2))+20, 1.5, this.zombieCount));
              break;
            case 1:
              this.zombies.push(new Zombie(areaSizeX-10, Math.floor(Math.random() * areaSizeY),
                                           ((1/3000000)*(this.counter**2))+20, 1.5, this.zombieCount));
              break;
            case 2:
              this.zombies.push(new Zombie(Math.floor(Math.random() * areaSizeX), areaSizeY-10,
                                           ((1/3000000)*(this.counter**2))+20, 1.5, this.zombieCount));
              break;
            case 3:
              this.zombies.push(new Zombie(10, Math.floor(Math.random() * areaSizeY),
                                           ((1/3000000)*(this.counter**2))+20, 1.5, this.zombieCount));
              break;
          }
        }
      }
    }
  }
  
  updateAccuracy(){
    if (this.firedShots != 0){
      this.accuracy = Math.floor(100*(this.hitShots/this.firedShots));
    }
  }
  
  checkAmmo(){
    this.updateAccuracy();
    if (this.reloadTimer > 0){
      this.reloadTimer--;
    }
    if (this.currentWeapon.name == "Shotgun"){
      if (this.ammo == 0 && !this.reloading){
        this.reloadTimer = this.currentWeapon.reload*2;
        this.reloading = true;
      }
      if (this.reloadTimer == 0 && this.reloading){
        if (this.ammo != this.currentWeapon.magSize){
          soundDict.weapon[this.currentWeapon.reloadSound].play();
          this.ammo++;
          this.reloadTimer = this.currentWeapon.reload;
        }else{
          this.reloading = false;
        }
      }
    }else{
      if (this.ammo == 0 && !this.reloading){
        soundDict.weapon[this.currentWeapon.reloadSound].play();
        this.reloadTimer = this.currentWeapon.reload;
        this.reloading = true;
      }
      if (this.reloadTimer == 0 && this.reloading){
        this.ammo = this.currentWeapon.magSize;
        this.reloading = false;
      }
    }
  }
  
  resetMaps(){}
  
  checkHealth(){
    if (this.health <= 0){
      if(!glitched){
        currentMusic.stop();
      }
      setGameState("deathScreen");
      this.reset();
      this.resetMaps();
    }
    if (this.health < 100 && this.counter%6 == 0){
      this.health++;
    }
  }
}
