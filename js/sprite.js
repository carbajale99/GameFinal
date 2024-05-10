//Parent Sprit Classa
class Sprite {
    constructor(sprite_json, x, y, start_state, map){
        this.sprite_json = sprite_json;

        this.state = start_state;
        this.root_e = "TenderBud";
        
        this.cur_frame = 0;
        
        this.cur_bk_data = null;
        
        this.idle_state = ["idle","idleBackAndForth","idleBreathing","idleFall","idleLayDown","idleLookAround",
        "idleLookDown","idleLookLeft","idleLookRight","idleLookUp","idleSit","idleSpin","idleWave"];
        
        this.position = createVector(x,y);

        this.velocity = p5.Vector.random2D();

        this.velocity.setMag(random(2, 4));

        this.acceleration = createVector();
        this.maxForce = .5;
        this.maxSpeed = 4;

        this.imagesMap = map;
    }
    //hihi
    align(sprites){
        let perceptionRadius = 100;
        let alignment = createVector();

        let counted_sprites = 0;

        for(let sprite of sprites){

            var distance = dist(this.position.x, this.position.y, sprite.position.x, sprite.position.y);

            if(sprite != this && distance < perceptionRadius){
                alignment.add(sprite.velocity);
                counted_sprites++;
            }
        }
        if(counted_sprites>0){
            alignment.div(counted_sprites);
            alignment.setMag(this.maxSpeed);
            alignment.sub(this.velocity);
            alignment.limit(this.maxForce);
        }
        alignment.div(5);
        return alignment;
    }

    cohesion(sprites){
         
        let cohesion = createVector();
        let perceptionRadius = 100;
        
        
        let counted_sprites = 0;
        
        for(let sprite of sprites){
            
            var distance = dist(this.position.x, this.position.y, sprite.position.x, sprite.position.y);
            
            if(sprite != this && distance < perceptionRadius){

                cohesion.add(sprite.position);
                counted_sprites++;
            }
        }
        if(counted_sprites>0){
            cohesion.div(counted_sprites);
            cohesion.sub(this.position);
            cohesion.setMag(this.maxSpeed);
            cohesion.sub(this.velocity); 
            cohesion.limit(this.maxForce);
        }
        cohesion.div(10);
        return cohesion;
    }
    
    seperate(sprites){
        
        let seperation = createVector();
        let perceptionRadius = 100;
        
        
        let counted_sprites = 0;
        
        for(let sprite of sprites){
            
            var distance = dist(this.position.x, this.position.y, sprite.position.x, sprite.position.y);
            
            if(sprite != this && dist < perceptionRadius){
                
                let difference = p5.Vector.sub(this.position, sprite.position);
                
                difference.div(dist*dist);
                
                seperation.add(difference);
                counted_sprites++;
            }
        }
        if(counted_sprites>0){
            seperation.div(counted_sprites);
            seperation.setMag(this.maxSpeed);
            seperation.sub(this.velocity);
            seperation.limit(this.maxForce);
 
        }
      
        seperation.mult(10);
        return seperation;
    }
    
    flock(sprites){
        let alignment = this.align(sprites);
        let cohesion = this.cohesion(sprites);
        let seperation = this.seperate(sprites);
        
        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(seperation);
        
      
    }

    
    draw(status){
        var previous_state = this.state;
        this.change_state();
        
        
        if(previous_state != this.state){
            this.cur_frame = 0;
        }
                       
     
        this.cur_frame = this.cur_frame + 1;
        if(this.cur_frame >= this.sprite_json[this.root_e][this.state].length){
            this.cur_frame = 0;
        }
        
        if(this.position.x >= (window.innerWidth -50)){
            this.bound_hit('E');
        }else if(this.position.x <= 0){
            this.bound_hit('W');
        }else if(this.position.y >= (window.innerHeight -50) ){
            this.bound_hit('S');
        }else if(this.position.y <= 0){
            this.bound_hit('N');
        }else{
            
            this.position.add(this.velocity);
            this.velocity.add(this.acceleration);
            this.velocity.limit(this.maxSpeed);
            this.acceleration.mult(0);
                      
            var imgPath = 'Penguins/' + this.root_e + '/' + this.state + '/' + this.cur_frame + '.png';
            image(this.imagesMap.get(imgPath), this.position.x, this.position.y);
        
            
        }
        
        
    }


    change_state(){
        if(this.velocity.x > 0 && this.velocity.y == 0){
            this.state = "walk_E"
        }
        else if(this.velocity.x < 0 && this.velocity.y == 0){
            this.state = "walk_W"
        }
        else if(this.velocity.x == 0 && this.velocity.y > 0){
            this.state = "walk_S"
        }
        else if(this.velocity.x == 0 && this.velocity.y < 0){
            this.state = "walk_N"
        }
        else if(this.velocity.x > 0 && this.velocity.y > 0){
            this.state = "walk_SE"
        }
        else if(this.velocity.x > 0 && this.velocity.y < 0){
            this.state = "walk_NE"
        }
        else if(this.velocity.x < 0 && this.velocity.y > 0){
            this.state = "walk_SW"
        }
        else if(this.velocity.x < 0 && this.velocity.y < 0){
            this.state = "walk_NW"
        }
        else if(this.velocity.x == 0 && this.velocity.y == 0){
            if(!(this.idle_state.includes(this.state))){
                this.set_idle_state();
            }
        }
    }

    set_idle_state(){

        this.velocity = createVector();

        const random = Math.floor(Math.random() * this.idle_state.length);
        console.log(this.idle_state[random]);
        this.state = this.idle_state[random];
    }

    bound_hit(side){
        if(side == 'N'){
            this.position.y = (window.innerHeight -60 - this.sprite_json[this.root_e][this.state][this.cur_frame]['h']);     
        }
        else if(side == 'S'){
            this.position.y = 10;
        }
        else if(side == 'W'){
            this.position.x = (window.innerWidth -60 - this.sprite_json[this.root_e][this.state][this.cur_frame]['h']);
 
        }
        else if(side == 'E'){
            this.position.x = 10;

        }

   } 


}