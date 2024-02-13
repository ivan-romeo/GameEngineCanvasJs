import Vector2 from "../utils/Classes/Vector2.ts";
import {SpriteAnimation} from "../lib/animation.ts";

interface SpriteAttribute {
    position:Vector2,
    animation:SpriteAnimation,
    startingRow:number,
}
class Sprite {
    position:Vector2;
    animation: SpriteAnimation;
    frameBuffer: number; // Aggiungi una proprietà per il frame buffer
    currentBuffer: number; // Tieni traccia di quanti frame sono stati aggiunti al buffer


    constructor( { position, animation, startingRow }:SpriteAttribute) {
        this.position = position;
        this.animation = animation;
        this.frameBuffer = 6;
        this.currentBuffer = 0;
        this.animation = animation;
        this.animation.currentRow = startingRow;
    }

    update(dt: number) {
        if (this.currentBuffer >= this.frameBuffer) {
            this.animation.update(dt);
            this.currentBuffer = 0; // Resetta il buffer
        } else {
            this.currentBuffer++; // Incrementa il buffer
        }
    }
    draw(context: CanvasRenderingContext2D) {
        this.animation.draw(context, this.position.x, this.position.y); // Richiama il metodo draw dell'animazione
    }
}
export default Sprite;