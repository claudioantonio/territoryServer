import Square from "./Square";

class Grid {
    squares: Square[];

    constructor(width:number, height:number) {
        this.squares = new Array<Square>(width*height);
        for (let index = 0; index < this.squares.length; index++) {
            this.squares[index] = new Square();
        }
    }

    requestFace(squareIdx:number, faceIdx:number, owner:string){
        return this.squares[squareIdx].requestFace(faceIdx-1,owner);      
    }
}

export default Grid;