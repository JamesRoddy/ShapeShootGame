



export class EnemiesHandeler{ 
    constructor(game)
    {     
          this.game = game;
          this.EnemyArray = [];
          this.dx = 0;
          this.dy = 0;
          this.hasReset = false;

    } 
    
    getPlayerLocation(x,y){ 

      let distanceX = x - this.x;
      let distanceY = y - this.y; 
      let length = Math.sqrt(distanceX ** 2 + distanceY ** 2); // get the length of the vector between the player and the enemy
      console.log(length)
      distanceX /= length; // normalize the vector x and y
      distanceY /= length;
      
      this.dx = (distanceX * this.speed);  // calculate  how far to move the enemy based on its speed property
      this.dy = (distanceY * this.speed); 
      
      
    }
    getDistance(targetX, currentX, TargetY, currentY){  
        return  Math.hypot(targetX - currentX,  TargetY - currentY); // method used for projectile/player collision 

    }
    updateEnemy(){
     this.x += this.dx; // update enemy x and y values and move them along the vector calculated(towards the player )
     this.y += this.dy;
    
    }

    drawEnemies(ctx, pX, pY){ 
        
        this.EnemyArray.forEach((enemy)=>{ // loop through enemies and update and draw/move them based on player postion
            
            enemy.getPlayerLocation(pX, pY); // calcuate where enemies need to move before they are updated/drawn
            enemy.update();
            enemy.draw(ctx);
        })
    }
    collisionBetweenEnemies(enemyToCheck){  // define interactions with enemies  when they collide 
             this.EnemyArray.forEach((enemy, index)=>{ 

                let distance = this.getDistance(enemyToCheck.x, enemy.x, enemyToCheck.y, enemy.y ) // get distance between the current enemy being checked and other enemies in the array
                let radiSum = enemy.radius + enemyToCheck.radius; // check distance between enemies based on collsion radius 

                if(distance < radiSum && enemy != enemyToCheck  ){ 
                    if(enemyToCheck.type =="circle" && enemyToCheck.shouldMerge && enemy.shouldMerge){  // increase size of circle enemies when they collide
                     enemyToCheck.merge(enemy); 
                     } 
                    else if(enemyToCheck.type == "square" && enemy.type =="circle" ){  // if a circle and a square enemy collide
                     this.game.particleHandler.generateCircleParticles(enemy.x, enemy.y, enemy.colour, enemy.radius, 2, true);   // generate particles at the postion of the circle enemy 
                     this.EnemyArray.splice(index, 1); // remove circle enemy
                     }
                 }
             })
    }

    enemyToPlayerCollsion(player){ 

        this.EnemyArray.forEach((enemy, index)=>{
            let playersDistance = this.getDistance(player.x, enemy.x, player.y, enemy.y); // get the vector between the enemy and the player using the coordinates from the player object
            
            let hasEnemyCollided = player.playerCollsion(playersDistance,enemy.radius); // pass in the distance and enemy properties to the player collsion method from the passed in player class
          
            if(hasEnemyCollided){ 
                this.game.particleHandler.generateCircleParticles(enemy.x, enemy.y, enemy.colour, enemy.radius, 2, true);  // generate particles at the postion of the enemy using the properties of the enemy to detremine the particle properties 
                this.EnemyArray.splice(index, 1);  
            }
        })

    }

    enemyCollision(projectileArray){ 
      this.EnemyArray.forEach((enemy, index) => { 

          this.collisionBetweenEnemies(enemy);
          //detect projectile collsion
          projectileArray.forEach((projectile, Pindex) => { // nested foreach loop to loop through the array of bullets currenlty active in the scene 

            let bulletDistance = this.getDistance(projectile.x, enemy.x, projectile.y, enemy.y); // get the vector between the projectile and enemy
            let bulletCollsion = bulletDistance - enemy.radius - projectile.collisionRadius; // get the current distance from the bullet taking into account the enemies radius and the collsion radius of the bullet
 
            if( bulletCollsion < 1 ){  // check if collsion distance is smaller than 1
                this.game.scoreHandler.score += 50;  // increase score property of the scoreHandler object on collision
                this.game.scoreHandler.colour = enemy.colour;

                this.game.particleHandler.generateCircleParticles(projectile.x,projectile.y,enemy.colour,enemy.radius,2,true); // if the distance between the bullet is lees than or equal to 1 then call the generate particles method from the  ParticleHandler object 
               
                if((enemy.health - projectile.damage) <=0 || (enemy.radius - projectile.damage)<=8 ){  
                   this.EnemyArray.splice(index, 1); // remove enemy
                }  
                 else {
                    enemy.health -=  projectile.damage; 
                    enemy.radius = enemy.health; // shrink the enemy on hit 
                   }
                   projectileArray.splice(Pindex, 1); // remove projectile and enemy 
               }  
           })


      })
    } 
    generateRandomLocation(radius){ 
        // generate random position for the enemy out of the player view(using the collsion radius of the enemy to do so)
        let x;
        let y; 
        if(Math.random()<0.5){ // random chance for enemy to spawn at the sides of the canvas or at the bottom/top of canvas
            x = Math.random() < 0.5 ? 0 - radius : radius + this.game.width; // generate enemy to left or right with random y
            y = (Math.random() * this.game.height);
        } 
        else{ 
            x = (Math.random() * this.game.width);  
            y = Math.random() < 0.5 ? 0 - radius : radius + this.game.height; // generate enemy at the top or bottom of the canvas with random x
        }  
        
        return [x,y];
       
    }


