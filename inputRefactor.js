
export class InputHandle{ 
    constructor(canvas){ 
        
      // store state of keys 
      this.key = { 
        w : undefined, 
        a : undefined,
        s : undefined,
        d : undefined,
      }
      //store state of mouse coordinates 
      this.mouse = { 
       x:undefined, 
       y:undefined,

   
      }
      //update state of keys based on key pressed
      window.addEventListener("keydown",event => { 
        this.key[event.key] = true;

   }) 
   
   window.addEventListener("keyup",event => {
       this.key[event.key] = undefined;

   })
   // if the user exits the tab stop the player from moving 
   window.addEventListener("blur",()=>{ 
    
      Object.keys(this.key).forEach((item)=>{
         this.key[item] = false
      })
   })
         
    
   
      canvas.addEventListener("click",event => { 
       this.mouse.x = event.x; 
       this.mouse.y = event.y;
       

   })

   
   canvas.addEventListener("mousemove",event => { 
       this.mouse.x = event.x; 
       this.mouse.y = event.y;
   })
}
    

}