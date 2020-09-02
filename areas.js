class Obstacle{
  constructor(points, normals){
    this.points = points;
    this.normals = normals;
  }
}

class ExitTrigger{
  constructor(points, exitTo, entryPoint, arrowSide){
    this.points = points;
    this.exitTo = exitTo;
    this.entryPoint = entryPoint;
    this.arrowSide = arrowSide;
  }
  
  draw(){
    fill(0);
    strokeWeight(1);
    line(this.points[0]*scalar, this.points[1]*scalar,
         this.points[2]*scalar, this.points[3]*scalar);
    switch(this.arrowSide){
      case 0:
        push();
        translate((this.points[0]+((this.points[2]-this.points[0])/2))*scalar,
                  (this.points[1]-20)*scalar);
        rotate(PI);
        image(imgDict.exit, -15*scalar, -20*scalar, 30*scalar, 40*scalar);
        pop();
        break;
        
      case 1:
        push();
        translate((this.points[0]-5)*scalar,
                  (this.points[1]+((this.points[3]-this.points[1])/2))*scalar);
        rotate(-HALF_PI);
        image(imgDict.exit, -15*scalar, 20*scalar, 30*scalar, 40*scalar);
        pop();
        break;
        
      case 2:
        image(imgDict.exit, (this.points[0]+(((this.points[2]-this.points[0])/2)-15))*scalar, 
              (this.points[1]+20)*scalar, 30*scalar, 40*scalar);
        break;
        
      case 3:
        push();
        translate((this.points[0]-35)*scalar,
                  (this.points[1]+((this.points[3]-this.points[1])/2))*scalar);
        rotate(HALF_PI);
        image(imgDict.exit, -15*scalar, -20*scalar, 30*scalar, 40*scalar);
        pop();
        break;
    }
  }
}

class Area{
  constructor(){
    this.name = "template";
    this.bg = "carPark";
    this.areaSizeX = 1600;
    this.areaSizeY = 800;
    this.startPos = [0, 0];
    this.exits = [];
    this.obstacles = [];
    this.zombies = [];
    this.cars = [];
    this.items = [];
  }
}

class CarPark extends Area{
  constructor(){
    super();
    this.name = "Car Park";
    this.bg = "carPark";
    this.areaSizeX = 1600;
    this.areaSizeY = 800;
    this.startPos = [800, 400];
    this.exits = [new ExitTrigger([1210, 0, 1380, 0], "shop", [1800, 950], 2),
                  new ExitTrigger([1435, 0, 1590, 0], "road1", [478, 1450], 2),
                  new ExitTrigger([15, 800, 173, 800], "road10", [621, 50], 0),];
    this.obstacles = [new Obstacle([190, 175, 320, 175, 320, 245, 190, 245, 190, 175],
                                   [HALF_PI, 0, -HALF_PI, -PI]),
                      new Obstacle([810, 180, 950, 180, 950, 250, 810, 250, 810, 180],
                                   [HALF_PI, 0, -HALF_PI, -PI]),
                      new Obstacle([815, 365, 950, 365, 950, 435, 815, 435, 815, 365],
                                   [HALF_PI, 0, -HALF_PI, -PI]),
                      new Obstacle([1162, 488, 1273, 403, 1310, 454, 1200, 540, 1162, 488],
                                   [3*QUARTER_PI, QUARTER_PI, -QUARTER_PI, -3*QUARTER_PI]),
                      new Obstacle([663, 468, 785, 447, 800, 503, 669, 528, 663, 468],
                                   [(5*PI)/8, PI/8, (-3*PI)/8, (-7*PI)/8])
                     ];
    this.cars = [new YellowSuperCar(1500, 700, 0),
                 new YellowSuperCar(1500, 600, 0),
                 new YellowSuperCar(1500, 500, 0),
                 new YellowSuperCar(1500, 400, 0),
                 new YellowSuperCar(1500, 300, 0),];
  }
}

