import {Router} from 'express';
import Edge from './logic/Edge';
import Game from './logic/Game';
import Point from './logic/Point';

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
    return res.status(201).json(game.getGameInfo());
});


routes.post('/selection', (req,res) => {
    const playerId:number=req.body.player;
    const x1:number=req.body.x1;
    const y1:number=req.body.y1
    const x2:number=req.body.x2;
    const y2:number=req.body.y2

    const p1:Point = new Point(x1,y1);
    const p2:Point = new Point(x2,y2);
    const edge:Edge = new Edge(p1,p2);
    console.log(edge);
    console.log("---------------");
    game.play(playerId,edge);
});


routes.get('/reset', (req,res) => {
    game.reset();
    return res.status(201);
});

export default routes;