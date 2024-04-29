//Parent Sprit Classa
class Sprite {
    constructor(sprite_json, x, y, start_state){
        this.sprite_json = sprite_json;

        this.position = new Vector(x,y);
        this.state = start_state;
        this.root_e = "TenderBud";

        this.cur_frame = 0;

        this.cur_bk_data = null;

        this.idle_state = ["idle","idleBackAndForth","idleBreathing","idleFall","idleLayDown","idleLookAround",
                            "idleLookDown","idleLookLeft","idleLookRight","idleLookUp","idleSit","idleSpin","idleWave"];

        this.velocity = new Vector(Math.floor(Math.random() * 10) + 1, Math.floor(Math.random() * 10) + 1);
        this.acceleration = new Vector(0,0);
    }

    align(sprites){
        let alignment = new Vector(0,0);
        let perceptionRadius = 150;


        let counted_sprites = 0;
        for(let sprite of sprites){

            var dist = Vector.len(Vector.sub(sprite.position, this.position));

            if(sprite != this && dist < perceptionRadius){
                alignment.add(sprite.velocity);
                counted_sprites++;
            }
        }
        if(counted_sprites>0){
            alignment.div(counted_sprites);
            alignment.sub(this.velocity);
        }
        return alignment;
    }

    flock(sprites){
        let alignment = this.align(sprites);
        this.acceleration.add(alignment);
    }

    draw(status){
        var previous_state = this.state;
        this.flock(status['sprites']);
        this.change_state();

        if(previous_state != this.state){
            this.cur_frame = 0;
        }

        var ctx = canvas.getContext('2d');

        
        if(this.sprite_json[this.root_e][this.state][this.cur_frame]['img'] == null){
            console.log("loading");
            this.sprite_json[this.root_e][this.state][this.cur_frame]['img'] = new Image();
            this.sprite_json[this.root_e][this.state][this.cur_frame]['img'].src = 'Penguins/' + this.root_e + '/' + this.state + '/' + this.cur_frame + '.png';
        }

        ctx.drawImage(this.sprite_json[this.root_e][this.state][this.cur_frame]['img'], this.position.x, this.position.y );

        this.cur_frame = this.cur_frame + 1;
        if(this.cur_frame >= this.sprite_json[this.root_e][this.state].length){
            this.cur_frame = 0;
        }

        if(this.position.x >= (window.innerWidth -50 - this.sprite_json[this.root_e][this.state][this.cur_frame]['w']) ){
            this.bound_hit('E');
        }else if(this.position.x <= 0){
            this.bound_hit('W');
        }else if(this.position.y >= (window.innerHeight -50 - this.sprite_json[this.root_e][this.state][this.cur_frame]['h']) ){
            this.bound_hit('S');
        }else if(this.position.y <= 0){
            this.bound_hit('N');
        }else{
            this.position.add(this.velocity);
            let next_x = this.velocity.x + this.acceleration.x;
            let next_y = this.velocity.y + this.acceleration.y;
            let max_v = 10;
            if(next_x < max_v && next_y < max_v && next_x > -max_v && next_y > -max_v){
                console.log("max reached");
                this.velocity.add(this.acceleration);
            }
        
        }

        console.log("X velocity: " + this.velocity.x);
        console.log("Y velocity: " + this.velocity.y);

        
    }

    take_direction(key_press){
        const up_arrow = 38;
        const down_arrow = 40;
        const left_arrow = 37;
        const right_arrow = 39;

        if(key_press == up_arrow){
            this.x_v = 0;
            this.y_v = -10;
        }
        else if (key_press == down_arrow){
            this.x_v = 0;
            this.y_v = 10;
        }
        else if (key_press == right_arrow){
            this.x_v = 10;
            this.y_v = 0;
        }
        else if (key_press == left_arrow){
            this.x_v = -10;
            this.y_v = 0;
        }
        else{
            this.x_v = 0;
            this.y_v = 0;
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

        this.velocity = new Vector(0,0);

        const random = Math.floor(Math.random() * this.idle_state.length);
        console.log(this.idle_state[random]);
        this.state = this.idle_state[random];
    }

    bound_hit(side){
        if(side == 'N'){

            this.position = new Vector(this.position.x, (window.innerHeight -50 - this.sprite_json[this.root_e][this.state][this.cur_frame]['h'])) 
            // this.position.add(new Vector(0,10));
            // this.velocity = new Vector(this.velocity.x, -this.velocity.y);
        }
        else if(side == 'S'){
            this.position = new Vector(this.position.x, 1) 
            // this.position.sub(new Vector(0,10));
            // this.velocity = new Vector(this.velocity.x, -this.velocity.y);
        }
        else if(side == 'W'){
            this.position = new Vector((window.innerWidth -50 - this.sprite_json[this.root_e][this.state][this.cur_frame]['w']), this.position.y); 
            // this.position.add(new Vector(10,0));
            // this.velocity = new Vector(-this.velocity.x, this.velocity.y);
        }
        else if(side == 'E'){
            this.position = new Vector(1, this.position.y); 
            // this.position.sub(new Vector(10,0));
            // this.velocity = new Vector(-this.velocity.x, this.velocity.y);
        }

   } 


}