class Message{
  constructor(txt, time, col){
    this.txt = txt;
    this.time = time;
    this.col = col;
  }
}

class MessageBar{
  constructor(){
    this.displayTimer = 0;
    this.messageQueue = [];
  }
  
  addMessage(msg){
    this.messageQueue.push(msg);
    if (this.displayTimer == 0){
      this.displayTimer = msg.time;
    }
  }
  
  draw(){
    fill(0);
    rect(0, height-30, width, height);
    if (this.displayTimer > 0){
      fill(this.messageQueue[0].col[0], this.messageQueue[0].col[1], this.messageQueue[0].col[2],
           255*sin(this.displayTimer/(this.messageQueue[0].time/PI)));
      renderText(this.messageQueue[0].txt, width/2, height-15, 18, CENTER);
    }
  }
  
  update(){
    if (this.displayTimer > 0){
      this.displayTimer--;
      
      if (this.displayTimer == 0){
        this.messageQueue.shift();
        if (this.messageQueue.length > 0){
          this.displayTimer = this.messageQueue[0].time;
        }
      }
    }
  }
}
