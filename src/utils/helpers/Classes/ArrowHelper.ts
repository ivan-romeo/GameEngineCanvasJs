import Vector2 from "../../Classes/Vector2.ts";

class ArrowHelper {

    color:string;
    c: CanvasRenderingContext2D;
    originPoint: Vector2;
    vector: Vector2;
    length:number;
    text:string;
    constructor({c, originPoint, direction,length,color = 'black',text=''}: {
        color:string
        c: CanvasRenderingContext2D,
        originPoint: Vector2,
        direction: Vector2,
        length:number,
        text?:string
    }) {
        this.c = c;
        this.originPoint = originPoint;
        this.vector = direction;
        this.length = length;
        this.color = color;
        this.text = text;
    }


    draw(){
        let headlen = 9; // length of head in pixels
        const vec = this.vector.clone().multiplyScalar(this.length).add(this.originPoint);
        const orig = this.originPoint.clone();
        let d = vec.clone().sub(this.originPoint);
        let angle = Math.atan2(d.y,d.x);

        this.c.strokeStyle = this.color;
        this.c.lineWidth = 1;
        this.c.beginPath();
        this.c.moveTo(orig.x, orig.y);
        this.c.lineTo(vec.x, vec.y);
        this.c.stroke();

        this.c.fillStyle = this.color;
        this.c.beginPath();
        this.c.moveTo(vec.x, vec.y);
        this.c.lineTo(
            vec.x - headlen * Math.cos(angle-Math.PI/7),
            vec.y - headlen * Math.sin(angle-Math.PI/7)
        );
        this.c.lineTo(vec.x-headlen*Math.cos(angle+Math.PI/7),
            vec.y-headlen*Math.sin(angle+Math.PI/7));
        this.c.lineTo(vec.x, vec.y);
        this.c.lineTo(vec.x-headlen*Math.cos(angle-Math.PI/7),
            vec.y-headlen*Math.sin(angle-Math.PI/7));
        this.c.fill();
        this.c.beginPath();
        this.c.fillText(this.text,vec.x > this.originPoint.x ? vec.x+3 : vec.x-20,vec.y+5);

    }

}

export default ArrowHelper;