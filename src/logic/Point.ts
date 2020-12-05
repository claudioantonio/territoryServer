class Point {
    x:number;
    y:number;

    constructor(x:number,y:number){
        this.x=x;
        this.y=y;
    }

    equals(other:Point) {
        let sameX:boolean = this.x==other.x;
        let sameY:boolean = this.y==other.y;
        console.log("Point: x=" + this.x + " x=" + other.x);
        console.log("Point: y=" + this.y + " y=" + other.y);
        console.log("Point: points equal=" + (sameX&&sameY));
        return (sameX&&sameY)? true : false;
    }
}

export default Point;