class Shop extends Area{
  constructor(){
    super();
    this.name = "Shop";
    this.bg = "shop";
    this.areaSizeX = 2000;
    this.areaSizeY = 1000;
    this.startPos = [1800, 950];
    this.exits = [new ExitTrigger([1685, 1000, 1899, 1000], "carPark", [1295, 50], 0)];
    this.obstacles = [new Obstacle([85, 90, 215, 90, 215, 395, 85, 395, 85, 90],
                                   [HALF_PI, 0, -HALF_PI, -PI]),
                      new Obstacle([365, 90, 495, 90, 495, 395, 365, 395, 365, 90],
                                   [HALF_PI, 0, -HALF_PI, -PI]),
                      new Obstacle([645, 90, 775, 90, 775, 395, 645, 395, 645, 90],
                                   [HALF_PI, 0, -HALF_PI, -PI]),
                      new Obstacle([925, 90, 1055, 90, 1055, 395, 925, 395, 925, 90],
                                   [HALF_PI, 0, -HALF_PI, -PI]),
                      new Obstacle([1205, 90, 1335, 90, 1335, 395, 1205, 395, 1205, 90],
                                   [HALF_PI, 0, -HALF_PI, -PI]),
                      new Obstacle([1485, 90, 1615, 90, 1615, 395, 1485, 395, 1485, 90],
                                   [HALF_PI, 0, -HALF_PI, -PI]),
                      
                      new Obstacle([85, 542, 215, 542, 215, 847, 85, 847, 85, 542],
                                   [HALF_PI, 0, -HALF_PI, -PI]),
                      new Obstacle([365, 542, 495, 542, 495, 847, 365, 847, 365, 542],
                                   [HALF_PI, 0, -HALF_PI, -PI]),
                      new Obstacle([645, 542, 775, 542, 775, 847, 645, 847, 645, 542],
                                   [HALF_PI, 0, -HALF_PI, -PI]),
                      new Obstacle([925, 542, 1055, 542, 1055, 847, 925, 847, 925, 542],
                                   [HALF_PI, 0, -HALF_PI, -PI]),
                      new Obstacle([1205, 542, 1335, 542, 1335, 847, 1205, 847, 1205, 542],
                                   [HALF_PI, 0, -HALF_PI, -PI]),
                      new Obstacle([1485, 542, 1615, 542, 1615, 847, 1485, 847, 1485, 542],
                                   [HALF_PI, 0, -HALF_PI, -PI]),
                      
                      new Obstacle([1844, 700, 1895, 700, 1895, 852, 1951, 852, 1951, 909, 1844, 909, 1844, 700],
                                   [HALF_PI, 0, HALF_PI, 0, -HALF_PI, -PI]),
                      
                      new Obstacle([2000, 90, 1761, 90, 1761, 135, 2000, 135, 2000, 90],
                                   [HALF_PI, -PI, -HALF_PI, 0]),
                      new Obstacle([2000, 200, 1761, 200, 1761, 245, 2000, 245, 2000, 200],
                                   [HALF_PI, -PI, -HALF_PI, 0]),
                      new Obstacle([2000, 318, 1761, 318, 1761, 357, 2000, 357, 2000, 318],
                                   [HALF_PI, -PI, -HALF_PI, 0])
                     ];
  }
}

class Road1 extends Area{
  constructor(){
    super();
    this.name = "Road1";
    this.bg = "road1";
    this.areaSizeX = 3000;
    this.areaSizeY = 1500;
    this.startPos = [1500, 750];
    this.exits = [new ExitTrigger([305, 1500, 650, 1500], "carPark", [1513, 50], 0),
                  new ExitTrigger([3000, 110, 3000, 810], "road2", [50, 733], 3),
                  new ExitTrigger([2001, 1500, 2701, 1500], "road7", [1460, 50], 0)];
    
    this.obstacles = [new Obstacle([0, 0, 2000, 0, 2000, 110, 0, 110, 0, 0],
                                   [HALF_PI, 0, -HALF_PI, -PI]),
                      new Obstacle([0, 810, 305, 810, 305, 1500, 0, 1500, 0, 810],
                                   [HALF_PI, 0, -HALF_PI, -PI]),
                      new Obstacle([650, 810, 2000, 810, 2000, 1500, 650, 1500, 650, 810],
                                   [HALF_PI, 0, -HALF_PI, -PI]),
                      new Obstacle([2710, 0, 3000, 0, 3000, 105, 2710, 105, 2710, 0],
                                   [HALF_PI, 0, -HALF_PI, -PI]),
                      new Obstacle([2710, 810, 3000, 810, 3000, 1500, 2710, 1500, 2710, 810],
                                   [HALF_PI, 0, -HALF_PI, -PI])];
  }
}

class Road2 extends Area{
  constructor(){
    super();
    this.name = "Road2";
    this.bg = "road2";
    this.areaSizeX = 3000;
    this.areaSizeY = 1500;
    this.startPos = [1500, 750];
    this.exits = [new ExitTrigger([0, 345, 0, 1110], "road1", [2950, 465], 1),
                  new ExitTrigger([3000, 345, 3000, 1110], "road3", [50, 733], 3)];
    
    this.obstacles = [new Obstacle([0, 0, 3000, 0, 3000, 345, 0, 345, 0, 0],
                                   [HALF_PI, 0, -HALF_PI, -PI]),
                      new Obstacle([0, 1110, 3000, 1110, 3000, 1500, 0, 1500, 0, 1110],
                                   [HALF_PI, 0, -HALF_PI, -PI])];
  }
}

