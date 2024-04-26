//Parent Sprit Classa
class Sprite {
    constructor(sprite_json, x, y, start_state){
        this.sprite_json = sprite_json;
        this.x = x;
        this.y = y;
        this.state = start_state;
        this.root_e = "TenderBud";

        this.cur_frame = 0;

        this.cur_bk_data = null;

        this.idle_state = ["idle","idleBackAndForth","idleBreathing","idleFall","idleLayDown","idleLookAround",
                            "idleLookDown","idleLookLeft","idleLookRight","idleLookUp","idleSit","idleSpin","idleWave"];

        this.velocity = new Vector(10,10);
        this.x_v = 10;
        this.y_v = 10;
    }

    align(sprites){
        let perceptionRadius = 50;
        let avg_x_v = 0;
        let avg_y_v = 0;
        let counted_sprites = 0;
        for(let sprite of sprites){

            let x_dist = Math.pow((sprite.x - this.x), 2);
            let y_dist = Math.pow((sprite.y - this.y), 2);
            let dist = Math.sqrt(x_dist + y_dist);


            if(sprite != this && dist < perceptionRadius){
                avg_x_v += sprite.x_v;
                avg_y_v += sprite.y_v;
                counted_sprites++;
            }
        }
        if(total>0){
            avg_x_v /= counted_sprites;
            avg_y_v /= counted_sprites;
        }

    }

    draw(status){
        var previous_state = this.state;
        this.change_state();

        if(previous_state != this.state){
            this.cur_frame = 0;
        }

        var ctx = canvas.getContext('2d');
        //console.log(this.sprite_json[this.root_e][this.state][this.cur_frame]['w']);

        
        if(this.sprite_json[this.root_e][this.state][this.cur_frame]['img'] == null){
            console.log("loading");
            this.sprite_json[this.root_e][this.state][this.cur_frame]['img'] = new Image();
            this.sprite_json[this.root_e][this.state][this.cur_frame]['img'].src = 'Penguins/' + this.root_e + '/' + this.state + '/' + this.cur_frame + '.png';
        }

        ctx.drawImage(this.sprite_json[this.root_e][this.state][this.cur_frame]['img'], this.x, this.y );

        this.cur_frame = this.cur_frame + 1;
        if(this.cur_frame >= this.sprite_json[this.root_e][this.state].length){
            this.cur_frame = 0;
        }

        if(this.x >= (window.innerWidth -50 - this.sprite_json[this.root_e][this.state][this.cur_frame]['w']) ){
            this.bound_hit('E');
        }else if(this.x <= 0){
            this.bound_hit('W');
        }else if(this.y >= (window.innerHeight -50 - this.sprite_json[this.root_e][this.state][this.cur_frame]['h']) ){
            this.bound_hit('S');
        }else if(this.y <= 0){
            this.bound_hit('N');
        }else{
            this.x = this.x + this.velocity.x;
            // this.x = this.x + this.x_v;
            this.y = this.y + this.y_v;
        }

        // console.log("X velocity: " + this.x_v);
        // console.log("Y velocity: " + this.y_v);

        
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
        if(this.x_v > 0 && this.y_v == 0){
            this.state = "walk_E"
        }
        else if(this.x_v < 0 && this.y_v == 0){
            this.state = "walk_W"
        }
        else if(this.x_v == 0 && this.y_v > 0){
            this.state = "walk_S"
        }
        else if(this.x_v == 0 && this.y_v < 0){
            this.state = "walk_N"
        }
        else if(this.x_v > 0 && this.y_v > 0){
            this.state = "walk_SE"
        }
        else if(this.x_v > 0 && this.y_v < 0){
            this.state = "walk_NE"
        }
        else if(this.x_v < 0 && this.y_v > 0){
            this.state = "walk_SW"
        }
        else if(this.x_v < 0 && this.y_v < 0){
            this.state = "walk_NW"
        }
        else if(this.x_v == 0 && this.y_v == 0){
            if(!(this.idle_state.includes(this.state))){
                this.set_idle_state();
            }
        }
    }

    set_idle_state(){
        this.x_v = 0;
        this.y_v = 0;

        const random = Math.floor(Math.random() * this.idle_state.length);
        console.log(this.idle_state[random]);
        this.state = this.idle_state[random];
    }

    bound_hit(side){
        if(side == 'N'){
            this.y += 1;
            this.y_v = 10;
        }
        else if(side == 'S'){
            this.y -= 1;
            this.y_v = -10;
        }
        else if(side == 'W'){
            this.x += 1;
            this.velocity = new Vector(10, this.velocity.y);
        }
        else if(side == 'E'){
            this.x -= 1;
            this.velocity = new Vector(-10, this.velocity.y);
            console.log("Velocity x:", this.velocity.x);
        }
        // if(!(this.idle_state.includes(this.state))){
        //     this.set_idle_state();
        // }
   } 


}