class MainMenu {
  constructor(){
    this.debugButton = new Button(width/2, 60, 200, 60, "Map Debug", 20, 2);
    this.creditsButton = new Button(width-130, height-60, 200, 60, "Credits", 20, 2);
    this.normalButton = new Button((width/2)-150, (height/2)+50, 200, 60, "Normal", 20, 2);
    this.ssButton = new Button((width/2)+150, (height/2)+50, 200, 60, "Sharpshooter", 20, 2);
    this.settingsButton = new Button(width/2, (height/2)+130, 200, 60, "Settings", 20, 2);
  }
  
  drawTitle(){
    push();
    imageMode(CENTER);
    
    if (glitched){
      let x = Math.floor(Math.random()*100)
      if (x%20 < 2){
        image(imgDict.title,
              (Math.random()*3)+(width/2),
              (Math.random()*3)+(height/2)-51);
      }else if(x%20 > 18){
        image(imgDict.titleglitched2,
              (Math.random()*3)+(width/2),
              (Math.random()*3)+(height/2)-51);
      }else if(x%20 > 12){
        image(imgDict.titleglitched3,
              (Math.random()*3)+(width/2),
              (Math.random()*3)+(height/2)-51);
      }else{
        image(imgDict.titleglitched,
              (Math.random()*3)+(width/2),
              (Math.random()*3)+(height/2)-51);
      }
    }else{
      image(imgDict.title, width/2, (height/2)-51);
    }
    
    pop();
  }
  
  resize(){
    this.debugButton.x = width/2;
    this.creditsButton.x = width-130;
    this.creditsButton.y = height-60;
    this.normalButton.x = (width/2)-150;
    this.normalButton.y = (height/2)+50;
    this.ssButton.x = (width/2)+150;
    this.ssButton.y = (height/2)+50;
    this.settingsButton.x = width/2;
    this.settingsButton.y = (height/2)+130;
  }
  
  update(){
    if (this.debugButton.handleEvent()){
      setGameState("pregameScreen");
    }
    if (this.normalButton.handleEvent()){
      setGameState("defaultMode");
      setMusic(soundDict.bgMusic.default);
    }
    if (this.creditsButton.handleEvent()){
      setGameState("credits");
    }
    if (this.ssButton.handleEvent()){
      setGameState("sharpshooterMode");
      setMusic(soundDict.bgMusic.default);
    }
    if (this.settingsButton.handleEvent()){
      setGameState("settingsMenu");
    }
    this.debugButton.draw();
    this.creditsButton.draw();
    this.normalButton.draw();
    this.ssButton.draw();
    this.settingsButton.draw();
    this.drawTitle();
    fill(230, 0, 0);
    //renderText("*Please excuse any lighting bugs, still working on those!", 30, height-80, 500, 50, 10, LEFT, BOTTOM);
  }
}

class DeathScreen {
  constructor(){
    this.menuButton = new Button(width/2, height-60, 200, 60, "Main Menu", 20, 2);
  }
  
  resize(){
    this.menuButton.x = width/2;
    this.menuButton.y = height-60;
  }
  
  update(){
    if (this.menuButton.handleEvent()){
      setMusic(soundDict.bgMusic.title);
      setGameState("mainMenu");
      kills = 0;
    }
    renderText("GAME OVER", width/2, (height/2)-75, 50, CENTER);
    renderText("KILLS: "+str(kills), width/2, height/2, 24, CENTER);
    this.menuButton.draw();
  }
}

class PauseScreen {
  constructor(){
    this.resumeButton = new Button(width/2, (height/2)-140, 200, 60, "Resume", 20, 2);
    this.controlsButton = new Button(width/2, (height/2)-60, 200, 60, "Controls", 20, 2);
    this.audioButton = new Button(width/2, (height/2)+20, 200, 60, "Audio", 20, 2);
    this.menuButton = new Button(width/2, (height/2)+100, 200, 60, "Exit", 20, 2);
    this.previous = "mapMode";
  }
  
