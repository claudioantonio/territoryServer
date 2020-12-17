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
        this.board = new Grid(WIDTH, HEIGHT, GRID_SIZE, PADDING);
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
     * Returns the id of the player who will play next
     */
    updateTurn() {
        const newTurn = (this.turn == PLAYER1) ? PLAYER2 : PLAYER1;
        this.turn=this.players[newTurn].id;
    }


    // TODO Include score in Player class
    getGameSetup() {
        let setup = {
            player1: this.players[0].name,
            player2: this.players[1].name,
            score_player1: this.players[0].score,
            score_player2: this.players[1].score,
            turn: this.turn,
            gameOver: this.status,
        };
        return setup;
    }

    getGameInfo(edge:Edge) {
        let info = {
            player1: this.players[0].name,
            player2: this.players[1].name,
            score_player1: this.players[0].score,
            score_player2: this.players[1].score,
            lastPlay: edge,
            gameOver: this.status,
            turn: this.turn,
            message: this.message,
        };
        console.log(info);
        return info;
    }

    getMessage() {
        let diffPoints:number = this.players[0].score - this.players[1].score;
        
        if (diffPoints===0) {
          return 'You both tied in the game!';
        } else if (diffPoints < 0) {
          return (this.players[1].name + ' won!!!');
        } else {
          return (this.players[0].name + ' won!!!');
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