    spawnCircleEnemy(){ 
        let colour = 'hsl(' + Math.random() * 360 + ', 100%, 50%'; 
        let radius = Math.random() * (40 - 10) + 10; // generates a range between 40 and 10 for the enemy radius 
        let position = this.generateRandomLocation(radius);
        
        this.EnemyArray.push( new CircleEnemyHandler(radius, position[0], position[1], colour)); // generate new enemy with random properties 
        
    }  

    spawnSquareEnemy(){ 
        
        let colour = 'hsl(' + Math.random() * 360 + ', 100%, 50%'; 
        let height = Math.random() * (50 - 40) + 40; // generates a range between 50 and 40 for the enemy collision radius 
        let width = Math.random() * (50 - 40) + 40;
        let position = this.generateRandomLocation(height);
        
        this.EnemyArray.push( new SquareEnemyHandler(position[0], position[1], width,height, colour, this.game)); // generate new enemy with random properties 
    }

    spawnEnemies(frames){  // spawn enemies with the randomly generated properties after a certain amount of frames/update calls has passed 
        if(frames % 70 === 0){ 
           this.spawnCircleEnemy();
        } 
        if(frames % 200 === 0 ){ 
            this.spawnSquareEnemy();
        }
    }
   
    resetEnemies(){ 
        if(!this.hasReset){ 
            this.EnemyArray = []; 
            this.hasReset = true;
        }
    }
} 

class CircleEnemyHandler extends EnemiesHandeler{ 
    constructor(radius, x, y, colour){ 
      super();  
      this.x = x;
      this.y = y; 
      
      this.type = "circle";
      this.radius =  radius;
      this.health = radius; 

      this.colour = colour;
      this.speed = radius<15 ? 2:1; 
      this.mergeCount = 0;
      this.shouldMerge = true;

    }
    
    draw(ctx){ 
        ctx.beginPath(); 
        ctx.fillStyle = this.colour; 
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI); 
        ctx.fill();
       
      
    } 
    merge(EnemyToMerge){ 
        if(this.mergeCount!=2 ){ // increase circle enemy size on contact with another enemy also limting the number of times an enemy can merge
            EnemyToMerge.shouldMerge = false;
            this.radius += EnemyToMerge.radius / 4;
            this.health = this.radius;
            this.mergeCount ++;
          
        }
         
    }
    update(){ 
        super.updateEnemy(); // move enemy
    }

} 

class SquareEnemyHandler extends CircleEnemyHandler{ 
    constructor(x, y, width, height, colour, game){ 
       super();
       this.game = game;
       this.width = width;
       this.height = height;
       this.x = x; 
       this.y = y;
       this.type = "square";

       this.radius = this.height ;  
       this.health = this.radius ; 
       this.damage = this.radius / 2;

       this.speed = 3;
       this.colour = colour;

       this.shouldMerge = false;
       this.shouldShrink = false;

       this.angle = 0;
       this.rotationSpeed = 0.15;
       this.boostTimer = 100;
       this.boostLength = 400;
       
       
    } 
  
    update(){ 
      if(this.boostTimer <= 0){ 
          super.update(); // move enemy by calling update method of the circle enemy class
          this.boostLength--; 
          if(this.boostLength <=0){  // defines how long the square enemy can move for before stopping 
              this.boostTimer = 100; // reset timers
              this.boostLength = 400;
              
          }
          
          this.angle += this.rotationSpeed; // increase rotation angle to rotate sqaure neemy around its centre  
      }  
      else{ 
         let differnceX = this.game.player.x - this.x; 
         let differnceY = this.game.player.y - this.y; // rotate square enemy to face the player while stationary
         this.angle = Math.atan2(differnceX, -(differnceY));
      }
    
      this.boostTimer--; 
     
    } 
  
 
   draw(ctx){ 
    
      ctx.save();
      ctx.beginPath();
     
      ctx.fillStyle = this.colour;
      ctx.strokeStyle = this.colour;
      ctx.translate(this.x, this.y); 
    
      ctx.rotate(this.angle);

      ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height); 
      ctx.fill();
      ctx.restore();
     

   }
   
  
    
}










