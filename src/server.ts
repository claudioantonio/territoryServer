import express from 'express';
import http from 'http';
import cors from 'cors';

import routes from './routes';


const SERVER_PORT = process.env.SERVER_PORT || 3333;
const CLIENT_HOST_SOCKETIO = process.env.CLIENT_HOST_SOCKETIO || 'http://localhost:3000';

const app = express();
app.use(express.json());
app.use(cors());
app.use(routes);

// Config for websocket
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: CLIENT_HOST_SOCKETIO,
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});
//--

server.listen(SERVER_PORT, () => console.log('Server running on port 3333'));