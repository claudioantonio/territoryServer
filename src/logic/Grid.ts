import Square from "./Square";
import Point from './Point';
import Edge from './Edge';



class Grid {
    squares: Square[] = [];
    gridPoints: Point[] = [];

    
    /**
     * TODO: Poderia receber um GridConfig para encapsular os params.
     * 
     * @param width 
     * @param height 
     * @param gridSize 
     * @param padding 
     */
    constructor(width:number, height:number, gridSize:number, padding:number) {
        if (gridSize<2) {
            throw new Error("Grid size must be greater than 2");
        }
        this.createGridPoints(width, padding, height, gridSize);
        this.createSquares(gridSize);
    }

    private createGridPoints(width: number, padding: number, height: number, gridSize: number) {
        const BOTH_SIDES = 2;
        const maxX = width - padding;
        const maxY = height - padding;
        const boardWidth = width - (BOTH_SIDES * padding);
        const boardHeight = height - (BOTH_SIDES * padding);
        const gridXSpace = boardWidth / (gridSize - 1);
        const gridYSpace = boardHeight / (gridSize - 1);

        for (let x = padding; Math.trunc(x) <= maxX; x = x + gridXSpace) { //TODO: Entender porque só pega o último x se usar trunc
            for (let y = padding; y <= maxY; y = y + gridYSpace) {
                this.gridPoints.push(new Point(x,y));
            }
        }
    }

    createSquares(gridSize:number) {
        for (let row = 0; row < (gridSize-1); row++) {
            for (let col = 0; col < (gridSize-1); col++) {
                let edges:Edge[] = [];
                edges.push(new Edge(
                        this.gridPoints[col*gridSize+row],
                        this.gridPoints[col*gridSize+(row+1)]
                    )
                );
                edges.push(new Edge(
                        this.gridPoints[col*gridSize+(row+1)],
                        this.gridPoints[(col+1)*gridSize+(row+1)]
                    )
                );
                edges.push(new Edge(
                    this.gridPoints[(col+1)*gridSize+row],
                    this.gridPoints[(col+1)*gridSize+(row+1)]    
                    )
                );
                edges.push(new Edge(
                    this.gridPoints[col*gridSize+row],
                    this.gridPoints[(col+1)*gridSize+row]    
                    )
                );
                this.squares.push(new Square(edges));
            }
        }
    }

    /**
     * Close an edge
     *  
     * @param edge Edge to close 
     * @param owner User who wants to own the edge
     * 
     * @returns Number of closed squares by closing the edge provided.
     */
    closeEdge(edge:Edge, owner:string) {
        let squaredClosed:Square[] = [];
        this.squares.forEach(square => {
            let edgeIdx = square.findIndex(edge);
            console.log("Grid: edgeIdx=" + edgeIdx);
            if (edgeIdx>=0) {
                if (square.closeEdge(edgeIdx,owner)) {
                    squaredClosed.push(square);
                    console.log("Grid: conquistou quadrado");
                }
            }
        });
        return squaredClosed.length;
    }
}

export default Grid;