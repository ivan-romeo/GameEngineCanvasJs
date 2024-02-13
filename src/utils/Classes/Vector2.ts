export default class Vector2 {
    y:number;
    x:number;

    constructor(x:number,y:number) {
        this.x = x;
        this.y = y;
    }

    static fromVector(vector:Vector2){
        return new Vector2(vector.x,vector.y);
    }
    clone(){
        return new Vector2(this.x,this.y);
    }

    add(vector:Vector2){
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    negate(){
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }
    negateY(){
        this.y = -this.y;
        return this;
    }

    sub(vector:Vector2){
        this.x += -vector.x;
        this.y += -vector.y;
        return this;
    }

    multiplyScalar(scalar:number){
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    length(){
        //Per calcolare il modulo o intensità faccio la radice quadrata della somma di ogni elemento del vettore elevato alla 2
        return Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2))
        //Non è altro che l'ipotenusa del nostro triangolo rettangolo

        /*
        * Esempio di applicazione
        * Se vogliamo sapere la distanza di due oggetti nel piano facciamo la differenza dei due moduli
        * esempio se vogliamo farci inseguire da un nemico solo se siamo ad una certa distanza
        * Vettore con origine il nemico e punta verso di noi l'intensità sarà la distanza
        *
        * */
    }

    normalize(){
        //Per calcolare la normale basta dividere per il modulo o moltiplicarlo per 1 / modulo
        const normal = this.multiplyScalar(1 / this.length());
        this.x = normal.x;
        this.y = normal.y;
        return this;
    }

    dot(vector:Vector2){
        //Prodotto scalare equivale alla sommatoria del prodotto delle componenti del vettore
        return (this.x * vector.x) + (this.y * vector.y);

        /*
        * Considerazioni
        * Se l'angolo è di 90 dot = 0
        * Se l'angolo è > di 90 dot < 0
        * Se l'angolo è < di 90 dot > 0
        * se i vettori sono normalizzati il dot equivale al cos(alpha)
        * Se uno dei due vettori è nullo il prodotto scalare è 0
        * Si considera sempre perpendicolare un vettore nullo in un altro vettore
        * */
    }

    getAlpha(vector:Vector2){
        //Essendo che il prodotto scalare può essere trovato effettuando
        /*
        * V1.lenght() * V2.lenght() * cos(a) possiamo anche calcolare alpha
        * se i vettori sono normalizzati il dot equivale al cos(alpha)
        * */

        const v1Normalized = this.clone().normalize();
        const v2Normalized = vector.clone().normalize();
        const cosAlpha = v1Normalized.dot(v2Normalized);
        const alpha = Math.acos(cosAlpha);
        return alpha;
    }
    getAlphaRad(vector:Vector2){
        const alpha = this.getAlpha(vector);
        const alphaDeg = alpha * (180 / Math.PI);
        return alphaDeg;
    }

    rotate(degrees:number){
        this.x = ((this.x * Math.cos(degrees)) - (this.y * Math.sin(degrees)));
        this.y = ((this.x * Math.sin(degrees)) + (this.y * Math.cos(degrees)));
        return this;
    }
    // rotateByDirection(vectorDir:Vector2){
    //     /*
    //     * Bx = (cos@ * -sin@) * Ax
    //     * By = (sin@ * cos@) * Ay
    //     * */
    //
    //     return this;
    // }



}