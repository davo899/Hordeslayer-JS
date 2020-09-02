class defMode extends Gamemode{
  constructor(){
    super();
    this.reset();
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
      stateDict.pauseScreen.previous = "defaultMode";
      setGameState("pauseScreen");
    }
    if (keyIsDown(controlDict.reload) && !this.reloading){
      soundDict.weapon[this.currentWeapon.reloadSound].play();
      this.reloadTimer = this.currentWeapon.reload;
      this.reloading = true;
    }
    if (keyIsDown(controlDict.up) && this.y - 15 > 0) {
      this.y -= playerSpeed;
    } else if (keyIsDown(controlDict.down) && this.y + 15 < areaSizeY) {
      this.y += playerSpeed;
    }
    if (keyIsDown(controlDict.left) && this.x - 15 > 0) {
      this.x -= playerSpeed;
    } else if (keyIsDown(controlDict.right) && this.x + 15 < areaSizeX) {
      this.x += playerSpeed;
    }
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
  
  drawHUD(){
    stroke(0);
    this.drawHealthBar();
    fill(255);
    renderText("KILLS: "+str(kills), 30, 30, 24, LEFT);
    renderText(this.currentWeapon.name, 30, 60, 24, LEFT);
    this.drawFlashlightBattery();
    renderText("ACCURACY: "+str(this.accuracy)+"%", worldViewWidth-30, 30, 24, RIGHT);
    
    if (this.reloading){
      renderText(str(this.ammo)+"...", worldViewWidth-30, worldViewHeight-30, 24, RIGHT);
    }else{
      renderText(str(this.ammo), worldViewWidth-30, worldViewHeight-30, 24, RIGHT);
    }
    
    if (this.currentWeapon.milestone != 0){
      renderText(str(this.currentWeapon.milestone-kills)+" until "+this.currentWeapon.next.name, 30, 90, 24, LEFT);
    }
    
    fill(255, 0, 0, 100-this.health);
    rect(0, 0, worldViewWidth, worldViewHeight);
  }
  
  updateBullets(){
    for(let i = 0; i < this.bullets.length; i++){
      this.bullets[i].move(this.zombies);
      this.bullets[i].draw();
      if (this.bullets[i].x < 0 || this.bullets[i].x > areaSizeX || this.bullets[i].y < 0 || this.bullets[i].y > areaSizeY){
        this.bullets.splice(i, 1);
      }
    }
  }
  
  updateZombies(){
    if(zombiesActive){
      for(let i = 0; i < this.zombies.length; i++){
        this.zombies[i].move(this.x, this.y, this.zombies);
        this.zombies[i].draw();
        if (this.zombies[i].health <= 0){
          playZombieDeath(this.x, this.y, this.zombies[i]);
          this.zombies.splice(i, 1);
          kills++;
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
          this.bullets[j].specialOnHit(this.zombies[i]);
          this.specialBullets.push(this.bullets.splice(j, 1)[0]);
          
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
  
  updateSpecialBullets(){
    //print(this.zombieCount)
    this.specialBullets = this.specialBullets.filter(bullet => !bullet.attemptEnd());
    for(let i=0; i<this.specialBullets.length; i++){
      this.zombies = this.specialBullets[i].special(this.zombies, this.x, this.y);
      this.specialBullets[i].drawSpecial();
    }
  }
  
  drawFlashlight(){
    if (flashlight){
      fill(0, 0, 0, 255-(155*((this.flashlightTimer**0.5)/200)));
      quad(0, 0, 0, worldViewHeight, worldViewWidth, worldViewHeight, worldViewWidth, 0);
      let scaledX = this.x*scalar;
      let scaledY = this.y*scalar;
      let lightAngle = QUARTER_PI;
      strokeWeight(0.3);
      fill(0, 0, 0, 240);
      
      if (this.dir < QUARTER_PI && this.dir > -QUARTER_PI){
        quad(0, 0, scaledX, 0, scaledX, worldViewHeight, 0, worldViewHeight);
        
        quad(scaledX, scaledY, scaledX, worldViewHeight, worldViewWidth, worldViewHeight,
             worldViewWidth, (this.y+((areaSizeX-this.x)*tan((lightAngle)-this.dir)))*scalar);
        
        quad(scaledX, scaledY, scaledX, 0, worldViewWidth, 0, 
             worldViewWidth, (this.y-((areaSizeX-this.x)*tan((lightAngle)+this.dir)))*scalar);
        
      }else if(this.dir < -QUARTER_PI && this.dir > -(3*QUARTER_PI)){
        quad(0, 0, worldViewWidth, 0, worldViewWidth, scaledY, 0, scaledY);
        
        quad(scaledX, scaledY, 0, scaledY, 0, worldViewHeight, 
             (this.x-((areaSizeY-this.y)*tan(((lightAngle)-this.dir)-HALF_PI)))*scalar, worldViewHeight);
        
        quad(scaledX, scaledY, worldViewWidth, scaledY, worldViewWidth, worldViewHeight, 
             (this.x+((areaSizeY-this.y)*tan(((lightAngle)+this.dir)-HALF_PI)))*scalar, worldViewHeight);
        
      }else if(this.dir < -(3*QUARTER_PI) || this.dir > (3*QUARTER_PI)){
        quad(scaledX, 0, worldViewWidth, 0, worldViewWidth, worldViewHeight, scaledX, worldViewHeight);
        
        quad(scaledX, scaledY, scaledX, 0, 0, 0, 
             0, (this.y-(this.x*tan(((lightAngle)-this.dir)-PI)))*scalar);
        
        quad(scaledX, scaledY, scaledX, worldViewHeight, 0, worldViewHeight, 
             0, (this.y+(this.x*tan(((lightAngle)+this.dir)-PI)))*scalar);
        
      }else{
        quad(0, scaledY, worldViewWidth, scaledY, worldViewWidth, worldViewHeight, 0, worldViewHeight);
        
        quad(scaledX, scaledY, 0, scaledY, 0, 0, 
             (this.x-(this.y*tan(((lightAngle)+this.dir)+HALF_PI)))*scalar, 0);
        
        quad(scaledX, scaledY, worldViewWidth, scaledY, worldViewWidth, 0, 
             (this.x+(this.y*tan(((lightAngle)-this.dir)+HALF_PI)))*scalar, 0);
      }
      
      if (this.flashlightTimer != 0){
        this.flashlightTimer--;
      }
    }
  }
  
  update(){
    this.counter++;
    
    push();
    this.shakeScreen();
    this.rotatePlayer();
    this.handleInputs();
    this.attemptSpawnZombie();
    
    this.updateBullets();
    this.updateSpecialBullets();
    this.updateZombies();
    this.msgBar.update();
    this.checkBulletHits();
    this.checkZombieHits();
    this.checkAmmo();
    
    this.drawFlashlight();
    this.drawPlayer(this.x*scalar, this.y*scalar, this.dir);
    pop();
    this.drawHUD();
    this.msgBar.draw();
    this.checkHealth();
  }
}
