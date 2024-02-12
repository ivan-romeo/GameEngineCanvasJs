import Vector2 from "./utils/Classes/Vector2.ts";
import ArrowHelper from "./utils/helpers/Classes/ArrowHelper.ts";
import {Player} from "./classes/player.ts";
import ArcDegree from "./utils/helpers/Classes/ArcDegree.ts";

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<style>
    body{
        margin: 0;
        background: black;
        overflow: hidden;
    }
</style>
<canvas></canvas>
`

const canvas:HTMLCanvasElement = document.querySelector('canvas')!;

const c = canvas.getContext('2d')!;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let originPoint:Vector2 = new Vector2(canvas.width / 2,canvas.height / 2);

let mousePos = new Vector2(0,0);

window.addEventListener('resize', (event) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    originPoint = new Vector2(canvas.width / 2,canvas.height / 2);
});

const keys = {
    d:{
        pressed:false,
    },
    a:{
        pressed:false,
    },
    w:{
        pressed:false,
    },
    s:{
        pressed:false,
    },
    f:{
        pressed:false,
    },
    e:{
        pressed:false,
    },
    r:{
        pressed:false,
    },
}

const vector = new Vector2(50,50);
let framesCount = 0;
const player = new Player({
   position: vector,
});
const vector2 = new Vector2(-100,-50);
const vector3 = new Vector2(-10,-100);

const allBullets:Bullet[] = [];
let firing = false;
function animate() {
    window.requestAnimationFrame(animate);
    framesCount++;
    c.fillStyle = 'white';
    c.fillRect(0,0,canvas.width,canvas.height);
    c.save();

    drawQuadranti();

    // createVector(vector.clone().negate(),'-v1');

    const directionPlayer = mousePos.clone().sub(player.position).normalize();
    if(player.position.clone().sub(mousePos).length() >= 5){
        player.setDirection(directionPlayer);
    }
    player.update();

    new ArrowHelper({
        direction:player.direction,
        length:20,
        c,
        originPoint: originPoint.clone().add(player.position),
        text:'PlayerPos',
        color:'black',
    }).draw();
    new ArrowHelper({
        direction:vector3.clone().normalize(),
        length:vector3.length(),
        c,
        originPoint: originPoint,
        text:'cosa',
        color:'black',
    }).draw();



    new ArrowHelper({
        direction:vector2.clone().normalize(),
        length:vector2.length(),
        c,
        originPoint,
        text:'EnemyPos',
        color:'red',
    }).draw();
    new ArcDegree({
        position:originPoint,
        c,
        vector1:vector2,
        vector2:vector3,

    }).draw();

    // const vectorDistance = vector.clone().sub(vector2);
    // // Vettore distanza
    // new ArrowHelper({
    //     direction:vectorDistance.clone().normalize(),
    //     length:vectorDistance.length(),
    //     c,
    //     originPoint:vector2.clone().add(originPoint),
    //     text:'distanza',
    //     color:'green',
    // }).draw();
// console.log(vectorDistance.length())
    if (firing)
        fireGun();
    allBullets.forEach(item => {
        item.draw();
        item.updatePosition();
    });
    if (allBullets.length > 100)
        allBullets.splice(0,50);
    if(framesCount % 3 == 0){
        // console.log(mousePos);
        // createVector(mousePos.clone().normal(),'m')
    }

    if (keys.d.pressed) {
        player.acceleration.x = 0.5
    }else if (keys.a.pressed) {
        player.acceleration.x = -0.5;
    }else{

        player.acceleration.x = 0;
    }


    if (keys.w.pressed) {
        player.acceleration.y = -0.5;
    }
    else if (keys.s.pressed) {
        player.acceleration.y = 0.5;
    }else{

        player.acceleration.y = 0;
    }
    c.restore();
}

animate();
window.addEventListener('mousemove', (event) => {
    if(event.clientY < originPoint.y){
        //Versante y positivo
        mousePos.y = -(originPoint.y - event.clientY);
    }else{
        //Versante y negativo
        mousePos.y = ((event.clientY - originPoint.y));
    }
    if(event.clientX > originPoint.x){
        //positivo
        mousePos.x = (event.clientX - originPoint.x);
    }else{
        //negativo
        mousePos.x = ((event.clientX - originPoint.x));
    }

});


class Bullet {
    direction:Vector2;
    fromEntity:Player;
    position:Vector2;
    velocity:number;
    audio = new Audio('laserShoot.wav');

    constructor(args:{direction:Vector2,fromEntity:Player}) {
        this.direction = args.direction.clone();
        this.fromEntity = args.fromEntity;
        this.position = args.fromEntity.position.clone().add(originPoint.clone());
        this.velocity = 14;
    }
    draw(){
        c.beginPath();
        c.fillStyle = "#b20808";
        c.shadowColor = "#b20808";
        c.shadowBlur = 15;
        c.closePath();
        c.fillRect(this.position.x, this.position.y, 2, 8);
    }
    updatePosition(){
        this.position = this.position.add(this.direction.clone().multiplyScalar(this.velocity));
    }
}

function fireGun() {
    const newBullet = new Bullet({
        fromEntity:player,
        direction:mousePos.clone().sub(player.position).normalize()
    });
    newBullet.audio.volume = 0.1;
    newBullet.audio.play();

    allBullets.push(newBullet);
}

window.addEventListener('mousedown', (event) => {
    event.preventDefault();
    //fireGun();
    if(event.button === 0)
    firing=true;
});
window.addEventListener('mouseup', (event) => {
    event.preventDefault();
    //fireGun();
    if(event.button === 0)
    firing=false;
});
window.addEventListener('contextmenu',event => {
    event.preventDefault();
})
const handleKeydown = (event:KeyboardEvent) => {
    switch (event.key){
        case 'd':
            keys.d.pressed = true;
            break;
        case 'a':
            keys.a.pressed = true;
            break;
        case 'w':
            keys.w.pressed = true;
            //p1.velocity.y = -5;
            break;
        case 's':
            keys.s.pressed = true;
            break;
        default:
            break;
    }
};
const handleKeyup = (event:KeyboardEvent) => {
    switch (event.key){
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'w':
            keys.w.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        default:
            break;
    }
};
window.addEventListener('keydown',handleKeydown);
window.addEventListener('keyup',handleKeyup);
function drawQuadranti(){

    const height = (canvas.height/2) - (canvas.height/2)*0.20;
    const width = (canvas.width/2) - (canvas.width/2)*0.20;
    const vectorx = new Vector2(width,0);
    const vectory = new Vector2(0,height);
    const vectormenox = new Vector2(-width,0);
    const vectormenoy = new Vector2(0,-height);
    new ArrowHelper({
        c,
        originPoint,
        direction:vectorx.clone().normalize(),
        length:vectorx.length(),
        color:'black',
        text:'X +'
    }).draw();
    new ArrowHelper({
        c,
        originPoint,
        direction:vectory.clone().normalize(),
        length:vectory.length(),
        color:'black',
        text:'Y +'
    }).draw();
    new ArrowHelper({
        c,
        originPoint,
        direction:vectormenoy.clone().normalize(),
        length:vectormenoy.length(),
        color:'black',
        text:'Y -'
    }).draw();
    new ArrowHelper({
        c,
        originPoint,
        direction:vectormenox.clone().normalize(),
        length:vectormenox.length(),
        color:'black',
        text:'X -'
    }).draw();
}