  resize(){
    this.resumeButton.x = width/2;
    this.controlsButton.x = width/2;
    this.audioButton.x = width/2;
    this.menuButton.x = width/2;
    this.resumeButton.y = (height/2)-140;
    this.controlsButton.y = (height/2)-60;
    this.audioButton.y = (height/2)+20;
    this.menuButton.y = (height/2)+100;
  }
  
  update(){
    if (this.resumeButton.handleEvent()){
      if(!glitched){
        currentMusic.play();
      }
      
      setGameState(this.previous);
    }
    if (this.controlsButton.handleEvent()){
      stateDict.controlsMenu.previous = "pauseScreen";
      setGameState("controlsMenu");
    }
    if (this.audioButton.handleEvent()){
      stateDict.audioMenu.previous = "pauseScreen";
      setGameState("audioMenu");
    }
    if (this.menuButton.handleEvent()){
      if(!glitched){
        currentMusic.stop();
      }
      
      setGameState("deathScreen");
      stateDict.defaultMode = new defMode();
      stateDict.sharpshooterMode = new ssMode();
      stateDict.mapMode = new mapMode();
    }
    this.resumeButton.draw();
    this.controlsButton.draw();
    this.audioButton.draw();
    this.menuButton.draw();
  }
}

class ControlsMenu {
  constructor(){
    this.selectorList = [new ControlSelector((width/2)-150, (height/2)-250, 200, 50, "up", 20, 2),
                         new ControlSelector((width/2)-150, (height/2)-175, 200, 50, "down", 20, 2),
                         new ControlSelector((width/2)-150, (height/2)-100, 200, 50, "left", 20, 2),
                         new ControlSelector((width/2)-150, (height/2)-25, 200, 50, "right", 20, 2),
                         new ControlSelector((width/2)+250, (height/2)-250, 200, 50, "pause", 20, 2),
                         new ControlSelector((width/2)+250, (height/2)-175, 200, 50, "reload", 20, 2),
                         new ControlSelector((width/2)+250, (height/2)-100, 200, 50, "inventory", 20, 2),
                         new ControlSelector((width/2)+250, (height/2)-25, 200, 50, "interact", 20, 2)];
    this.backButton = new Button(width/2, height-90, 200, 60, "Back", 20, 2);
    this.previous = "settingsMenu";
  }
  
  resize(){
    for(let i=0; i<this.selectorList.length; i++){
      this.selectorList[i].x = (width/2)-150+(Math.floor(i/4)*400);
      this.selectorList[i].y = ((i*75)+(height/2)-250-(Math.floor(i/4)*300));
    }
    this.backButton.x = width/2;
    this.backButton.y = height-90;
  }
  
  drawText(){
    for(let i = 0; i < this.selectorList.length; i++){
      let txt = this.selectorList[i].index.slice(0,1).toUpperCase() + this.selectorList[i].index.slice(1);
      renderText(txt+":", (width/2)-260+(Math.floor(i/4)*400),
                 (i*75)+(height/2)-250-(Math.floor(i/4)*300), 20, RIGHT);
    }
  }
  
  update(){
    let found = false;
    fill(255);
    this.drawText();
    this.backButton.draw();
    if (this.backButton.handleEvent()){
      setGameState(this.previous);
    }
    for(let i = 0; i < this.selectorList.length; i++){
      this.selectorList[i].draw();
    }
    for(let i = 0; i < this.selectorList.length; i++){
      if (this.selectorList[i].focus){
        found = true;
        if (keyIsPressed){
          for(let j = 0; j < this.selectorList.length; j++){
            if (controlDict[this.selectorList[j].index] == keyCode && this.selectorList[i] != this.selectorList[j]){
              controlDict[this.selectorList[j].index] = controlDict[this.selectorList[i].index]
              this.selectorList[j].setCaption(controlDict[this.selectorList[j].index]);
              break;
            }
          }
          controlDict[this.selectorList[i].index] = keyCode;
          this.selectorList[i].setCaption(controlDict[this.selectorList[i].index]);
          this.selectorList[i].focus = false;
        }
        break;
      }
    }
    
    if (!found){
      for(let i = 0; i < this.selectorList.length; i++){
        this.selectorList[i].handleEvent();
      }
    }
  }
}

