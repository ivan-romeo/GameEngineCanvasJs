import Vector2 from "./utils/Classes/Vector2.ts";
import ArrowHelper from "./utils/helpers/Classes/ArrowHelper.ts";

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


let framesCount = 0;
function animate() {
    window.requestAnimationFrame(animate);
    framesCount++;
    c.fillStyle = 'white';
    c.fillRect(0,0,canvas.width,canvas.height);
    c.save();

    drawQuadranti();

    // createVector(vector.clone().negate(),'-v1');

    const vector = Vector2.fromVector(mousePos);

    new ArrowHelper({
        vector:vector,
        c,
        originPoint,
        text:'PlayerPos',
        color:'black',
    }).draw();
    const vector2 = new Vector2(30,40);

    new ArrowHelper({
        vector:vector2,
        c,
        originPoint,
        text:'EnemyPos',
        color:'red',
    }).draw();

    new ArrowHelper({
        vector:vector.clone().sub(vector2),
        c,
        originPoint:vector2.clone().negateY().add(originPoint),
        text:'distanza',
        color:'green',
    }).draw();
console.log(vector.clone().sub(vector2).length())
    if(framesCount % 3 == 0){
        // console.log(mousePos);
        // createVector(mousePos.clone().normal(),'m')
    }
    //c.restore();
}

animate();
window.addEventListener('mousemove', (event) => {
    if(event.clientY < originPoint.y){
        //Versante y positivo
        mousePos.y = (originPoint.y - event.clientY);
    }else{
        //Versante y negativo
        mousePos.y = -((event.clientY - originPoint.y));
    }
    if(event.clientX > originPoint.x){
        //positivo
        mousePos.x = (event.clientX - originPoint.x);
    }else{
        //negativo
        mousePos.x = ((event.clientX - originPoint.x));
    }

});

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
        vector:vectorx,
        color:'black'
    }).draw();
    new ArrowHelper({
        c,
        originPoint,
        vector:vectory,
        color:'black'
    }).draw();
    new ArrowHelper({
        c,
        originPoint,
        vector:vectormenoy,
        color:'black'
    }).draw();
    new ArrowHelper({
        c,
        originPoint,
        vector:vectormenox,
        color:'black'
    }).draw();
}

//Come test e studio
function rappresentazioneDistanzaTra2player(){
    window.requestAnimationFrame(animate);
    framesCount++;
    c.fillStyle = 'white';
    c.fillRect(0,0,canvas.width,canvas.height);
    c.save();

    drawQuadranti();

    // createVector(vector.clone().negate(),'-v1');

    const vector = Vector2.fromVector(mousePos);

    new ArrowHelper({
        vector:vector,
        c,
        originPoint,
        text:'PlayerPos',
        color:'black',
    }).draw();
    const vector2 = new Vector2(30,40);

    new ArrowHelper({
        vector:vector2,
        c,
        originPoint,
        text:'EnemyPos',
        color:'red',
    }).draw();

    new ArrowHelper({
        vector:vector.clone().sub(vector2),
        c,
        originPoint:vector2.clone().negateY().add(originPoint),
        text:'distanza',
        color:'green',
    }).draw();
    console.log(vector.clone().sub(vector2).length())
}