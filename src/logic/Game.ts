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
    turn: number;

    constructor() {
        this.board = new Grid(400, 300, GRID_SIZE, 10);
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

    getGameInfo(edge:Edge) {
        let info = {
            player1: this.players[0],
            player2: this.players[1],
            score_player1: this.points[0],
            score_player2: this.points[1],
            lastPlay: edge,
            turn: this.turn,
        };
        console.log(info);
        return info;
    }

    play(playerId:number,edge:Edge) {
        const playerName:string = this.players[playerId-1];
        const nClosedSquares = this.board.closeEdge(edge,playerName);
        if (nClosedSquares>0) {
            this.points[playerId-1]+=nClosedSquares;
        }
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