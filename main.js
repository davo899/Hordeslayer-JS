let mouseWasPressed = false;
let mouseWasReleased = false;
let interactPressed = false;
let montserrat;
let title;
let cnv;
let glitched = false;
let zombiesActive = true;
let playerSpeed = 5;
let kills = 0;
let areaSizeX = 1600;
let areaSizeY = 800;
let flashlight = false;
let map = 0;
let mapIndices;
let maps;
let worldViewWidth;
let worldViewHeight;
let scalar;
let currentMusic;
let soundLevels = {music:1,
                 zombies:1,
                 weapons:1,
};

let nonAlphaKeys = {
  8:"Backspace",9:"Tab",
  13:"Enter",
  16:"Shift",17:"Ctrl",18:"Alt",19:"Pause Break",20:"Caps Lock",
  27:"Escape",
  32:"Space",33:"PgUp",34:"PgDown",35:"End",36:"Home",
  37:"Left Arrow",38:"Up Arrow",39:"Right Arrow",40:"Down Arrow",
  45:"Insert",46:"Delete",
  91:"Start",92:"Meta Right",93:"Context Menu",
  96:"Numpad0",97:"Numpad1",98:"Numpad2",99:"Numpad3",100:"Numpad4",
  101:"Numpad5",102:"Numpad6",103:"Numpad7",104:"Numpad8",105:"Numpad9",
  112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",
  118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",
  144:"Num Lock",145:"Scroll Lock",
  173:"Volume Mute",174:"Volume Down",175:"Volume Up",
  180:"Launch Mail",182:"Launch App1",183:"Launch App2",
};

let controlDict = {
         up:87,
       down:83,
       left:65,
      right:68,
      pause:27,
     reload:82,
  inventory:69, //lol
   interact:70,
};

function keyPressed(){
  if (keyCode == controlDict.interact){
    interactPressed = true;
  }
}

function mousePressed(){
  mouseWasPressed = true;
}

function mouseReleased(){
  mouseWasReleased = true;
}

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

let mobile = isMobileDevice();

function getRandString(x){
  let s = [];
  for (let n=0; n<Math.floor(Math.random()*x); n++){
    s.push(String.fromCharCode(Math.floor(33+(Math.random()*123))));
  }
  s = s.join("");
  return s;
}

function checkOverlap(x1, y1, x2, y2, x3, y3, x4, y4){
  if(x1 > x4 || x3 > x2){
    return false;
  }
  if (y4 < y1 || y2 < y3){
    return false;
  }
  return true;
}

function ccw(A,B,C){
    return (C[1]-A[1]) * (B[0]-A[0]) > (B[1]-A[1]) * (C[0]-A[0])
}

function intersect(A,B,C,D){
    return ccw(A,C,D) != ccw(B,C,D) && ccw(A,B,C) != ccw(A,B,D);
}

function getIntersection(ray, segment){
	var r_dx = ray.b.x-ray.a.x;
	var r_dy = ray.b.y-ray.a.y;

	var s_dx = segment.b.x-segment.a.x;
	var s_dy = segment.b.y-segment.a.y;

	var r_mag = Math.sqrt(r_dx*r_dx+r_dy*r_dy);
	var s_mag = Math.sqrt(s_dx*s_dx+s_dy*s_dy);
	if(r_dx/r_mag==s_dx/s_mag && r_dy/r_mag==s_dy/s_mag){
		return null;
	}
  
	var T2 = (r_dx*(segment.a.y-ray.a.y) + r_dy*(ray.a.x-segment.a.x))/(s_dx*r_dy - s_dy*r_dx);
	var T1 = (segment.a.x+s_dx*T2-ray.a.x)/r_dx;

	if(T1<0) return null;
	if(T2<0 || T2>1) return null;

	return {
		x: ray.a.x+r_dx*T1,
		y: ray.a.y+r_dy*T1,
		param: T1
	};

}

function findNormal(centre, p1, p2){
  let mp = [((p2[0]-p1[0])/2)+p1[0], ((p2[1]-p1[1])/2)+p1[1]];
  let xDif = mp[0] - centre[0];
  let yDif = centre[1] - mp[1];
  let dir;
  
  if (xDif > 0){
    if(yDif > 0){
      dir = atan(yDif/xDif);
    }else{
      dir = -atan(-yDif/xDif);
    }
  }else if(xDif < 0){
    if(yDif > 0){
      dir = PI - atan(-yDif/xDif);
    }else{
      dir = atan(yDif/xDif) - PI
    }
  }else{
    if(yDif > 0){
      dir = HALF_PI
    }else{
      dir = -HALF_PI
    }
  }
  
  return dir;
}

function centerCanvas() {
  cnv.position((windowWidth - width) / 2, (windowHeight - height) / 2);
}

function windowResized() {
  if (hasSetup){
    if (windowHeight > (windowWidth/2)){
      resizeCanvas(windowWidth-100, ((windowWidth-100)/2)+30);
    }else{
      resizeCanvas((windowHeight-100)*2, (windowHeight-50)+30);
    }
    centerCanvas();

    worldViewWidth = width;
    worldViewHeight = height-30;
    scalar = (worldViewWidth/areaSizeX);

    Object.keys(stateDict).forEach(function x(key){
      stateDict[key].resize();
    });
  }
}

