import Face from "./Face";

class Square {
    owner?: string;
    faces: Face[];
    nAvailFaces: number;

    constructor(){
        this.faces = new Array<Face>(4);
        for (let index = 0; index < 4; index++) {
            this.faces[index]=new Face();
        }
        this.nAvailFaces=4;
    }

    requestFace(faceIdx:number,owner:string) {
        console.log('Square.requestFace: face - owner' + faceIdx + ' - ' + owner);
        console.log('Square.nAvailFaces:' + this.nAvailFaces);
        if (this.nAvailFaces==0) return;
        console.log('* Square.nAvailFaces:' + this.nAvailFaces);
        const face = this.faces[faceIdx];
        if (face.isAvailable()){
            face.setOwner(owner);
            this.nAvailFaces--;
            console.log('** Square.nAvailFaces:' + this.nAvailFaces);
            return face;
        }

        return null;
    }
}

export default Square;