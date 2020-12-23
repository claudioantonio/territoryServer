import Edge from './Edge';
import Grid from './Grid';
import Player from './Player';


const GRID_SIZE = 4;
const WIDTH = 400;
const HEIGHT = 300;
const PADDING = 10;
const MAX_PLAYERS = 2;

const PLAYER1 = 0;
const PLAYER2 = 1;

const STATUS_NOT_READY:number = 1;
const STATUS_READY:number = 2;
const STATUS_IN_PROGRESS:number = 3;
const STATUS_OVER:number = 4;

/**
 * Class to model the territory game
 */
class Game {
    board: Grid;
    status: number = STATUS_NOT_READY;
    players: Player[] = [];
    turn: number = PLAYER1; // Player1 will start
    message: string = "";


    constructor() {
        this.board = new Grid(GRID_SIZE);
    }

    isReady() {
        return (this.status==STATUS_READY)? true : false;
    }

    isInProgress() {
        return (this.status==STATUS_IN_PROGRESS)? true : false;
    }

    getStatus() {
        return this.status;
    }

    canAddPlayer() {
        console.log(this.players);
        return this.players.length<MAX_PLAYERS ? true : false;
    }

    addPlayer(player:Player) {
        if (!this.canAddPlayer()) return -1;

        this.players.push(player);

        if (this.players.length==MAX_PLAYERS) this.status = STATUS_READY;

        console.log('Game: User ' + player + ' was registered');
        return;
    }

    /**
     * Change turn to the next player
     */
    updateTurn() {
        this.turn = (this.turn == PLAYER1) ? PLAYER2 : PLAYER1;
    }

    /**
     * Return the id of the player for the current
     */
    getTurn() {
        return this.players[this.turn].id;
    }

    // TODO Include score in Player class
    getGameSetup() {
        let setup = {
            player1: this.players[PLAYER1].name,
            player2: this.players[PLAYER2].name,
            score_player1: this.players[PLAYER1].score,
            score_player2: this.players[PLAYER2].score,
            turn: this.getTurn(),
            gameOver: (this.status==STATUS_OVER),
        };
        return setup;
    }

    getGameInfo(edge:Edge) {
        let info = {
            player1Id: this.players[PLAYER1].id,
            player1: this.players[PLAYER1].name,
            player2: this.players[PLAYER2].name,
            score_player1: this.players[PLAYER1].score,
            score_player2: this.players[PLAYER2].score,
            lastPlay: edge,
            gameOver: (this.status==STATUS_OVER),
            turn: this.getTurn(),
            message: this.message,
        };
        console.log(info);
        return info;
    }

    getMessage() {
        let diffPoints:number = this.players[PLAYER1].score - this.players[PLAYER2].score;
        
        if (diffPoints===0) {
          return 'You both tied in the game!';
        } else if (diffPoints < 0) {
          return (this.players[PLAYER2].name + ' won!!!');
        } else {
          return (this.players[PLAYER1].name + ' won!!!');
        }
    }

    updateStatus() {
        if (this.board.hasOpenSquare()==false) {
            this.status=STATUS_OVER;
            this.message=this.getMessage();
        }
    }

    // TODO Is it the best way to locate the player?
    getPlayerIndex(playerId:number) {
        let result:number=0;
        this.players.forEach((player,index) => {
            if (playerId==player.id) {
                result = index;
            }
        });
        return result;
    }

    play(playerId:number,edge:Edge) {
        if (this.status==STATUS_READY) this.status = STATUS_IN_PROGRESS;

        const playerIndex = this.getPlayerIndex(playerId);
        const player = this.players[playerIndex];

        const nClosedSquares = this.board.closeEdge(edge,player.name);
        console.log("Game: Update score " + player.score + " for player=" + (playerIndex));
        player.updateScore(nClosedSquares);
        console.log("Game: score updated to=" + player.score);

        this.updateStatus();
        this.updateTurn();
        return this.getGameInfo(edge);
    }

    /**
     * Reset a game.
     * Useful to restart a game or start a new game.
     * 
     * @param width Canvas width (TODO: Should not be in backend)
     * @param padding Space between grid points in canvas (TODO: Should not ne in backend)
     * @param height Canvas height (TODO: Should not be in backend)
     * @param gridSize Number of vertical and horizontal points in grid
     */
    reset() {
        this.board.reset(WIDTH,PADDING,HEIGHT,GRID_SIZE);
        this.status = STATUS_NOT_READY;
        this.players = [];
        this.turn = PLAYER1;
        this.message = "";
    }
}

export default Game;