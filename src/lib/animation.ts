interface Frame {
    x: number;
    y: number;
    width: number;
    height: number;
}

class SpriteAnimation {
    frames: Frame[];
    currentFrameIndex: number;
    animationTime: number;
    totalDuration: number;
    frameWidth: number;
    frameHeight: number;
    image:HTMLImageElement;
    rows: number;
    cols: number;
    currentRow:number;
    flipHorizontal: boolean; // Flag per specchiare l'animazione orizzontalmente
    flipVertical: boolean;   // Flag per specchiare l'animazione verticalmente

    constructor(imageUrl: string, rows: number, cols: number, frameDuration: number) {
        this.frames = [];
        this.currentFrameIndex = 0;
        this.animationTime = 0;
        this.totalDuration = frameDuration * rows * cols;
        this.rows = rows;
        this.cols = cols;
        this.currentRow = 0; // Imposta la riga iniziale a 0
        this.flipHorizontal = true; // Imposta il flag di default a false
        this.flipVertical = false;   // Imposta il flag di default a false

        this.image = new Image();
        this.image.src = imageUrl;
        this.image.onload = () => {
            // Una volta che l'immagine è stata caricata, calcola le dimensioni del singolo frame
            this.frameWidth = this.image.width / cols;
            this.frameHeight = this.image.height / rows;

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    this.frames.push({
                        x: col * this.frameWidth,
                        y: row * this.frameHeight,
                        width: this.frameWidth,
                        height: this.frameHeight
                    });
                }
            }
        };
    }
    draw(context: CanvasRenderingContext2D, x: number, y: number) {

            const currentFrame = this.getCurrentFrame();
            if (!this.image || !currentFrame) {
                // L'immagine non è stata caricata, non fare nulla
                return;
            }
        // Disegna l'immagine, considerando se deve essere specchiata
        if (this.flipHorizontal && !this.flipVertical) {
            context.scale(-1, 1); // Specchia l'animazione orizzontalmente
            x = -x - this.frameWidth; // Regola la posizione x per la specchiatura
        } else if (!this.flipHorizontal && this.flipVertical) {
            context.scale(1, -1); // Specchia l'animazione verticalmente
            y = -y - this.frameHeight; // Regola la posizione y per la specchiatura
        } else if (this.flipHorizontal && this.flipVertical) {
            context.scale(-1, -1); // Specchia l'animazione sia orizzontalmente che verticalmente
            x = -x - this.frameWidth; // Regola la posizione x per la specchiatura
            y = -y - this.frameHeight; // Regola la posizione y per la specchiatura
        }

        context.drawImage(
            this.image,
            this.frames[this.currentFrameIndex].x,
            this.frames[this.currentFrameIndex].y,
            this.frames[this.currentFrameIndex].width,
            this.frames[this.currentFrameIndex].height,
            x,
            y,
            this.frames[this.currentFrameIndex].width,
            this.frames[this.currentFrameIndex].height
        );
    }
    update(dt: number) {
        this.animationTime += dt;
        while (this.animationTime > this.totalDuration) {
            this.animationTime -= this.totalDuration;
        }
        let framesPerRow = this.cols;
        let startFrame = this.currentRow * framesPerRow;
        let endFrame = startFrame + framesPerRow;
        let totalTime = 0;
        for (let i = startFrame; i < endFrame; i++) {
            totalTime += this.totalDuration / framesPerRow;
            if (this.animationTime < totalTime) {
                this.currentFrameIndex = i;
                break;
            }
        }
    }

    getCurrentFrame(): Frame {
        return this.frames[this.currentFrameIndex];
    }
}

class Sprite {
    x: number;
    y: number;
    animation: SpriteAnimation;
    frameBuffer: number; // Aggiungi una proprietà per il frame buffer
    currentBuffer: number; // Tieni traccia di quanti frame sono stati aggiunti al buffer


    constructor(x: number, y: number, animation: SpriteAnimation, startingRow: number) {
        this.x = x;
        this.y = y;
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
        this.animation.draw(context, this.x, this.y); // Richiama il metodo draw dell'animazione
    }
    // draw(context: CanvasRenderingContext2D) {
    //
    //     const currentFrame = this.animation.getCurrentFrame();
    //     if (!this.animation.image || !currentFrame) {
    //         // L'immagine non è stata caricata, non fare nulla
    //         return;
    //     }
    //     console.log(currentFrame)
    //     context.drawImage(this.animation.image, currentFrame.x, currentFrame.y, currentFrame.width, currentFrame.height, this.x, this.y, currentFrame.width, currentFrame.height);
    // }
}

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const context = canvas.getContext('2d');
if (!context) {
    throw new Error('Impossibile ottenere il contesto 2D del canvas');
}


const imageUrl = "pawn_yellow.png"; // Percorso dell'immagine
const rows = 6; // Numero di righe nell'immagine
const cols = 6; // Numero di colonne nell'immagine
const frameDuration = 0.1; // Durata di ogni frame dell'animazione

// Crea un'istanza dell'animazione
const animation = new SpriteAnimation(imageUrl, rows, cols, frameDuration);

// Crea un'istanza del personaggio sprite
const player = new Sprite(0, 0, animation,1);

let lastTimestamp = 0;

// Funzione per disegnare il player
function draw() {
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    player.draw(context);
}

// Funzione per eseguire l'animazione
function animate(timestamp: number) {
    const dt = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    player.update(dt);
    draw();
    requestAnimationFrame(animate);
}
animate(1000);
