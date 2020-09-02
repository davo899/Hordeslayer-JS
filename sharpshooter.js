class ssMode extends defMode {
  reset(){
    this.x = 800;
    this.y = 400;
    this.dir = 0;
    this.health = 100;
    this.bullets = [];
    this.zombies = [];
    this.specialBullets = [];
    this.counter = 0;
    this.mouseHeld = false;
    this.heldCount = 0;
    this.zombieCount = 0;
    this.accuracy = 100;
    this.firedShots = 0;
    this.hitShots = 0;
    this.reloading = false;
    this.reloadTimer = 0;
    this.flashlightTimer = 40000;
    this.currentWeapon = new ElectricGun();
    this.ammo = 999;
    this.msgBar = new MessageBar();
    if (!glitched){
      this.msgBar.addMessage(new Message("A horde is approaching...", 240, [255, 255, 255]));
      this.msgBar.addMessage(new Message("...", 240, [255, 255, 255]));
      this.msgBar.addMessage(new Message("!SLAY THE HORDE", 240, [255, 0, 0]));
    }else{
      let ls = [240, 240, 240];
      let ls2 = [[255, 255, 255], [255, 255, 255], [255, 0, 0]];
      for (let i=0; i<3; i++){
        let s = getRandString(5000);
        this.msgBar.addMessage(new Message(s, ls[i], ls2[i]));
      }
    }
  }
  
  constructor(){
    super();
    this.reset();
  }
  
  handleInputs(){
    if (mouseWasPressed){
      this.mouseHeld = true;
    }
    if (mouseWasReleased){
      this.mouseHeld = false;
    }
    
    if (keyIsDown(controlDict.pause)){
      if(!glitched){
        currentMusic.pause();
      }
      stateDict.pauseScreen.previous = "sharpshooterMode";
      setGameState("pauseScreen");
    }
    if (keyIsDown(controlDict.up) && this.y - 15 > 0) {
      this.y -= 3;
    } else if (keyIsDown(controlDict.down) && this.y + 15 < areaSizeY) {
      this.y += 3;
    }
    if (keyIsDown(controlDict.left) && this.x - 15 > 0) {
      this.x -= 3;
    } else if (keyIsDown(controlDict.right) && this.x + 15 < areaSizeX) {
      this.x += 3;
    }
    if (this.mouseHeld){
      if (this.heldCount == 0 && this.ammo > 0){
        let ls = this.currentWeapon.fire(this.x, this.y, this.dir+HALF_PI);
        this.firedShots += ls.length;
        this.bullets = this.bullets.concat(ls);
        this.heldCount = this.currentWeapon.cooldown;
        this.ammo--;
      }
    }
    if (this.heldCount != 0){
      this.heldCount--;
    }
  }
  
  checkAmmo(){
    this.updateAccuracy();
  }
  
  drawFlashlightBattery(){}
  
  attemptSpawnZombie(){
    if(zombiesActive){
      this.zombieCount++;
      let x = Math.floor(Math.random() * areaSizeX);
      let y = Math.floor(Math.random() * areaSizeY);
      let side = Math.floor(Math.random() * 4);
      if (this.counter%6 == 0){
        switch(side){
          case 0:
            this.zombies.push(new Zombie(x, 10, 300, 2, this.zombieCount));
            break;
          case 1:
            this.zombies.push(new Zombie(areaSizeX-10, y, 300, 2, this.zombieCount));
            break;
          case 2:
            this.zombies.push(new Zombie(x, areaSizeY-10, 300, 2, this.zombieCount));
            break;
          case 3:
            this.zombies.push(new Zombie(10, y, 300, 2, this.zombieCount));
            break;
        }
      }
    }
  }
  
  update(){
    this.counter++;
    
    if (this.counter < 500){
      this.screenShake = 3;
      if(this.counter%120 == 0){
        this.attemptSpawnZombie();
      }
    }else{
      this.attemptSpawnZombie();
    }
    push();
    this.shakeScreen();
    this.rotatePlayer();
    this.handleInputs();
    
    this.updateBullets();
    this.updateSpecialBullets();
    this.updateZombies();
    this.msgBar.update();
    this.checkBulletHits();
    this.checkZombieHits();
    this.checkAmmo();
    
    this.drawPlayer(this.x*scalar, this.y*scalar, this.dir);
    pop();
    this.drawHUD();
    this.msgBar.draw();
    this.checkHealth();
  }
}
