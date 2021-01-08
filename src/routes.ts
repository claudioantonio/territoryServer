import {Router} from 'express';
import socketIo from 'socket.io';

import Player from './logic/Player';
import Edge from './logic/Edge';
import Game from './logic/Game';
import Point from './logic/Point';
import BotPlayer from './logic/BotPlayer';
import { RSA_PKCS1_OAEP_PADDING } from 'constants';


const routes = Router();


const INITIAL_ID: number = 1;
let IDVAL: number = INITIAL_ID;

const waitingList: Player[] = [];
waitingList.push(new BotPlayer());

const game:Game = new Game();


function createPlayerId() {
    return IDVAL++;
}

/**
 * Endpoint to register players
 * 
 * Emit by socket message to update waiting room for all players
 * 
 * Return player id and a pass to waiting room or game room according
 * with waiting list and game situation
 */
routes.post('/register', (req, res) => {
    try {
        const newPlayerName:string = req.body.user;
        const newPlayerId:number = createPlayerId();

        let player1:Player|null = null;
        let player2:Player|null = null;
        let roomPass:string = 'WaitingRoom';

        if ( (game.isReady()) || (game.isInProgress()) ) {
            console.log('Routes: game ready or in progress');
            player1=game.players[0];
            player2=game.players[1];
            waitingList.push(new Player(newPlayerId,newPlayerName));
        } else { // Waiting for a player
            console.log('Routes: Waiting room has only one player');
            player1 = waitingList.shift()!; // Exclamation says I´m sure this is not undefined
            player2 = new Player(newPlayerId,newPlayerName);
            game.addPlayer(player1);
            game.addPlayer(player2);
            roomPass = 'GameRoom';

            broadCast(req,'enterGameRoom',{
               'invitationForPlayer': player1.id
            });
        }

        broadCast(
            req,
            'waitingRoomUpdate',
            createWaitingRoomUpdateJSON(player1,player2,waitingList)
        );    

        return res.status(201).json({
            'playerId': newPlayerId,
            'roomPass': roomPass
        }); 
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            error: 'Routes: Unexpected error while registering new player'
        });
    }
});

function createWaitingRoomUpdateJSON(p1:Player,p2:Player,waitingList:any) {
    return {
        'player1': p1,
        'player2': p2,
        'waitingList': waitingList,
    };
}

routes.get('/gameinfo', (req,res) => {
    return res.status(201).json(
        game.getGameSetup()
    );
});

routes.get('/waitingroom', (req,res) => {
    console.log(game.players);
    let player1name:string;
    let player2name:string;
    if ( game.isReady() || game.isInProgress() ) {
        player1name = game.players[0].name;
        player2name = game.players[1].name;
    } else {
        player1name = '???';
        player2name = '???';
    }
    return res.status(201).json({
        'gameStatus': game.getStatus(),
        'player1': player1name,
        'player2': player2name,
        'waitingList': waitingList
    }); 
});

routes.post('/botPlay', (req,res) => {
    console.log('botPlay endpoint was called');

    if (game.getTurn()!=0) {
        return res.status(400).json({
            'message': 'Play rejected because it´s not your turn',
        });
    }

    const botPlayer:BotPlayer = game.players[0] as BotPlayer;
    let playResult = botPlayer.play(game);
    if (game.isOver()) {
        handleGameOver(req,playResult);
    } else {
        broadCast(req, 'gameUpdate', playResult);
    }
    return res.status(201).json(playResult);
});

routes.post('/selection', (req,res) => {
    console.log('selection endpoint called');
    const playerId:number=req.body.player;

    if (game.getTurn()!=playerId) {
        return res.status(400).json({
            'message': 'Play rejected because it´s not your turn',
        });
    }

    const x1:number=req.body.x1;
    const y1:number=req.body.y1
    const x2:number=req.body.x2;
    const y2:number=req.body.y2

    const p1:Point = new Point(x1,y1);
    const p2:Point = new Point(x2,y2);
    const edge:Edge = new Edge(p1,p2);

    let playResult = game.play(playerId,edge);

    if (game.isOver()) {
        handleGameOver(req,playResult);
    }

    broadCast(req, 'gameUpdate', playResult);

    return res.status(201).json(playResult);
});

// TODO - REFACTOR FOR GOD SAKE!!!
function handleGameOver(req:any,playResult:any) {
    const winner = game.getWinner();    
    const looser = game.getLooser();

    if (waitingList.length>0) {
        // Add looser to waiting list
        waitingList.push(looser);
        // Prepare new game
        let playerInvited = waitingList.shift()!;
        if (winner!=null) {
            game.newGame(winner,playerInvited);
        }
        // Keep winner in game room and send looser to the waiting room
        playResult.whatsNext = {
            winner: {
                'playerId': winner?.id,
                'roomPass': 'GameRoom',    
            },
            looser: {
                'roomPass': 'WaitingRoom',
            }
        }
        // Invite first in waiting room to game room
        broadCast(req,'enterGameRoom',{
            'invitationForPlayer': playerInvited.id,
        });
        // Send info to update waiting room
        broadCast(
            req,
            'waitingRoomUpdate',
            createWaitingRoomUpdateJSON(winner!,playerInvited,waitingList)
        );
    } else {
        // Start a new game
        game.newGame(winner!,looser);
        playResult.whatsNext = {
            winner: {
                'playerId': winner?.id,
                'roomPass': 'GameRoom',    
            },
            looser: {
                'roomPass': 'GameRoom',
            }
        }
    }
}

function getSocket(req:any) {
    return req.app.get('socketio');
}

function broadCast(req:any,message:string,info:any) {
    const io = getSocket(req);
    io.emit(message,info);
}

routes.get('/reset', (req,res) => {
    console.log('routes: before reset' + game.players);
    waitingList.length=0;
    game.reset();
    console.log('routes: after reset' + game.players);
    return res.status(201);
});

export default routes;