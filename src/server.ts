import express from 'express';
import http from 'http';
import cors from 'cors';

import routes from './routes';

const SERVER_HTTP_PORT = process.env.SERVER_PORT || 3333;
const CLIENT_HOST_SOCKETIO = process.env.CLIENT_HOST_SOCKETIO || 'http://localhost:3000';

const app = express();
app.use(express.json());
app.use(cors());
app.use(routes);

// Config for websocket listening
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: CLIENT_HOST_SOCKETIO,
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

io.on("connection", (socket:SocketIO.Socket) => {
    console.log("New Socket.io client connected");

    app.set('socketio',io); // Setting here to make avail at routes.ts

    socket.on("disconnect", () => {
      console.log("Socket.io Client disconnected");
    });
});

//--


// Config for http REST listening
server.listen(SERVER_HTTP_PORT, () => console.log('Server running on port 3333'));
//--