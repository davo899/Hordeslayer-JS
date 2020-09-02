class Zombie {
  constructor(x, y, health, speed, id){
    this.x = x;
    this.y = y;
    this.health = health;
    this.speed = speed;
    this.id = id;
    this.dir = 0;
    this.agro = false;
  }
  
  move(playerX, playerY, zombies){
    let xDif = this.x - playerX;
    let yDif = playerY - this.y;
    
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
    this.dir -= HALF_PI;
    
    this.x += this.speed * sin(this.dir);
    this.y += this.speed * cos(this.dir);
    
    for(let i = 0; i < zombies.length; i++){
      if(this.id != zombies[i].id &&
         checkOverlap(this.x-15, this.y-15, this.x+15, this.y+15, 
                      zombies[i].x-15, zombies[i].y-15, zombies[i].x+15, zombies[i].y+15)){
        
        let xDif = this.x - zombies[i].x;
        let yDif = zombies[i].y - this.y;
        let dir = 0;

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
        dir -= HALF_PI;
        
        this.x -= this.speed * sin(dir);
        this.y -= this.speed * cos(dir);
      }
    }
  }
  
  obstacleCheck(obstacles){
    for (let i=0; i<obstacles.length; i++){
      for (let j=0; (2+j)<obstacles[i].points.length; j+=2){
        
        if (intersect( [((20*scalar) * sin(this.dir + QUARTER_PI)) + (this.x*scalar),
                        ((20*scalar) * cos(this.dir + QUARTER_PI)) + (this.y*scalar)],
                       [((20*scalar) * sin(this.dir - QUARTER_PI)) + (this.x*scalar),
                        ((20*scalar) * cos(this.dir - QUARTER_PI)) + (this.y*scalar)],
                       [obstacles[i].points.slice(-j-4)[0]*scalar, obstacles[i].points.slice(-j-3)[0]*scalar],
                       [obstacles[i].points.slice(-j-2)[0]*scalar, obstacles[i].points.slice(-j-1)[0]*scalar] )){
          this.x += this.speed * sin(obstacles[i].normals.slice(-j/2 - 1)[0]+HALF_PI);
          this.y += this.speed * cos(obstacles[i].normals.slice(-j/2 - 1)[0]+HALF_PI);
        }
        
        if (intersect( [((20*scalar) * sin(this.dir - QUARTER_PI)) + (this.x*scalar),
                        ((20*scalar) * cos(this.dir - QUARTER_PI)) + (this.y*scalar)],
                       [((20*scalar) * sin(this.dir - (3 * QUARTER_PI))) + (this.x*scalar),
                        ((20*scalar) * cos(this.dir - (3 * QUARTER_PI))) + (this.y*scalar)],
                       [obstacles[i].points.slice(-j-4)[0]*scalar, obstacles[i].points.slice(-j-3)[0]*scalar],
                       [obstacles[i].points.slice(-j-2)[0]*scalar, obstacles[i].points.slice(-j-1)[0]*scalar] )){
          this.x += this.speed * sin(obstacles[i].normals.slice(-j/2 - 1)[0]+HALF_PI);
          this.y += this.speed * cos(obstacles[i].normals.slice(-j/2 - 1)[0]+HALF_PI);
        }
        
        if (intersect( [((20*scalar) * sin(this.dir - (3 * QUARTER_PI))) + (this.x*scalar),
                        ((20*scalar) * cos(this.dir - (3 * QUARTER_PI))) + (this.y*scalar)],
                       [((20*scalar) * sin(this.dir + (3 * QUARTER_PI))) + (this.x*scalar),
                        ((20*scalar) * cos(this.dir + (3 * QUARTER_PI))) + (this.y*scalar)],
                       [obstacles[i].points.slice(-j-4)[0]*scalar, obstacles[i].points.slice(-j-3)[0]*scalar],
                       [obstacles[i].points.slice(-j-2)[0]*scalar, obstacles[i].points.slice(-j-1)[0]*scalar] )){
          this.x += this.speed * sin(obstacles[i].normals.slice(-j/2 - 1)[0]+HALF_PI);
          this.y += this.speed * cos(obstacles[i].normals.slice(-j/2 - 1)[0]+HALF_PI);
        }
        
        if (intersect( [((20*scalar) * sin(this.dir + (3 * QUARTER_PI))) + (this.x*scalar),
                        ((20*scalar) * cos(this.dir + (3 * QUARTER_PI))) + (this.y*scalar)],
                       [((20*scalar) * sin(this.dir + QUARTER_PI)) + (this.x*scalar),
                        ((20*scalar) * cos(this.dir + QUARTER_PI)) + (this.y*scalar)],
                       [obstacles[i].points.slice(-j-4)[0]*scalar, obstacles[i].points.slice(-j-3)[0]*scalar],
                       [obstacles[i].points.slice(-j-2)[0]*scalar, obstacles[i].points.slice(-j-1)[0]*scalar] )){
          this.x += this.speed * sin(obstacles[i].normals.slice(-j/2 - 1)[0]+HALF_PI);
          this.y += this.speed * cos(obstacles[i].normals.slice(-j/2 - 1)[0]+HALF_PI);
        }
      }
    }
  }
  
  draw() {
    fill(50, 150, 50);
    quad( ((20*scalar) * sin(this.dir + QUARTER_PI)) + (this.x*scalar),
          ((20*scalar) * cos(this.dir + QUARTER_PI)) + (this.y*scalar),
          ((20*scalar) * sin(this.dir - QUARTER_PI)) + (this.x*scalar),
          ((20*scalar) * cos(this.dir - QUARTER_PI)) + (this.y*scalar),
          ((20*scalar) * sin(this.dir - (3 * QUARTER_PI))) + (this.x*scalar),
          ((20*scalar) * cos(this.dir - (3 * QUARTER_PI))) + (this.y*scalar),
          ((20*scalar) * sin(this.dir + (3 * QUARTER_PI))) + (this.x*scalar),
          ((20*scalar) * cos(this.dir + (3 * QUARTER_PI))) + (this.y*scalar) );
    //fill(255, 255, 255);
    //renderText(this.id.toString(), this.x*scalar, this.y*scalar, 16, CENTER);
  }
}
