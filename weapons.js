weaponVols = [0.08, 0.1,
              0.2, 0.06,
              0.3, 0.1,
              0.15, 0.5,
              0.55, 0.2,
              0.6, 0.3,
              1
             ];

class Weapon {
  constructor(damage, cooldown, milestone, next, name, magSize, reload, reloadSound){
    this.damage = damage;
    this.cooldown = cooldown;
    this.milestone = milestone;
    this.next = next;
    this.name = name;
    this.magSize = magSize;
    this.reload = reload;
    this.reloadSound = reloadSound;
  }
}

class ElectricGun extends Weapon{
  constructor(){
    super(0, 100, 0, 0, "Prototype XXIV-DCXXIX", 999, 10, "minigunReload");
    soundDict.weapon[this.reloadSound].setVolume(weaponVols[11]*soundLevels.weapons);
    soundDict.weapon.minigun.setVolume(weaponVols[10]*soundLevels.weapons);
  }
  
  fire(x, y, dir){
    //soundDict.weapon.minigun.play();
    return [new Lightning(x, y, dir, this.damage)];
  }
}
class Minigun extends Weapon{
  constructor(){
    super(500, 2, 1337, new ElectricGun(), "Minigun", 999, 300, "minigunReload");
    soundDict.weapon[this.reloadSound].setVolume(weaponVols[11]*soundLevels.weapons);
    soundDict.weapon.minigun.setVolume(weaponVols[10]*soundLevels.weapons);
  }
  
  fire(x, y, dir){
    soundDict.weapon.minigun.play();
    return [new Bullet(x, y, dir, this.damage)];
  }
}
class LMG extends Weapon{
  constructor(){
    super(300, 6, 1000, new Minigun(), "LMG", 100, 180, "lmgReload");
    soundDict.weapon[this.reloadSound].setVolume(weaponVols[9]*soundLevels.weapons);
    soundDict.weapon.lmg.setVolume(weaponVols[8]*soundLevels.weapons);
  }
  
  fire(x, y, dir){
    soundDict.weapon.lmg.play();
    return [new Bullet(x, y, dir, this.damage)];
  }
}
class AR extends Weapon{
  constructor(){
    super(50, 6, 500, new LMG(), "Assault Rifle", 30, 60, "arReload");
    soundDict.weapon[this.reloadSound].setVolume(weaponVols[7]*soundLevels.weapons);
    soundDict.weapon.ar.setVolume(weaponVols[6]*soundLevels.weapons);
  }
  
  fire(x, y, dir){
    soundDict.weapon.ar.play();
    return [new Bullet(x, y, dir, this.damage)];
  }
}
class Shotgun extends Weapon{
  constructor(){
    super(40, 40, 250, new AR(), "Shotgun", 12, 30, "shotgunReload");
    soundDict.weapon[this.reloadSound].setVolume(weaponVols[5]*soundLevels.weapons);
    soundDict.weapon.shotgun.setVolume(weaponVols[4]*soundLevels.weapons);
  }
  
  fire(x, y, dir){
    soundDict.weapon.shotgun.play();
    return [new Bullet(x, y, dir, this.damage),
            new Bullet(x, y, dir+(PI/36), this.damage),
            new Bullet(x, y, dir-(PI/36), this.damage),
            new Bullet(x, y, dir+(PI/18), this.damage),
            new Bullet(x, y, dir-(PI/18), this.damage),];
  }
}
class SMG extends Weapon{
  constructor(){
    super(10, 5, 100, new Shotgun(), "SMG", 50, 60, "smgReload");
    soundDict.weapon[this.reloadSound].setVolume(weaponVols[3]*soundLevels.weapons);
    soundDict.weapon.smg.setVolume(weaponVols[2]*soundLevels.weapons);
  }
  
  fire(x, y, dir){
    soundDict.weapon.smg.play();
    return [new Bullet(x, y, dir, this.damage)];
  }
}
class Pistol extends Weapon{
  constructor(){
    super(10, 20, 20, new SMG(), "Pistol", 8, 60, "pistolReload");
    soundDict.weapon[this.reloadSound].setVolume(weaponVols[1]*soundLevels.weapons);
    soundDict.weapon.pistol.setVolume(weaponVols[0]*soundLevels.weapons);
  }
  
  fire(x, y, dir){
    soundDict.weapon.pistol.play();
    return [new Bullet(x, y, dir, this.damage)];
  }
}
