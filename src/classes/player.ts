import Vector2 from "../utils/Classes/Vector2.ts";
import Sprite from "./Sprite.ts";
import {SpriteAnimation} from "../lib/animation.ts";
enum Direction {
    None,
    Right,
    Left,
    Up,
    Down
}
interface PalyerAttribute {
    direction?:Vector2,
    position:Vector2,
    maxSpeed?:number,
    velocity?:Vector2,
    acceleration?:Vector2,
    friction?:number,
    animation:SpriteAnimation,
    canvas:CanvasRenderingContext2D
}
class Player {
    position:Vector2;
    direction:Vector2;
    maxSpeed:number;
    velocity:Vector2;
    acceleration:Vector2;
    friction:number;
    minSpeed:number = 0.1;
    sprite:Sprite;
    canvas:CanvasRenderingContext2D;
    currentDirection: Direction = Direction.None;

    constructor(arg:PalyerAttribute) {
        this.position = arg.position;
        this.direction = arg.direction ?? new Vector2(1,1);
        this.maxSpeed = arg.maxSpeed ?? 3;
        this.velocity = arg.velocity ?? new Vector2(0,0);
        this.acceleration = arg.acceleration ?? new Vector2(0,0);
        this.friction = 0.1;
        this.canvas = arg.canvas;
        this.sprite = new Sprite({position:this.position,animation: arg.animation, startingRow:1})
    }

    setDirection(direction:Vector2){
        this.direction = direction;
    }
    setAcceleration(acceleration:Vector2){
        this.acceleration = acceleration;
    }

// Funzione per aggiornare l'accelerazione del giocatore per simulare l'attrito
    applyFriction() {
        // Calcola l'attrito per ciascuna componente della velocità
        var frictionX = this.velocity.x * this.friction;
        var frictionY = this.velocity.y * this.friction;

        // Applica l'attrito alla velocità
        this.velocity.x -= frictionX;
        this.velocity.y -= frictionY;


    }
    checkVelocityMin(){
      if (Math.abs(this.velocity.x) < this.minSpeed) {
            this.velocity.x = 0;
        }
        if (Math.abs(this.velocity.y) < this.minSpeed) {
            this.velocity.y = 0;
        }
    }
    updatePlayerPosition() {
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        // Limita la velocità massima
        if (Math.abs(this.velocity.x) > this.maxSpeed) {
            this.velocity.x = this.maxSpeed * (this.velocity.x / Math.abs(this.velocity.x));
        }
        if (Math.abs(this.velocity.y) > this.maxSpeed) {
            this.velocity.y = this.maxSpeed * (this.velocity.y / Math.abs(this.velocity.y));
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    update(dt:number){
        this.applyFriction();
        this.checkVelocityMin();
        this.updatePlayerPosition();this.sprite.draw(this.canvas);
        this.sprite.update(dt);
    }
}

export {
    Player
};
export type { PalyerAttribute };
