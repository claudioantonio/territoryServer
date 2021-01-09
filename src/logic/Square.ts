import Edge from './Edge';

const SIDES:number = 4;

class Square {
    id: number;
    owner: string;
    edges: Edge[]; 

    constructor(id:number,edges:Edge[]){
        if (edges.length!=SIDES) {
            throw new Error("Edge array must have exactly 4 edges");
        }
        this.id=id;
        this.owner='';
        edges.forEach(edge => {
            edge.relatesTo(this.id);
        });
        this.edges = edges;
    }

    /**
     * Return true if there is, at least, one available face 
     * and false otherwise
     */
    hasAvailableFace() {
        for (let i = 0; i < this.edges.length; i++) {
            const edge:Edge = this.edges[i];
            if (edge.hasOwner()===false) return true;
        }
        return false;
    }

    getNumberOfAvailableFaces() {
        let cont:number = 0;
        for (let i = 0; i < this.edges.length; i++) {
            const edge:Edge = this.edges[i];
            if (edge.hasOwner()===false) cont++;
        }
        return cont;
    }

    findIndex(otherEdge:Edge) {
        return this.edges.findIndex( edge => {
            return(edge.equals(otherEdge));
        });
    }

    /**
     * Set face ownership to a player
     * @param face Face the player selected
     * @param owner player
     */
    provideFace(edgeIdx:number, owner:string) {
        this.edges[edgeIdx].setOwner(owner);
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