function playZombieDeath(px, py, zombie){
  let dist = (((zombie.x-px)**2) + ((zombie.y-py)**2))**0.5
  if (dist < 2500){
    soundDict.zombie.death.rate((Math.random()*0.4)+0.8);
    soundDict.zombie.death.setVolume((0.3-(dist/2500))*soundLevels.zombies);
    soundDict.zombie.death.play();
  }
}

function renderText(txt, x, y, size, hAlign){
  textFont(montserrat);
  textSize(size);
  textAlign(hAlign, CENTER);
  text(txt, x, y);
}

let hasSetup = false;

function setMusic(music){
  if(!glitched){
    currentMusic.stop();
    currentMusic = music;
    currentMusic.loop();
  }
}

function setGameState(n){
  gameState = stateDict[n];
}

function preload() {
  montserrat = loadFont('assets/Montserrat-Black.otf');
  imgDict = {
            title:loadImage("assets/images/title.png"),
    titleglitched:loadImage("assets/images/titleglitched.png"),
   titleglitched2:loadImage("assets/images/titleglitched2.png"),
   titleglitched3:loadImage("assets/images/titleglitched3.png"),
             gone:loadImage("assets/images/gone.jpg"),
          carPark:loadImage("assets/images/bg.jpg"),
             shop:loadImage("assets/images/shop.jpg"),
            road1:loadImage("assets/images/road1.png"),
            road2:loadImage("assets/images/road2.png"),
          road3_5:loadImage("assets/images/road3_5.png"),
          road4_8:loadImage("assets/images/road4_8.png"),
            road6:loadImage("assets/images/road6.png"),
            road7:loadImage("assets/images/road7.png"),
            road9:loadImage("assets/images/road9.png"),
        road10_13:loadImage("assets/images/road10_13.png"),
           road11:loadImage("assets/images/road11.png"),
           road12:loadImage("assets/images/road12.png"),
             exit:loadImage("assets/images/exit.png"),
        yellowcar:loadImage("assets/images/yellowCar.png"),
  };
  
  soundFormats('mp3');
  soundDict = {   hit:loadSound("assets/sounds/hit.mp3"),
    
               weapon:{
                       pistol:loadSound("assets/sounds/pistol.mp3"),
                 pistolReload:loadSound("assets/sounds/pistolReload.mp3"),
                          smg:loadSound("assets/sounds/smg.mp3"),
                    smgReload:loadSound("assets/sounds/smgReload.mp3"),
                      shotgun:loadSound("assets/sounds/shotgun.mp3"),
                shotgunReload:loadSound("assets/sounds/shotgunReload.mp3"),
                           ar:loadSound("assets/sounds/ar.mp3"),
                     arReload:loadSound("assets/sounds/arReload.mp3"),
                          lmg:loadSound("assets/sounds/lmg.mp3"),
                    lmgReload:loadSound("assets/sounds/lmgReload.mp3"),
                      minigun:loadSound("assets/sounds/minigun.mp3"),
                minigunReload:loadSound("assets/sounds/minigunReload.mp3"),
                     electric:loadSound("assets/sounds/electric.ogg"),
                      },
    
               zombie:{
                       ambient:[loadSound("assets/sounds/zombie1.mp3"),
                                loadSound("assets/sounds/zombie2.mp3"),
                                loadSound("assets/sounds/zombie3.mp3"),
                                loadSound("assets/sounds/zombie4.mp3"),
                                loadSound("assets/sounds/zombie5.mp3"),
                                loadSound("assets/sounds/zombie6.mp3"),
                                loadSound("assets/sounds/zombie7.mp3"),
                                loadSound("assets/sounds/zombie8.mp3"),],
                         death:loadSound("assets/sounds/zombieDeath.mp3"),
                      },
    
              bgMusic:{
                       title:loadSound("assets/sounds/title.mp3"),
                      glitch:loadSound("assets/sounds/glitch.mp3"),
                     default:loadSound("assets/sounds/Controlled Chaos.mp3"),
                      },
  };
  
  soundDict.weapon.electric.setVolume(0.05);
}

function setup() {
  if (windowHeight > (windowWidth/2)){ //LEET 1337 but not for long
    cnv = createCanvas(windowWidth-100, ((windowWidth-100)/2)+30);
  }else{
    cnv = createCanvas((windowHeight*2)-100, (windowHeight-50)+30);
  }
  
  //frameRate(5);
  
  worldViewWidth = width;
  worldViewHeight = height-30;
  scalar = (worldViewWidth/areaSizeX);
  
  centerCanvas();
  
  soundDict.hit.setVolume(0.2);
  
  stateDict = {
         defaultMode:new defMode(),
    sharpshooterMode:new ssMode(),
             mapMode:new mapMode(),
            mainMenu:new MainMenu(),
         deathScreen:new DeathScreen(),
         pauseScreen:new PauseScreen(),
        controlsMenu:new ControlsMenu(),
        settingsMenu:new SettingsMenu(),
       pregameScreen:new PreGameScreen(),
             credits:new CreditScreen(),
           audioMenu:new AudioMenu()
  };
  
  if(glitched){
    zombiesActive = false;
    currentMusic = soundDict.bgMusic.glitch;
    currentMusic.loop();
  }else{
    currentMusic = soundDict.bgMusic.title;
    currentMusic.loop();
  }
  
  hasSetup = true;
  setGameState("mainMenu");
}

function draw() {
  background(10);
  if (hasSetup){
    gameState.update();
  }
  mouseWasPressed = false;
  mouseWasReleased = false;
  interactPressed = false;
}
