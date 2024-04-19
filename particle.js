


export class ParticleHandler { 
      
    constructor(ctx){ 
        this.ctx = ctx;
        this.particleArray = [];
        this.hasGeneratedPartcile =false;
        this.hasReset = false;

    }
    
     handlePartcile(){ 
         this.particleArray.forEach((particle,index)=>{ 
            
            if(particle.alpha <= 0){ 
                this.particleArray.splice(index,1); // remove particle once it is no longer visisble 
             }
             else{
                particle.update(this.ctx); 
             }
         })
    }

    //generate particles based on the value passed in i.e location size and colour
    generateCircleParticles(x,y,colour,radius,sizeRange,hasAlpha){ 
        for(let i = 0; i < radius/2; i++) 
        this.particleArray.push(new circleParticle(x,y,colour,hasAlpha,sizeRange));
            
      }

    generateSquareParticles(x,y,colour,width,height,number){ 
        for(let i = 0; i < number ; i++)  
        this.particleArray.push(new SquarePartcile(width,height,colour,x,y));
            
      }
    
    generateConstellationEffect(){ 
       
        this.particleArray.forEach((particle,index)=>{ 
            if(particle.hasConstellation){ 
                for(let j = index; j < this.particleArray.length; j++){ 
     
                    let distanceX = particle.x - this.particleArray[j].x;
                    let distanceY = particle.y - this.particleArray[j].y; 
                    let length = Math.sqrt(distanceX ** 2 + distanceY ** 2);
     
                    if(length<50 && particle.colour == this.particleArray[j].colour && this.particleArray[j].alpha> 0){  
                       // draw a line between all particles based on the distance and their current alpha level  
                       this.ctx.save(); 
                       this.ctx.beginPath(); 

                       this.ctx.globalAlpha = this.particleArray[j].alpha; // adjust global alpha to that of the particle allowing for fade effect to only be applied to the lines drawn 
                       this.ctx.strokeStyle = particle.colour;
                       this.ctx.lineWidth = this.particleArray[j].alpha;

                       this.ctx.moveTo(particle.x,particle.y); // line from particle being checked 
                       this.ctx.lineTo(this.particleArray[j].x,this.particleArray[j].y); // line to other particles within the length specified
                       this.ctx.stroke();
                       this.ctx.restore();
                    }
                } 
            }
        })
      }
    gameOverParticles(x,y,colour){ 
             if(!this.hasGeneratedPartcile){  // generate particles on the game over screen based on a set timer 

                this.generateCircleParticles(x,y,colour,10,8,true); 
                this.hasGeneratedPartcile = true; 
                setTimeout(()=>{ 
                    this.hasGeneratedPartcile = false;
                },800)
                return true; // return true once particles have been generated 
             } 
          } 
      
   
        
    resetParticles(){ 
            if(!this.hasReset){ 
                this.particleArray = [];
                this.hasReset = true;
            }
        }
    }
     



class circleParticle{ 
    constructor(x,y,colour,hasAlpha,sizeRange){ 
        
        this.x = x; 
        this.y = y; 
        this.hasConstellation = true;
        this.hasAlpha = hasAlpha;
        this.speedX = (Math.random() - 0.5) * 5;
        this.speedY = (Math.random() - 0.5) * 5;
        this.radius = Math.random() * sizeRange; 
        this.colour = colour;
        this.alpha = 1;
        

    }
    drawP(ctx) {
        ctx.save();
        ctx.beginPath(); 
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.colour;
        ctx.arc(this.x,this.y, this.radius, 0, 2 * Math.PI); 
        ctx.fill();
        ctx.restore();
    } 
       
    update(ctx){  // move and draw particles 
        
        this.drawP(ctx);

        this.x += this.speedX; // move particles at a random speed
        this.y += this.speedY;

        if(this.hasAlpha){  // make particles fade 
            this.alpha -= 0.01;
        }
       
    
      } 
}

class SquarePartcile extends circleParticle{ 

    constructor(width,height,colour,x,y){ 
        super(); 
        this.x = x;
        this.y = y;
        this.hasConstellation = false;
        this.width = width; 
        this.height = height; 
        this.colour = colour;
        this.hasAlpha=true;
        
    } 

    drawP(ctx){ 
        ctx.save();
        ctx.beginPath(); 
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.colour;
        ctx.fillRect(this.x,this.y,this.width,this.height); // generate square particle 
        ctx.restore();
    }
}


