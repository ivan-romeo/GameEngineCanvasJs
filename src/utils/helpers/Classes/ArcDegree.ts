import Vector2 from "../../Classes/Vector2.ts";

class ArcDegree {

    color:string;
    position:Vector2;
    c: CanvasRenderingContext2D;
    vector1: Vector2;
    vector2: Vector2;
    text:string;

    constructor({c,position, vector1, vector2,color = 'yellow',text=''}: {
        position:Vector2,
        color?:string
        c: CanvasRenderingContext2D,
        vector1: Vector2,
        vector2: Vector2,
        text?:string
    }){
        this.c = c;
        this.vector1 = vector1;
        this.vector2 = vector2;
        this.color = color;
        this.text = text;
        this.position = position;
    }

    draw(){
        this.c.beginPath();
        const rad = (degree:number) => degree * Math.PI / 180.0;
        this.c.arc(this.position.x,this.position.y, 30,
            rad(360- this.vector1.getAlphaRad(new Vector2(100,0))),
            rad(360- this.vector2.getAlphaRad(new Vector2(100,0))),
        );
        this.c.fillStyle = this.color;
        this.c.stroke();
    }
}

export default ArcDegree;