class Road3 extends Area{
  constructor(){
    super();
    this.name = "Road3";
    this.bg = "road3_5";
    this.areaSizeX = 3000;
    this.areaSizeY = 1500;
    this.startPos = [1500, 750];
    this.exits = [new ExitTrigger([0, 345, 0, 1110], "road2", [2950, 733], 1),
                  new ExitTrigger([1205, 1500, 1972, 1500], "road4", [1590, 50], 0)];
    
    this.obstacles = [new Obstacle([0, 0, 1207, 0, 1207, 345, 0, 345, 0, 0],
                                   [HALF_PI, 0, -HALF_PI, -PI]),
                      new Obstacle([0, 1110, 1207, 1110, 1207, 1500, 0, 1500, 0, 1110],
                                   [HALF_PI, 0, -HALF_PI, -PI]),
                      new Obstacle([1972, 0, 3000, 0, 3000, 1500, 1972, 1500, 1972, 0],
                                   [HALF_PI, 0, -HALF_PI, -PI])];
  }
}


class Road4 extends Area{
  constructor(){
    super();
    this.name = "Road4";
    this.bg = "road4_8";
    this.areaSizeX = 3000;
    this.areaSizeY = 1500;
    this.startPos = [1500, 750];
    this.exits = [new ExitTrigger([1205, 0, 1972, 0], "road3", [1590, 1450], 2),
                  new ExitTrigger([1205, 1500, 1972, 1500], "road5", [1590, 50], 0)];
    
    this.obstacles = [new Obstacle([1972, 0, 3000, 0, 3000, 1500, 1972, 1500, 1972, 0],
                                   [HALF_PI, 0, -HALF_PI, -PI]),
                      new Obstacle([0, 0, 1207, 0, 1207, 1500, 0, 1500, 0, 0],
                                   [HALF_PI, 0, -HALF_PI, -PI])];
  }
}

class Road5 extends Area{
  constructor(){
    super();
    this.name = "Road5";
    this.bg = "road3_5";
    this.areaSizeX = 3000;
    this.areaSizeY = 1500;
    this.startPos = [1500, 750];
    this.exits = [new ExitTrigger([1205, 0, 1972, 0], "road4", [1590, 1450], 2),
                  new ExitTrigger([0, 345, 0, 1110], "road6", [2950, 733], 1),
                  new ExitTrigger([1205, 1500, 1972, 1500], "road8", [1599, 50], 0)];
    
    this.obstacles = [new Obstacle([0, 0, 1207, 0, 1207, 345, 0, 345, 0, 0],
                                   [HALF_PI, 0, -HALF_PI, -PI]),
                      new Obstacle([0, 1110, 1207, 1110, 1207, 1500, 0, 1500, 0, 1110],
                                   [HALF_PI, 0, -HALF_PI, -PI]),
                      new Obstacle([1972, 0, 3000, 0, 3000, 1500, 1972, 1500, 1972, 0],
                                   [HALF_PI, 0, -HALF_PI, -PI])];
  }
}

class Road6 extends Area{
  constructor(){
    super();
    this.name = "Road6";
    this.bg = "road6";
    this.areaSizeX = 3000;
    this.areaSizeY = 1500;
    this.startPos = [1500, 750];
    this.exits = [new ExitTrigger([3000, 343, 3000, 1110], "road5", [50, 733], 3),
                  new ExitTrigger([345, 0, 1051, 0], "road7", [1460, 1450], 2),
                  new ExitTrigger([0, 343, 0, 1110], "road9",  [2950, 733], 1)];
    
    this.obstacles = [new Obstacle([0, 0, 347, 0, 347, 343, 0, 343, 0, 0],
                                   [HALF_PI, 0, -HALF_PI, -PI]),
                      new Obstacle([1051, 0, 3000, 0, 3000, 343, 1051, 343, 1051, 0],
                                   [HALF_PI, 0, -HALF_PI, -PI]),
                      new Obstacle([0, 1110, 3000, 1110, 3000, 1500, 0, 1500, 0, 1110],
                                   [HALF_PI, 0, -HALF_PI, -PI])];
  }
}


