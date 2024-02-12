import Vector2 from "../Classes/Vector2.ts";

const drawArrow = ({c, originPoint, vector,color,text=''}: {
    color?:string
    c: CanvasRenderingContext2D,
    originPoint: Vector2,
    vector: Vector2,
    text?:string
}) => {

    let headlen = 10; // length of head in pixels
    const vec = vector.clone().add(originPoint);
    let d = vec.clone().sub(originPoint);
    let angle = Math.atan2(d.y,d.x);

    color = color ?? "#"+((1<<24)*Math.random()|0).toString(16);
    c.strokeStyle = color;
    c.fillStyle = color;
    c.lineWidth = 2;
    c.moveTo(originPoint.x, originPoint.y);
    c.lineTo(vec.x, vec.y);
    c.moveTo(vec.x, vec.y);
    c.fillText(text,vec.x > originPoint.x ? vec.x : vec.x-20,vec.y+5);
    c.stroke();

const tox = vec.x;
const toy = vec.y;
    c.beginPath();
    c.moveTo(tox, toy);
    c.lineTo(
        tox - headlen * Math.cos(angle-Math.PI/7),
        toy - headlen * Math.sin(angle-Math.PI/7)
    );

    //path from the side point of the arrow, to the other side point
    c.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),
        toy-headlen*Math.sin(angle+Math.PI/7));

    //path from the side point back to the tip of the arrow, and then
    //again to the opposite side point
    c.lineTo(tox, toy);
    c.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
        toy-headlen*Math.sin(angle-Math.PI/7));

    //draws the paths created above
    c.fill();

}
function randomColor(){
    return "#"+((1<<24)*Math.random()|0).toString(16);
}
export default drawArrow;