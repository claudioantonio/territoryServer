import {Router} from 'express';
import Game from './logic/Game';

const routes = Router();

const game:Game = new Game();

routes.post('/register', (req, res) => {
    try {
        let playerNumber:number;
        const player:string = req.body.user;

        playerNumber=game.addPlayer(player);
        
        return res.status(201).json({
            'playerNumber': playerNumber,
        }); 
    } catch (e) {
        return res.status(400).json({
            error: 'Unexpected error while registering new player'
        });
    }
});


routes.get('/gameinfo', (req,res) => {
    return res.status(201).json({
        player1: 'xxx',
        player2: 'yyy',
        score_player1: 0,
        score_player2: 0,
        turn: '1',
    },);
});


routes.post('/selection', (req,res) => {
    const squareIdx:number=req.body.square;
    const sideIdx:number=req.body.side;
    const player:number=req.body.player;

    game.tryCloseASquare(player,squareIdx,sideIdx);
});
export default routes;