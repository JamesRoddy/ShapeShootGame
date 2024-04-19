


export class BulletHandler { 
 
    constructor(game){ 
        this.game = game;
        this.bullets = [];
        this.canFire = true;
    } 
  

    shoot(startX, startY, directionX, directionY){  // define startign loctaion and the direction the bullet needs to travel on 
            this.bullets.push(new Bullet(startX, startY)); // add the bullet to the  bullet handler array with the defined start location as its x and y
            this.bullets[this.bullets.length-1].calculateDirection(directionX, directionY); // calculate the direction the for the  most recent bullet pushed to the array 
            
     }
   
     resetBullets(){ // method used to reset bullets on game restart
        this.bullets = [];
     } 
     
     handle_bullet(ctx){ 
        for(let i=0; i < this.bullets.length; i++){ 
            if(this.bullets[i].x - this.bullets[i].width > this.game.width || this.bullets[i].x + this.bullets[i].width < 0.0 
                || this.bullets[i].y - this.bullets[i].height > this.game.height || this.bullets[i].y + this.bullets[i].height < 0.0 ){ // check if bullet has gone off the canvas
               
                 this.bullets.splice(this.bullets[i], 1); // remove bullet that has gone off canvas

                }
              else{ 
                this.bullets[i].update(); // otherwise update and draw bullet
                this.bullets[i].drawBullet(ctx);
              }
              
    
            
        } 
    }
}

class Bullet{ 
        constructor(startx,starty){
            
            this.x = startx; 
            this.y = starty; 

            this.colour = "lightgrey";
            this.damage = 8;
            this.dx = 0; 
            this.dy = 0;

            this.bulletSpeed = 10;
            this.width = 10; 
            this.height = 10;
            this.collisionRadius = 10
          
    
        } 

        calculateDirection(directionX,directionY){ 
            // calculate vector that the bullet needs to travel along 
            let dirX = directionX - this.x  // get differnce between x and y
            let dirY = directionY - this.y
            let distance = Math.sqrt(dirX ** 2 + dirY ** 2); // calculate length of vector
          
            dirX /= distance; // normalize vector 
            dirY /= distance;
          
            this.dx += dirX * this.bulletSpeed; 
            this.dy += dirY * this.bulletSpeed; 
            
        }
        

        update(){ 
            this.x += this.dx; // move bullet along the calculated vector 
            this.y += this.dy;
            
        } 
        drawBullet(ctx){ 
            ctx.save();
            ctx.beginPath(); 
            ctx.fillStyle = this.colour;
            ctx.fillRect(this.x,this.y,this.width,this.height);  
            ctx.restore();
       
     
         }
} 



