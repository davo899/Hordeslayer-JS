class Car{
  constructor(x, y, dir, img, topSpeed){
    this.img = img;
    this.topSpeed = topSpeed**0.5;
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.velo = 0;
    
    let dst = ((75**2)+(45**2))**0.5;
    this.points = [[((dst * cos(-this.dir-(5*PI/6)))+this.x)*scalar, ((dst * sin(-this.dir-(5*PI/6)))+this.y)*scalar],
                  [((dst * cos(-this.dir+(5*PI/6)))+this.x)*scalar, ((dst * sin(-this.dir+(5*PI/6)))+this.y)*scalar],
                  [((dst * cos(-this.dir+(PI/6)))+this.x)*scalar, ((dst * sin(-this.dir+(PI/6)))+this.y)*scalar],
                  [((dst * cos(-this.dir-(PI/6)))+this.x)*scalar, ((dst * sin(-this.dir-(PI/6)))+this.y)*scalar],];
    
    this.normals = [];
    for(let i=0; i<this.points.length-1; i++){
      this.normals.push(findNormal([this.x*scalar, this.y*scalar], this.points[i], this.points[i+1]));
    }
  }
  
  draw(){
    push();
    translate(this.x*scalar, this.y*scalar);
    rotate(-this.dir);
    image(imgDict[this.img], -75*scalar, -45*scalar, 150*scalar, 90*scalar);
    pop();
    
    let dst = ((75**2)+(45**2))**0.5;
    this.points = [[((dst * cos(-this.dir-(5*PI/6)))+this.x)*scalar, ((dst * sin(-this.dir-(5*PI/6)))+this.y)*scalar],
                  [((dst * cos(-this.dir+(5*PI/6)))+this.x)*scalar, ((dst * sin(-this.dir+(5*PI/6)))+this.y)*scalar],
                  [((dst * cos(-this.dir+(PI/6)))+this.x)*scalar, ((dst * sin(-this.dir+(PI/6)))+this.y)*scalar],
                  [((dst * cos(-this.dir-(PI/6)))+this.x)*scalar, ((dst * sin(-this.dir-(PI/6)))+this.y)*scalar],];
    
    this.points.push(this.points[0]);
    
    this.normals = [];
    for(let i=0; i<this.points.length-1; i++){
      this.normals.push(findNormal([this.x*scalar, this.y*scalar], this.points[i], this.points[i+1]));
    }
  }
  
  move(){
    this.x += 0.3*this.velo*cos(this.dir);
    this.y -= 0.3*this.velo*sin(this.dir);
    
    if (this.velo > -1 && this.velo < 1){
      this.velo = 0;
    }
      
    if (this.velo > 0){
      this.velo-=0.2;
    }else if(this.velo < 0){
      this.velo+=0.2;
    }
  }
}

class YellowCar extends Car{
  constructor(x, y, dir){
    super(x, y, dir, "yellowcar", 49);
  }
}

class YellowSuperCar extends Car{
  constructor(x, y, dir){
    super(x, y, dir, "yellowcar", 100);
  }
}
