

export class GameOverScreen{ 
    constructor(game){ 
        this.game = game;
        this.textWidth = 100;
        this.x = this.game.width / 2  - this.textWidth / 2; // centre all of the game over text
        this.y = this.game.height / 2;
        this.colour = "red";
        
    }


    update(ctx){   // drawing score and updating it with particle effects 
        this.draw(ctx);
       
    }

    draw(ctx) { // draw text for game over screen 
        ctx.save();
        ctx.beginPath() ;
        ctx.font = "100px impact ";
        ctx.strokeStyle = this.colour;
        ctx.textAlign = "center";
        ctx.strokeText("GAME OVER", this.x, this.y);

        ctx.beginPath();
        ctx.font = "50px impact";
        ctx.strokeStyle = this.colour;
        ctx.strokeText("Your Score: " + this.game.scoreHandler.score, this.x, this.y+50); 

        ctx.beginPath();
        ctx.font = "20px impact";
        ctx.fillStyle = "white";
        ctx.fillText("Press Enter To Continue ", this.x, this.y+80);
        ctx.restore();

    }
    
    getParticles(){ 

        let x = Math.random() * ((this.x+100) - (this.x-100)) + (this.x - 100); // make particles appear in front of the game over text at a random location in range of the front of the text
        let y = Math.random() * ((this.y+100) - (this.y-100)) + (this.y - 100); 

        let colour = 'hsl(' + Math.random() * 360 + ', 100%, 50%'; 
        let changeTextColour = this.game.particleHandler.gameOverParticles(x,y,colour); // if particles are generated change the colour of the text based on the particle colour
       
        if(changeTextColour){ 
           this.colour = colour; 
         
        }
       
    }
   
    
   
}

export class ScoreHandler{ // keep track of player score 
     constructor(game){ 
        this.game = game;
        this.score = 0;
        this.colour = "white";
        this.textWidth=30;
        this.textHeight = 30;
     } 

     draw(ctx){ 
        ctx.beginPath(); 
        ctx.fillStyle = this.colour;
        ctx.font ="30px impact"; 
        ctx.fillText("Score: " + this.score, 0 + this.textWidth, 0 + this.textHeight);
    
       
     }
    
}