class SettingsMenu{
  constructor(){
    this.controlsButton = new Button(width/2, (height/2)-80, 200, 60, "Controls", 20, 2);
    this.audioButton = new Button(width/2, height/2, 200, 60, "Audio", 20, 2);
    this.backButton = new Button(width/2, (height/2)+80, 200, 60, "Back", 20, 2);
  }
  
  resize(){
    this.controlsButton.x = width/2;
    this.controlsButton.y = (height/2)-80;
    this.audioButton.x = width/2;
    this.audioButton.y = height/2;
    this.backButton.x = width/2;
    this.backButton.y = (height/2)+80;
  }
  
  update(){
    if (this.controlsButton.handleEvent()){
      stateDict.audioMenu.previous = "settingsMenu";
      setGameState("controlsMenu");
    }
    if (this.audioButton.handleEvent()){
      stateDict.audioMenu.previous = "settingsMenu";
      setGameState("audioMenu");
    }
    if (this.backButton.handleEvent()){
      setGameState("mainMenu");
    }
    this.controlsButton.draw();
    this.audioButton.draw();
    this.backButton.draw();
  }
}

class PreGameScreen{
  constructor(){
    this.beginButton = new Button(width/2, height-60, 200, 60, "Begin", 20, 2);
    this.flButton = new Button(width/2, (height/2)-40, 200, 60, "Flashlight: OFF", 20, 2);
    this.mapButton = new Button(width/2, (height/2)+40, 200, 60, "Map: Car Park", 20, 2);
  }
  
  resize(){
    this.beginButton.x = width/2;
    this.beginButton.y = height-60;
    this.flButton.x = width/2;
    this.flButton.y = (height/2)-40;
    this.mapButton.x = width/2;
    this.mapButton.y = (height/2)+40;
  }
  
  switchMap(){
    map++;
    if (map == Object.keys(maps).length){
      map = 0;
    }
    this.mapButton.capt = "Map: "+maps[Object.keys(maps)[map]].name;
  }
  
  update(){
    this.beginButton.draw();
    this.flButton.draw();
    this.mapButton.draw();
    if (this.flButton.handleEvent()){
      if (flashlight){
        this.flButton.capt = "Flashlight: OFF"
        flashlight = false;
      }else{
        this.flButton.capt = "Flashlight: ON"
        flashlight = true;
      }
    }
    if (this.mapButton.handleEvent()){
      this.switchMap();
    }
    if (this.beginButton.handleEvent()){
      if(!glitched){
        currentMusic.stop();
      }
      
      if (maps[Object.keys(maps)[map]] != "None"){
        stateDict.mapMode.area = maps[Object.keys(maps)[map]]
        stateDict.mapMode.setupArea();
        setGameState("mapMode");
      }else{
        setGameState("defaultMode");
      }
    }
  }
}

class CreditScreen{
  constructor(){
    this.backButton = new Button(width/2, height-60, 200, 60, "Back", 20, 2);
  }
  
  resize(){
    this.backButton.x = width/2;
    this.backButton.y = height-60;
  }
  
  update(){
    this.backButton.draw();
    if (this.backButton.handleEvent()){
      setGameState("mainMenu");
    }
    
    fill(255);
    renderText("Testing Help:", (width/2)-160, (height/2)-180, 26, CENTER);
    renderText("Music:", (width/2)+160, (height/2)-180, 26, CENTER);
    renderText("Everything else (mostly):", width/2, height/2, 26, CENTER);
    fill(200);
    renderText("Employee #24629", (width/2)-160, (height/2)-140, 20, CENTER);
    renderText("Creator of Square Game", (width/2)-160, (height/2)-110, 20, CENTER);
    renderText("twitch.tv/doingfine", (width/2)-160, (height/2)-80, 20, CENTER);
    
    renderText("Kevin MacLeod - Aftermath", (width/2)+10, (height/2)-140, 20, LEFT);
    renderText("Kevin MacLeod - Controlled Chaos", (width/2)+10, (height/2)-110, 20, LEFT);
    if (!glitched){
      renderText("Davo8899", width/2, (height/2)+40, 24, CENTER);
    }else{
      push();
      translate((Math.random()*10)-5, (Math.random()*10)-5);
      imageMode(CENTER);
      image(imgDict.gone, width/2, (height/2)+40);
      pop();
    }
  }
}


