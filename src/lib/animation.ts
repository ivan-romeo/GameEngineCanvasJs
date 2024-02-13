import Vector2 from "../utils/Classes/Vector2.ts";

interface Frame {
    position:Vector2;
    width: number;
    height: number;
}

export class SpriteAnimation {
    frames: Frame[];
    currentFrameIndex: number;
    animationTime: number;
    totalDuration: number;
    frameWidth!: number;
    frameHeight!: number;
    image:HTMLImageElement;
    rows: number;
    cols: number;
    currentRow:number;
    flipHorizontal: boolean; // Flag per specchiare l'animazione orizzontalmente

    constructor(imageUrl: string, rows: number, cols: number, frameDuration: number) {
        this.frames = [];
        this.currentFrameIndex = 0;
        this.animationTime = 0;
        this.totalDuration = frameDuration * rows * cols;
        this.rows = rows;
        this.cols = cols;
        this.currentRow = 0; // Imposta la riga iniziale a 0
        this.flipHorizontal = false; // Imposta il flag di default a false

        this.image = new Image();
        this.image.src = imageUrl;
        this.image.onload = () => {
            // Una volta che l'immagine è stata caricata, calcola le dimensioni del singolo frame
            this.frameWidth = this.image.width / cols;
            this.frameHeight = this.image.height / rows;

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    this.frames.push({
                        position: new Vector2(col * this.frameWidth, row * this.frameHeight),
                        width: this.frameWidth,
                        height: this.frameHeight
                    });
                }
            }
        };
    }
    draw(context: CanvasRenderingContext2D, x: number, y: number) {

        // Verifica se l'immagine è stata caricata correttamente
        if (!this.image || !this.getCurrentFrame()) {
            // L'immagine non è stata caricata, non fare nulla
            return;
        }


        const currentFrame = this.getCurrentFrame();
        // Disegna l'immagine, considerando se deve essere specchiata
        let offsetX = -currentFrame.width / 2; // Calcola l'offset x per centrare l'immagine
        let offsetY = -currentFrame.height / 2; // Calcola l'offset y per centrare l'immagine

        // Disegna l'immagine, considerando se deve essere specchiata
        context.save(); // Salva lo stato del contesto prima di applicare le trasformazioni
        if (this.flipHorizontal) {
            context.scale(-1, 1); // Specchia l'animazione orizzontalmente
            offsetX = -offsetX - this.frameWidth; // Regola l'offset x per la specchiatura
        }
        // Disegna il frame corrente come un rettangolo blu per debug
        context.fillStyle = 'blue';
        context.fillRect(x+ offsetX, y+ offsetY, currentFrame.width, currentFrame.height);
        // Disegna l'immagine
        context.drawImage(
            this.image,
            currentFrame.position.x,
            currentFrame.position.y,
            currentFrame.width,
            currentFrame.height,
            x + offsetX, // Aggiunge l'offset x per centrare l'immagine
            y + offsetY, // Aggiunge l'offset y per centrare l'immagine
            currentFrame.width,
            currentFrame.height
        );

        context.restore(); // Ripristina lo stato del contesto dopo aver applicato le trasformazioni

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





