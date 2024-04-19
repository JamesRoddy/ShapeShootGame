


export class Player{ 
    constructor(game){ 
        this.game = game;
        this.startX = this.game.width / 2;
        this.startY = this.game.height / 2;
        this.x = this.startX;
        this.y = this.startY;

        this.pwidth = 50;
        this.pheight = 50;
        this.collisionRadius = this.pheight;
        this.turretWidth = 10;
        this.turretHeight = 30;

        this.health = 200;
        this.hasTakenDamage = undefined;
        this.speedX = 4;
        this.SpeedY = 4;
        this.colour = "green";
        
           
     
    } 

    update(Key){ 
     //change direction based on key input
      if(Key.a == true){ 
          this.x -= this.speedX;
        }
      else if(Key.d == true){ 
            this.x += this.speedX; 
        }
      if(Key.w == true) { 
            this.y -= this.SpeedY;
        }
      else if(Key.s == true){ 
            this.y += this.SpeedY;
        }

       // detect if the player is going off screen
       this.OffScreen() 
 
        
    } 


    OffScreen() {
        let isOffScreenX = this.x - this.pwidth > this.game.width || this.x + this.pwidth < 0.0 ? true : false; 
        let isOffScreenY = this.y- this.pheight > this.game.height || this.y + this.pheight< 0.0 ? true : false; 
       
        if(isOffScreenX  ){ 
           if(this.x - this.pwidth > this.game.width){ // if player is going off the right 
                this.x = 0;
             }
           else{ 
             this.x = this.game.width;
             }
         } 
         if(isOffScreenY  ){ 
            if( this.y - this.pheight > this.game.height){  // if player is going off the bottom
                     this.y = 0
              }
            else{ 
                 this.y = this.game.height;
              }
         } 
        
       
    }
  

     playerCollsion(distance,radius){  // checking for player collsion based on the passed in distance vector and the radius of the object 
        let CheckCollsion = distance - radius - this.collisionRadius; 
        if(CheckCollsion<1){ 
            if(!this.hasTakenDamage){ 

                this.health -= radius;
                this.hasTakenDamage = true;

                setTimeout(()=>{  // give player a slight amount of invincibility when hit 
                    this.hasTakenDamage=false
                },500)
               
            } 
            return true // return true if there is a collsion
        
      } 
        
     }
    



    drawTurret(mouseX, mouseY, ctx){ 
      let turretX =  ((this.pwidth / 2) - (this.turretWidth / 2)) - 25;  // used for drawing the turret onto the centre of the  player with a slight offset
      let turretY =  ((this.pheight / 2) - (this.turretHeight / 2)) - 36;
     
      let differenceX = mouseX - this.x;
      let differenceY = mouseY - this.y;
      
      ctx.save(); 
      ctx.beginPath(); 
      ctx.fillStyle ="grey";  

      ctx.translate(this.x, this.y); 
     
      let rotation = Math.atan2(differenceX, -(differenceY)); // calculate angle between player and the mouse
      ctx.rotate(rotation); // used to rotate the turret towards the mouse

      ctx.fillRect(turretX, turretY, this.turretWidth, this.turretHeight);   // draw the turret at the correct x and y
      ctx.restore();
    }

    draw(mouseX, mouseY, ctx){ 
        
        ctx.save(); 
        ctx.beginPath();
        ctx.translate(this.x, this.y); 
        ctx.fillStyle = this.colour;
        ctx.fillRect(-25, -25, this.pwidth, this.pheight); 
        
        ctx.fillStyle = "grey";  
        ctx.arc((- this.pwidth / 2) + 25, (- this.pheight / 2) +25, 6, 0, Math.PI * 2); // drawing part of the turret onto the player at the centre
        
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        this.drawTurret(mouseX, mouseY, ctx); // draw turret once player has been drawn 
        
    }
    
    resetPos(){ 
        this.x = this.startX; 
        this.y = this.startY;
    }
    

}  


export class HealthBar { 

    constructor(game){ 
        
        this.game = game
        this.Hwidth = 200;
        this.x = this.game.width / 2 - this.Hwidth / 2;// gets very left x coordinate of healthbar
        this.Hheight = 20;
        this.offset = 20;
        
    }
    
    drawHealthBar(ctx){ 
        ctx.beginPath();
        ctx.fillStyle= "lightgreen"; 
        ctx.fillRect(this.x, this.offset, this.Hwidth, this.Hheight);
        
    } 
    
    update(currentPlayerHealth){ 
        
     // used to get the right edge of the health bar by adding the current width onto the very left coordinates    
        let currentEdgeDiffernce =  this.x + this.Hwidth 
        if(this.Hwidth != currentPlayerHealth && currentPlayerHealth > 0  ){ 
           this.game.particleHandler.generateSquareParticles(currentEdgeDiffernce, 20, "lightgreen", 5, 5, 5)
            this.Hwidth = currentPlayerHealth // update health bar to match current player health
           
        } 
        else if(currentPlayerHealth <= 0){ 
            this.Hwidth = 0
        }
     

    }

}