class Road7 extends Area{
  constructor(){
    super();
    this.name = "Road7";
    this.bg = "road7";
    this.areaSizeX = 3000;
    this.areaSizeY = 1500;
    this.startPos = [1500, 750];
    this.exits = [new ExitTrigger([1110, 0, 1810, 0], "road1", [2371, 1450], 2),
                  new ExitTrigger([1110, 1500, 1810, 1500], "road6", [710, 50], 0)];
    
    this.obstacles = [new Obstacle([0, 0, 1110, 0, 1110, 1500, 0, 1500, 0, 0],
                                   [HALF_PI, 0, -HALF_PI, -PI]),
                      new Obstacle([1810, 0, 3000, 0, 3000, 1500, 1810, 1500, 1810, 0],
                                   [HALF_PI, 0, -HALF_PI, -PI])];
  }
}

class Road8 extends Area{
  constructor(){
    super();
    this.name = "Road8";
    this.bg = "road4_8";
    this.areaSizeX = 3000;
    this.areaSizeY = 1500;
    this.startPos = [1500, 750];
    this.exits = [new ExitTrigger([1205, 0, 1972, 0], "road5", [1599, 1450], 2),];
    
    this.obstacles = [new Obstacle([1972, 0, 3000, 0, 3000, 1500, 1972, 1500, 1972, 0],
                                   [HALF_PI, 0, -HALF_PI, -PI]),
                      new Obstacle([0, 0, 1207, 0, 1207, 1500, 0, 1500, 0, 0],
                                   [HALF_PI, 0, -HALF_PI, -PI])];
  }
}

class Road9 extends Area{
  constructor(){
    super();
    this.name = "Road9";
    this.bg = "road9";
    this.areaSizeX = 3000;
    this.areaSizeY = 1500;
    this.startPos = [1500, 750];
    this.exits = [new ExitTrigger([3000, 345, 3000, 1107], "road6", [50, 733], 3),
                  new ExitTrigger([1167, 1500, 1871, 1500], "road11", [1527, 50], 0),
                  new ExitTrigger([0, 345, 0, 1107], "road10", [2950, 725], 1)];
    
    this.obstacles = [new Obstacle([0, 0, 3000, 0, 3000, 345, 0, 345, 0, 0],
                                   [HALF_PI, 0, -HALF_PI, -PI]),
                      new Obstacle([1871, 1107, 3000, 1107, 3000, 1500, 1871, 1500, 1871, 1107],
                                   [HALF_PI, 0, -HALF_PI, -PI]),
                      new Obstacle([0, 1107, 1167, 1107, 1167, 1500, 0, 1500, 0, 1107],
                                   [HALF_PI, 0, -HALF_PI, -PI])];
  }
}


class Road10 extends Area{
  constructor(){
    super();
    this.name = "Road10";
    this.bg = "road10_13";
    this.areaSizeX = 3000;
    this.areaSizeY = 1500;
    this.startPos = [1500, 750];
    this.exits = [new ExitTrigger([263, 0, 963, 0], "carPark", [90, 750], 2),
                  new ExitTrigger([3000, 343, 3000, 1109], "road9", [50, 725], 3)];
    
    this.obstacles = [new Obstacle([0, 0, 263, 0, 263, 1109, 3000, 1109, 3000, 1500, 0, 1500, 0, 0],
                                   [HALF_PI, 0, HALF_PI, 0, -HALF_PI, -PI]),
                      new Obstacle([963, 0, 3000, 0, 3000, 343, 963, 343, 963, 0],
                                   [HALF_PI, 0, -HALF_PI, -PI])];
  }
}

