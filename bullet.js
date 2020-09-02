class Bullet {
  constructor(x, y, dir, damage){
    this.centx = x;
    this.centy = y;
    this.x = x;
    this.y = y;
    this.damage = damage;
    this.dir = dir;
    this.dist = 0;
  }
  
  move(zombies){
    this.dist += 10;
    this.x = (this.dist * sin(this.dir)) + this.centx;
    this.y = (this.dist * cos(this.dir)) + this.centy;
  }
  
  draw(){
    stroke(250, 250, 150);
    fill(250, 250, 150);
    ellipse((this.x-3)*scalar , (this.y-3)*scalar, 6*scalar, 6*scalar);
    stroke(0);
  }
  
  special(zombies, arg0=0, arg1=0){
    return zombies;
  }
  
  specialOnHit(arg1){}
  
  attemptEnd(){
    return true;
  }
  
  drawSpecial(){}
}

class Lightning extends Bullet {
  constructor(x, y, dir, damage){
    super(x, y, dir, damage);
    this.currentZombies = [];
    this.boltsToDraw = [];
    this.canEnd = false;
  }
  
  draw(){
    stroke(255, 255, 255);
    fill(0, 200, 255);
    ellipse((this.x-3)*scalar , (this.y-3)*scalar, 6*scalar, 6*scalar);
    stroke(0);
  }
  
  drawSpecial(){
    push();
    stroke(0, 200, 255);
    strokeWeight(5);
    for (let i=0; i<this.boltsToDraw.length; i++){
      line(this.boltsToDraw[i][0]*scalar, this.boltsToDraw[i][1]*scalar,this.boltsToDraw[i][2]*scalar,this.boltsToDraw[i][3]*scalar);
    }
    pop();
  }
  
  checkNotInCurrent(id, newlist){
    for (let i=0; i<this.currentZombies.length; i++){
      if (this.currentZombies[i].id == id){
        return false;
      }
    }
    for (let i=0; i<newlist.length; i++){
      if (newlist[i].id == id){
        return false;
      }
    }
    return true;
  }
  
  special(zombies, x, y){
    let newList = [];
    if(this.currentZombies.length > 0 && frameCount % 5 == 0){
      this.boltsToDraw = [];
      
      for(let j=0; j<this.currentZombies.length; j++){
        
        for(let i=0; i<zombies.length; i++){
          let dist = (((zombies[i].x - this.currentZombies[j].x)**2) + ((zombies[i].y - this.currentZombies[j].y)**2))**0.5;
          if(dist < 200 && this.checkNotInCurrent(zombies[i].id, newList)){
            newList.push(zombies[i]);
            this.boltsToDraw.push([this.currentZombies[j].x, this.currentZombies[j].y, zombies[i].x, zombies[i].y]);
            
            
            if(Math.random() < 0.1){
              soundDict.weapon.electric.rate(1.5-Math.random());
              soundDict.weapon.electric.play();
            }
            
            
          }
        }
        for (let i=0; i<zombies.length; i++){
          if (zombies[i].id == this.currentZombies[j].id){
            zombies[i].health -= 100;
            zombies[i].speed *= 0.8;
          }
        }
        //playZombieDeath(x, y, this.currentZombies[j]);
        //kills++;
      }
      
      this.currentZombies = newList;
    }
    
    return zombies;
  }
  
  specialOnHit(zombie){
    soundDict.weapon.electric.rate(1.5-Math.random());
    soundDict.weapon.electric.play();
    this.currentZombies.push(zombie);
    this.canEnd = true;
  }
  
  attemptEnd(){
    return this.currentZombies.length == 0 && this.canEnd;
  }
}

class Wave extends Bullet{
  draw(){
    push();
    arc();
    pop();
  }
}
