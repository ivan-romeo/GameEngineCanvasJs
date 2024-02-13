import Vector2 from "./utils/Classes/Vector2.ts";
import {Player} from "./classes/player.ts";
import {SpriteAnimation} from "./lib/animation.ts";

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

// let originPoint:Vector2 = new Vector2(canvas.width / 2,canvas.height / 2);

let mousePos = new Vector2(0,0);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // originPoint = new Vector2(canvas.width / 2,canvas.height / 2);
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

const animation = new SpriteAnimation("pawn_yellow.png", 6, 6, 0.6);
const vector = new Vector2(50,50);
let framesCount = 0;
const player = new Player({
   position: vector,
   animation:animation,
   canvas:c
});

const allBullets:Bullet[] = [];
let firing = false;
let lastTimestamp = 0;
function animate(timestamp: number) {
    const dt = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    framesCount++;
    c.fillStyle = 'white';
    c.fillRect(0,0,canvas.width,canvas.height);
    c.save();

    player.update(dt);
    // createVector(vector.clone().negate(),'-v1');

    const directionPlayer = mousePos.clone().sub(player.position).normalize();
    if(player.position.clone().sub(mousePos).length() >= 5){
        player.setDirection(directionPlayer);
    }
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
    window.requestAnimationFrame(animate);
}

animate(100);
window.addEventListener('mousemove', (event) => {
    mousePos.y = event.y;
    mousePos.x = event.x;
});


class Bullet {
    direction:Vector2;
    position:Vector2;
    velocity:number;
    audio = new Audio('laserShoot.wav');

    constructor(args:{direction:Vector2,position:Vector2}) {
        this.position = args.position.clone(); // Utilizza la posizione iniziale fornita
        this.direction = args.direction.clone().normalize(); // Normalizza la direzione
        this.velocity = 14;
    }
    draw(){
        c.beginPath();
        c.fillStyle = "#b20808";
        c.shadowColor = "#b20808";
        c.shadowBlur = 15;
        c.closePath();
        c.fillRect(this.position.x, this.position.y, 2, 4);
    }
    updatePosition(){
        this.position = this.position.add(this.direction.clone().multiplyScalar(this.velocity));
    }
}

function fireGun() {
    const newBullet = new Bullet({
        position:player.position,
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
