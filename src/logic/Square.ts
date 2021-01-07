import Edge from './Edge';

const SIDES:number = 4;

class Square {
    owner: string;
    edges: Edge[];
    nAvailFaces: number;    

    constructor(edges:Edge[]){
        if (edges.length!=SIDES) {
            throw new Error("Edge array must have 4 edges");
        }
        this.owner='';
        this.edges = edges;
        this.nAvailFaces=SIDES;
    }

    /**
     * Return true if there is, at least, one available face 
     * and false otherwise
     */
    hasAvailableFace() {
        return this.nAvailFaces==0 ? false : true;
    }

    findIndex(otherEdge:Edge) {
        return this.edges.findIndex( edge => {
            let sameInitial:boolean = edge.initialPoint.equals(otherEdge.initialPoint);
            let sameEnd:boolean = edge.endPoint.equals(otherEdge.endPoint);
            if ((sameInitial)&&(sameEnd)) {
                console.log('Square - findIndex - Achou edge na ordem original');
                return true;
            }
            sameInitial = edge.initialPoint.equals(otherEdge.endPoint);
            sameEnd = edge.endPoint.equals(otherEdge.initialPoint);
            if ((sameInitial)&&(sameEnd)) {
                console.log('Square - findIndex - Achou edge na ordem inversa');
                return true;
            }
            return false;
        });
    }

    /**
     * Set face ownership to a player
     * @param face Face the player selected
     * @param owner player
     */
    provideFace(edgeIdx:number, owner:string) {
        this.edges[edgeIdx].setOwner(owner);
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
    hasOwner() {
        return this.owner?.length>0? true : false;
    }

    /**
     * A player try to close a square
     * @param faceIdx selected face by the user
     * @param owner player requesting face
     * 
     * return true if square was closed or false otherwise
     */
    closeEdge(faceIdx:number,owner:string) {
        if (this.hasOwner()) return false;
        if (!this.hasAvailableFace()) return false;

        console.log('Square: Square.nAvailFaces:' + this.nAvailFaces);
        const edge = this.edges[faceIdx];
        if (!edge.hasOwner()) {
            this.provideFace(faceIdx,owner);
            if (!this.hasAvailableFace()) {
                console.log("Square: " + owner + ' conquered a square');
                this.conquerSquare(owner);
                return true;
            }
        }

        return false;
    }
}

export default Square;