import Point from './Point';

class Edge {
    initialPoint:Point;
    endPoint:Point;
    owner:string = "";

    constructor(p1:Point,p2:Point){
        this.initialPoint=p1;
        this.endPoint=p2;
    }

    setOwner(owner:string) {
        if (!this.hasOwner()) {
            this.owner=owner;
        }
    }

    hasOwner() {
        return (this.owner.length>0)? true : false;       
    }
}

export default Edge;