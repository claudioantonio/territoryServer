import Face from "./Face";

class Square {
    owner: string;
    faces: Face[];
    nAvailFaces: number;

    constructor(){
        this.owner='';
        this.faces = new Array<Face>(4);
        for (let index = 0; index < 4; index++) {
            this.faces[index]=new Face();
        }
        this.nAvailFaces=4;
    }

    /**
     * Return true if there is, at least, one available face 
     * and false otherwise
     */
    hasAvailableFace() {
        return this.nAvailFaces==0 ? false : true;
    }

    /**
     * Set face ownership to a player
     * @param face Face the player selected
     * @param owner player
     */
    provideFace(face:Face, owner:string) {
        face.setOwner(owner);
        this.nAvailFaces--;
    }

    /**
     * Set square ownership to a player
     * @param owner Player that conquered the square
     */
    conquerSquare(owner:string) {
        this.owner = owner;
    }

    /**
     * true if the square has owner or false otherwise
     */
    isConquered() {
        return this.owner?.length>0? true : false;
    }

    /**
     * A player try to close a square
     * @param faceIdx selected face by the user
     * @param owner player requesting face
     * 
     * return true if square was closed or false otherwise
     */
    requestFace(faceIdx:number,owner:string) {
        if (this.isConquered()) return;
        if (!this.hasAvailableFace()) return;

        console.log('* Square.nAvailFaces:' + this.nAvailFaces);
        const face = this.faces[faceIdx];
        if (face.isAvailable()){
            this.provideFace(face,owner);
            if (!this.hasAvailableFace()) {
                console.log(owner + ' conquered a square');
                this.conquerSquare(owner);
            }
            return true;
        }

        return false;
    }
}

export default Square;