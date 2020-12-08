import Edge from './Edge';
import Grid from './Grid';

const GRID_SIZE = 2;
const MAX_PLAYERS = 2;
const PLAYER1 = 0;
const PLAYER2 = 1;


class Game {
    
    board: Grid;
    players: string[];
    points: number[];
    isOver: boolean;
    turn: number;
    message: string;

    constructor() {
        this.board = new Grid(400, 300, GRID_SIZE, 10);
        this.players = [];
        this.points= [];
        this.isOver=false;
        this.turn=PLAYER1; // player1 starts
        this.message = "";
    }

    canAddPlayer() {
        return this.players.length<MAX_PLAYERS ? true : false;
    }

    addPlayer(player:string) {
        if (!this.canAddPlayer()) return -1;

        this.players.push(player);
        this.points.push(0);
        console.log('User ' + player + ' was registered');
        return this.players.length;
    }

    updateTurn() {
        const newTurn = (this.turn == PLAYER1) ? PLAYER2 : PLAYER1;
        this.turn=newTurn;
    }

    getGameInfo(edge:Edge) {
        let info = {
            player1: this.players[0],
            player2: this.players[1],
            score_player1: this.points[0],
            score_player2: this.points[1],
            lastPlay: edge,
            gameOver: this.isOver,
            turn: this.turn,
            message: this.message,
        };
        console.log(info);
        return info;
    }

    getMessage() {
        let diffPoints:number = this.points[0] - this.points[1];
        
        if (diffPoints===0) {
          return 'You both tied in the game!';
        } else if (diffPoints < 0) {
          return (this.players[1] + ' won!!!');
        } else {
          return (this.players[0] + ' won!!!');
        }
    }

    updateScore(playerId:number,nClosedSquares:number) {
        if (nClosedSquares>0) {
            this.points[playerId]+=nClosedSquares;
        }
    }
    
    updateStatus() {
        if (this.board.hasOpenSquare()==false) {
            this.isOver=true;
            this.message=this.getMessage();
        }
        this.isOver = (this.board.hasOpenSquare())? false : true;       
    }

    play(playerId:number,edge:Edge) {
        const playerName:string = this.players[playerId-1];
        const nClosedSquares = this.board.closeEdge(edge,playerName);
        console.log("Game: Update score " + this.points[playerId-1] + " for player=" + (playerId-1));
        this.updateScore(playerId-1,nClosedSquares);
        console.log("Game: score updated to=" + this.points[playerId-1]);
        this.updateStatus();
        this.updateTurn();
        return this.getGameInfo(edge);
    }

    reset() {
        this.board = new Grid(400,300,2,10);
        this.players = [];
        this.points= [];
        this.turn=PLAYER1; // player1 starts
    }
}

export default Game;