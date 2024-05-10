const flock = [];

let imagesMap = new Map();

let background;

function preload(){
    $.ajax({ async: false, url:"Penguins/animationData.json", success: function( data ) {
        for (let state in data["TenderBud"]){
            for (let frame in data["TenderBud"][state]){
                let image = "Penguins/TenderBud/" + state + "/" + frame + ".png"
                imagesMap.set(image, loadImage(image))
            }
        }
    }});

    background = loadImage("imgs/bk.jpg");

}

function setup() {
    createCanvas(window.innerWidth-50, window.innerHeight-50);

    
  $.getJSON( "Penguins/animationData.json", function( data ) {

    flock.push( new Sprite(data, 200 ,300, "idle", imagesMap) );
    flock.push( new Sprite(data, 800 ,300, "idleSpin", imagesMap) )
    flock.push( new Sprite(data, 500 ,300, "idleWave", imagesMap) )
    flock.push( new Sprite(data, 400 ,300, "idleWave", imagesMap) )
    flock.push( new Sprite(data, 100 ,300, "idleWave", imagesMap) )
    flock.push( new Sprite(data, 300 ,300, "idleWave", imagesMap) )
    flock.push( new Sprite(data, 600 ,300, "idleWave", imagesMap) )
    flock.push( new Sprite(data, 700 ,300, "idleWave", imagesMap) )
    flock.push( new Sprite(data, 900 ,300, "idleWave", imagesMap) )
    flock.push( new Sprite(data, 100 ,100, "idleWave", imagesMap) )
    flock.push( new Sprite(data, 500 ,100, "idleWave", imagesMap) )
})
 
}

function draw() {
    image(background, 0, 0);
    for (let boid of flock) {
        boid.flock(flock);
        boid.draw(flock);
    }
}