class AudioMenu{
  constructor(){
    this.backButton = new Button(width/2, height-90, 200, 60, "Back", 20, 2);
    this.musicSlider = new Slider((width/2)+150, 80, "music", 2);
    this.zombiesSlider = new Slider((width/2)+150, 180, "zombies", 2);
    this.weaponsSlider = new Slider((width/2)+150, 280, "weapons", 2);
    this.previous = "settingsMenu";
  }
  
  resize(){
    this.backButton.x = width/2;
    this.backButton.y = height-90;
    this.musicSlider.x += (width/2)-150-this.musicSlider.linex1;
    this.musicSlider.linex1 = (width/2)-150;
    this.musicSlider.linex2 = (width/2)+150;
    this.zombiesSlider.x += (width/2)-150-this.zombiesSlider.linex1;
    this.zombiesSlider.linex1 = (width/2)-150;
    this.zombiesSlider.linex2 = (width/2)+150;
    this.weaponsSlider.x += (width/2)-150-this.weaponsSlider.linex1;
    this.weaponsSlider.linex1 = (width/2)-150;
    this.weaponsSlider.linex2 = (width/2)+150;
  }
  
  setMusic(){
    soundDict.bgMusic.glitch.setVolume(1.5*soundLevels.music);

    Object.keys(soundDict.bgMusic).forEach(function x(key){
      soundDict.bgMusic[key].setVolume(soundLevels.music);
    });
  }
  
  setWeapons(){
    soundDict.weapon.pistol.setVolume(weaponVols[0]*soundLevels.weapons);
    soundDict.weapon.pistolReload.setVolume(weaponVols[1]*soundLevels.weapons);
    soundDict.weapon.smg.setVolume(weaponVols[2]*soundLevels.weapons);
    soundDict.weapon.smgReload.setVolume(weaponVols[3]*soundLevels.weapons);
    soundDict.weapon.shotgun.setVolume(weaponVols[4]*soundLevels.weapons);
    soundDict.weapon.shotgunReload.setVolume(weaponVols[5]*soundLevels.weapons);
    soundDict.weapon.ar.setVolume(weaponVols[6]*soundLevels.weapons);
    soundDict.weapon.arReload.setVolume(weaponVols[7]*soundLevels.weapons);
    soundDict.weapon.lmg.setVolume(weaponVols[8]*soundLevels.weapons);
    soundDict.weapon.lmgReload.setVolume(weaponVols[9]*soundLevels.weapons);
    soundDict.weapon.minigun.setVolume(weaponVols[10]*soundLevels.weapons);
    soundDict.weapon.minigunReload.setVolume(weaponVols[11]*soundLevels.weapons);
    soundDict.weapon.electric.setVolume(weaponVols[12]*soundLevels.weapons);
  }
  
  update(){
    push();
    this.backButton.draw();
    this.musicSlider.draw();
    this.zombiesSlider.draw();
    this.weaponsSlider.draw();
    
    if (this.backButton.handleEvent()){
      setGameState(this.previous);
    }
    if (this.musicSlider.handleEvent()){
      this.setMusic();
    }
    if (this.weaponsSlider.handleEvent()){
      this.setWeapons();
    }
    this.zombiesSlider.handleEvent()
    this.weaponsSlider.handleEvent()
    
    fill(255);
    stroke(0);
    textSize(20);
    textAlign(CENTER, CENTER);
    text("Music: "+str(Math.floor(soundLevels.music*100))+"%", (width/2), 50);
    text("Zombies: "+str(Math.floor(soundLevels.zombies*100))+"%", (width/2), 150);
    text("Weapons: "+str(Math.floor(soundLevels.weapons*100))+"%", (width/2), 250);
    pop();
  }
}


class Inventory{
  constructor(){
    this.backButton = new Button(width/2, height-90, 200, 60, "Back", 20, 2);
  }
  
  update(){
    this.backButton.draw();
    if (this.backButton.handleEvent()){
      setGameState("mapMode");
    }
  }
}