class Road11 extends Area{
  constructor(){
    super();
    this.name = "Road11";
    this.bg = "road11";
    this.areaSizeX = 3000;
    this.areaSizeY = 1500;
    this.startPos = [1500, 750];
    this.exits = [new ExitTrigger([1165, 0, 1872, 0], "road9", [1527, 1450], 2),
                  new ExitTrigger([0, 365, 0, 1071], "road12", [2950, 725], 1)];
    
    this.obstacles = [new Obstacle([0, 0, 1165, 0, 1165, 197, 1098.5, 250.6, 1043.8, 306.6, 1001, 365, 0, 365, 0, 0],
                                   [HALF_PI, 0, -QUARTER_PI/2, -QUARTER_PI, -3*(QUARTER_PI/2), -HALF_PI, -PI]),
                      new Obstacle([1872, 0, 3000, 0, 3000, 1500, 0, 1500, 0, 1071, 987, 1071,
                                    
                                    1138.0, 1228.2,
                                    1231.0, 1285.4,
                                    1332.6, 1325.5,
                                    1439.7, 1347.1,
                                    1548.9, 1349.7,
                                    1656.9, 1333.2,
                                    1760.3, 1298.0,
                                    1855.9, 1245.3,
                                    1940.9, 1176.6,
                                    2012.5, 1094.2,
                                    2068.6, 1000.5,
                                    2107.5, 898.4,
                                    2127.9, 791.1,
                                    2129.2, 681.9,
                                    2111.4, 574.1,
                                    2075.0, 471.1,
                                    2021.2, 376.1,
                                    1951.6, 291.9,
                                    
                                    1872, 216, 1872, 0],
                                   
                                   [HALF_PI, -HALF_PI, -PI, HALF_PI,
                                    
                                    0.785,
                                    0.932,
                                    1.107,
                                    1.283,
                                    1.459,
                                    1.635,
                                    1.811,
                                    1.987,
                                    2.162,
                                    2.338,
                                    2.514,
                                    2.69,
                                    2.866,
                                    3.042,
                                    -3.066,
                                    -2.89,
                                    -2.714,
                                    -2.538,
                                    -2.362,
                                    
                                    -PI])];
  }
}  


class Road12 extends Area{
  constructor(){
    super();
    this.name = "Road12";
    this.bg = "road12";
    this.areaSizeX = 3000;
    this.areaSizeY = 1500;
    this.startPos = [1500, 750];
    this.exits = [new ExitTrigger([3000, 365, 3000, 1071], "road11", [50, 725], 1)];
    
    this.obstacles = [new Obstacle([0, 0, 3000, 0, 3000, 369, 2009, 369,
                                    
                                    1936.6, 287.2,
                                    1847.0, 217.1,
                                    1756.8, 161.5,
                                    1658.4, 122.0,
                                    1554.7, 99.9,
                                    1448.8, 95.6,
                                    1343.7, 109.5,
                                    1242.4, 150.9,
                                    1148.0, 199.1,
                                    1063.1, 262.7,
                                    990.3, 339.7,
                                    931.6, 428.0,
                                    888.7, 524.9,
                                    863.0, 627.8,
                                    855.0, 733.5,
                                    865.2, 839.0,
                                    893.1, 941.3,
                                    937.9, 1037.3,
                                    998.5, 1124.4,
                                    1072.9, 1199.8,
                                    1159.1, 1261.6,
                                    1254.5, 1307.8,
                                    1356.3, 1337.2,
                                    1461.7, 1348.8,
                                    1567.5, 1342.4,
                                    1670.7, 1318.1,
                                    1768.3, 1276.6,
                                    1857.4, 1219.1,
                                    1935.4, 1147.4,
                                    
                                    2009, 1069, 3000, 1069, 3000, 1500, 0, 1500, 0, 0],
                                   
                                   [HALF_PI, 0, -HALF_PI,
                                    
                                    -2.356,
                                    -2.378,
                                    -2.208,
                                    -2.037,
                                    -1.867,
                                    -1.696,
                                    -1.525,
                                    -1.355,
                                    -1.184,
                                    -1.013,
                                    -0.843,
                                    -0.672,
                                    -0.501,
                                    -0.331,
                                    -0.16,
                                    0.011,
                                    0.181,
                                    0.352,
                                    0.523,
                                    0.693,
                                    0.864,
                                    1.034,
                                    1.205,
                                    1.376,
                                    1.546,
                                    1.717,
                                    1.888,
                                    2.058,
                                    2.229,
                                    2.4,
                                    
                                    HALF_PI, 0, -HALF_PI, PI])];
  }
} 


class Road13 extends Area{
  constructor(){
    super();
    this.name = "Road13";
    this.bg = "road10_13";
    this.areaSizeX = 3000;
    this.areaSizeY = 1500;
    this.startPos = [1500, 750];
    this.exits = [new ExitTrigger([263, 0, 963, 0], "road14", [90, 750], 2),
                  new ExitTrigger([3000, 343, 3000, 1109], "road9", [50, 725], 3)];
    
    this.obstacles = [new Obstacle([0, 0, 263, 0, 263, 1109, 3000, 1109, 3000, 1500, 0, 1500, 0, 0],
                                   [HALF_PI, 0, HALF_PI, 0, -HALF_PI, -PI]),
                      new Obstacle([963, 0, 3000, 0, 3000, 343, 963, 343, 963, 0],
                                   [HALF_PI, 0, -HALF_PI, -PI])];
  }
}
