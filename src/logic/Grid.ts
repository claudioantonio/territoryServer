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
    constructor(gridSize:number) {
        if (gridSize<2) {
            throw new Error("Grid size must be greater than 2");
        }
        this.createGridPoints(gridSize);
        this.createSquares(gridSize);
    }

    private createGridPoints(gridSize: number) {
        for (let x = 0; x <= gridSize; x++) {
            for (let y = 0; y <= gridSize; y++) {
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
     * Rebuild the board game
     * Useful to restart a game or start a new game.
     * 
     * @param width Canvas width (TODO: Should not be in backend)
     * @param padding Space between grid points in canvas (TODO: Should not ne in backend)
     * @param height Canvas height (TODO: Should not be in backend)
     * @param gridSize Number of vertical and horizontal points in grid
     */
    reset(width:number,padding:number,height:number,gridSize:number) {
        this.squares = [];
        this.gridPoints = [];
        this.createGridPoints(gridSize);
        this.createSquares(gridSize);
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
        console.log("Grid: N. quadrados fechados=" + squaredClosed.length);
        return squaredClosed.length;
    }

    /**
     * Check if there is any open square.
     */
    hasOpenSquare() {
        for (let i = 0; i < this.squares.length; i++) {
            if (this.squares[i].hasAvailableFace()) {
                return true;
            }
        }
        return false;
    }
}

export default Grid;