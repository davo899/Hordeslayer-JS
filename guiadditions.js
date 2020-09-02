class Button {
  constructor(x, y, w, h, capt, captSize, border){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.capt = capt;
    this.captSize = captSize;
    this.border = border;
    this.mouseOver = false;
  }
  
  drawRect(){
    push();
    rectMode(CENTER);
    fill(255);
    rect(this.x, this.y, this.w, this.h);
    if (this.mouseHeld || this.mouseOver){
      fill(100);
    }else{
      fill(0);
    }
    rect(this.x, this.y, this.w-(2*this.border), this.h-(2*this.border));
    pop();
  }
  
  draw(){
    this.drawRect();
    fill(255);
    renderText(this.capt, this.x, this.y, this.captSize, CENTER);
  }
  
  handleEvent(){
    if (mouseX > this.x-(this.w/2) && mouseX < this.x+(this.w/2) && mouseY > this.y-(this.h/2) && mouseY < this.y+(this.h/2)){
      this.mouseOver = true;
    }else{
      this.mouseOver = false;
    }
    
    if (mouseWasPressed && this.mouseOver){
      this.mouseHeld = true;
    }
    
    if (mouseWasReleased){
      if (this.mouseHeld && this.mouseOver){
        this.mouseHeld = false;
        return true;
      }
      this.mouseHeld = false;
    }
    
    return false;
  }
}

class ControlSelector extends Button{
  constructor(x, y, w, h, index, captSize, border){
    super(x, y, w, h, "", captSize, border);
    this.index = index;
    this.focus = false;
    
    if (controlDict[this.index] in nonAlphaKeys){
      this.capt = nonAlphaKeys[controlDict[this.index]];
    }else{
      this.capt = String.fromCharCode(controlDict[this.index]);
    }
  }
  
  setCaption(keycode){
    if (keycode in nonAlphaKeys){
      this.capt = nonAlphaKeys[keycode];
    }else{
      this.capt = String.fromCharCode(keycode);
    }
  }
  
  handleEvent(){
    if (mouseX > this.x-(this.w/2) && mouseX < this.x+(this.w/2) &&
        mouseY > this.y-(this.h/2) && mouseY < this.y+(this.h/2)){
      this.mouseOver = true;
    }else{
      this.mouseOver = false;
    }
    
    if (mouseWasPressed && this.mouseOver){
      this.mouseHeld = true;
    }
    
    if (mouseWasReleased){
      if (this.mouseHeld && this.mouseOver){
        this.focus = true;
      }
      this.mouseHeld = false;
    }
    
  }
}

class Slider extends Button{
  constructor(x, y, index, border){
    super(x, y, 10, 30, "", 0, border);
    this.index = index;
    this.linex1 = x-300;
    this.linex2 = x;
  }
  
  draw(){
    stroke(255);
    line(this.linex1, this.y, this.linex2, this.y);
    this.drawRect();
  }
  
  handleEvent(){
    if (mouseX > this.x-(this.w/2) && mouseX < this.x+(this.w/2) &&
        mouseY > this.y-(this.h/2) && mouseY < this.y+(this.h/2)){
      this.mouseOver = true;
    }else{
      this.mouseOver = false;
    }
    
    if (mouseWasPressed && this.mouseOver){
      this.mouseHeld = true;
    }
    
    if (mouseWasReleased){
      this.mouseHeld = false;
    }
    
    let update = false;
    
    if (this.mouseHeld && mouseX < this.x-3 && soundLevels[this.index] >= 0){
      this.x = mouseX
      soundLevels[this.index] = (this.x-this.linex1)/300;
      update = true;
    }
    
    if (this.mouseHeld && mouseX > this.x+3 && soundLevels[this.index] <= 1){
      this.x = mouseX
      soundLevels[this.index] = (this.x-this.linex1)/300;
      update = true;
    }
    
    if (this.x > this.linex1+300){
      this.x = this.linex1+300;
      soundLevels[this.index] = 1;
    }
    
    if (this.x < this.linex1){
      this.x = this.linex1;
      soundLevels[this.index] = 0;
    }
    
    return update;
  }
}
