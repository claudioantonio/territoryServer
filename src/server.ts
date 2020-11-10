import express from 'express';
import http from 'http';
import Face from './logic/Face';
import Grid from './logic/Grid';
import Square from './logic/Square';

const port = process.env.PORT || 3333;

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

app.get('/draw', (req, res) => {
    res.send('<strong>Hello</strong>');
});


const gameGrid: Grid = new Grid(1,1);

io.on('connection', (socket: any) => {
    console.log('One user connected! :)');

    socket.on('play', (msg:any) => {
        const face = gameGrid.requestFace(0,Number(msg.play),msg.user);
        console.log(face);
    })
});


server.listen(port, () => console.log('Server running on port 3333'));