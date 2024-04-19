import {InputHandle} from "./inputRefactor.js"
import {Player,HealthBar} from "./Player.js"
import {BulletHandler} from "./BulletControl.js"
import { EnemiesHandeler} from "./EnemiesRefactor.js"
import { ParticleHandler } from "./particle.js"
import {GameOverScreen, ScoreHandler} from "./UpdateGameState.js"

const canvas= document.getElementById("square-canvas"); 
const ctx=canvas.getContext("2d"); 
canvas.width= window.innerWidth; 
canvas.height= window.innerHeight;
const shootSound = new Audio() 
shootSound.src ="shootSound.wav"
shootSound.volume = 0.6
class game{ // main class where everything is updated and drawn 
    constructor(ctx,width,height){ 
    
      this.ctx = ctx;
      //used to control animation frame rate  and updates
      this.width = width; 
      this.height = height;
      this.rafid = null;
      this.accumulatedTime = 0; 
      this.lastFrame = 0;
      this.timeStep = 1000 / 60;
      this.isRunning = true;
      this.frames = 0;

      //instantiate all handler classes for the game 
      this.input = new InputHandle(canvas);
      this.player = new Player(this);

      this.bulletHandles = new BulletHandler(this); 
      this.particleHandler = new ParticleHandler(this.ctx);
      
      this.HealthBar = new HealthBar(this);
      this.scoreHandler = new ScoreHandler(this);
      this.gameOverScreen = new GameOverScreen(this);
      
      this.enemiesHandeler = new EnemiesHandeler(this);

      
      //event listener for shooting
      canvas.addEventListener("mousedown",()=>{ 
        if(this.bulletHandles.canFire){ 
           // shoot towards mouse position
           this.bulletHandles.shoot(this.player.x, this.player.y, this.input.mouse.x, this.input.mouse.y,false); 
           shootSound.play()
           this.bulletHandles.canFire = false;
        }
        else{ 
            // limit fire rate to avoid spam clicking 
            setTimeout(()=>{
                 this.bulletHandles.canFire = true;
            },4)
        }
        
        
      }) 
       
    }
    
    update(){ 
        if(this.player.health<=0){ 
           
            ctx.clearRect(0,0,this.width,this.height);

            this.resetHandlers();
            this.isRunning = false;
            //update and draw gameOver screen
            this.gameOverScreen.update(this.ctx);
            this.gameOverScreen.getParticles(this.particleHandler);
            // particle effects for over screen
            this.particleHandler.generateConstellationEffect();
            this.particleHandler.handlePartcile();
        } 
        else{

            this.ctx.clearRect(0,0,this.width,this.height);
            // updating player and health bar
            this.player.update(this.input.key);
            this.HealthBar.update(this.player.health);
            //updating and drawing enemies 
          
            this.enemiesHandeler.drawEnemies(this.ctx, this.player.x, this.player.y);
            this.enemiesHandeler.enemyCollision(this.bulletHandles.bullets); 
          
            this.enemiesHandeler.enemyToPlayerCollsion(this.player, this.particleHandler) 
            this.enemiesHandeler.spawnEnemies(this.frames) // spawn enemies after a certain number of updates are called 
            //handling bullets 
            this.bulletHandles.handle_bullet(this.ctx);  
           // handling and drawing particles 
            this.particleHandler.generateConstellationEffect() 
            this.particleHandler.handlePartcile();
           
            this.frames++;

        }
      
      
      
        
    }
    
    reset(){ 
        this.player.resetPos();

        this.scoreHandler.score = 0;
        this.scoreHandler.colour ="white";

        this.enemiesHandeler.hasReset = false; 
        this.particleHandler.hasReset = false;

        this.player.health = 200;
        this.isRunning = true;
    } 
    resetHandlers(){ 
        this.particleHandler.resetParticles();
        this.enemiesHandeler.resetEnemies(); 
        this.bulletHandles.resetBullets();
    }

    draw(){  
     if(this.isRunning){ 

        this.player.draw(this.input.mouse.x, this.input.mouse.y,this.ctx);
        this.HealthBar.drawHealthBar(this.ctx);
        this.scoreHandler.draw(this.ctx);

     }
    
     
    }
    

    gameLoop = (timeStamp) => { 

        // this gameloop will run at a constant fixed step rate(around 1 second or 60fps(1000/60)) this ensures that all animations are running and being updated at the same time(roughly)
    
       
       let deltaTime = timeStamp - this.lastFrame; 
       this.lastFrame = timeStamp;
    
       this.accumulatedTime += deltaTime; // get all of the time since the last frame 
       
       while(this.accumulatedTime >= this.timeStep){  // while the accumlated  time is greater than the fixed step set by this.timeStep allowing for dictation on when to next frame
          
           this.update(); // call update method from game class
           
           this.accumulatedTime -= this.timeStep; // decrement accumulated time by the fixed step to reset for the next update() call 
       }
       this.draw();
       this.rafid  = requestAnimationFrame(this.gameLoop); // ensures that there is an animation loop that can be called via this method 
        
   }

   

}

let newGame= new game(ctx, canvas.width, canvas.height,); 
window.addEventListener("keydown",event=>{ 
    if(newGame.isRunning == false){ 
        if(event.key =="Enter"){ 

            newGame.reset();
        }
         
    }
})
requestAnimationFrame(newGame.gameLoop);
 

    
 

 


