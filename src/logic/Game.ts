import Grid from './Grid';

const GRID_SIZE = 1;
const MAX_PLAYERS = 2;
const PLAYER1 = 0;
const PLAYER2 = 1;


class Game {
    
    board: Grid;
    players: string[];
    points: number[];
    turn: number;

    constructor() {
        this.board = new Grid(GRID_SIZE,GRID_SIZE);
        this.players = [];
        this.points= [];
        this.turn=PLAYER1; // player1 starts
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

    getGameInfo() {
        let info = {
            player1: this.players[0],
            player2: this.players[1],
            score_player1: this.points[0],
            score_player2: this.points[1],
            turn: this.turn,
        };
        console.log(info);
        return info;
    }

    tryCloseASquare(playerId:number,squareIdx:number,sideIdx:number) {
        const wasClosed = this.board.requestFace(squareIdx,sideIdx,this.players[playerId-1]);
        if (wasClosed) {
            console.log('Game: square closed by ' + playerId);
            this.points[playerId-1]++;
        }
        this.updateTurn();
        return this.getGameInfo();
    }

    reset() {
        this.board = new Grid(GRID_SIZE,GRID_SIZE);
        this.players = [];
        this.points= [];
        this.turn=PLAYER1; // player1 starts
    }
}

export default Game;