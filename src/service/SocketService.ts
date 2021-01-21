const io = require( "socket.io" )();

let disconnectListener:Function;

io.on("connection", (socket:SocketIO.Socket) => {
    console.log("New Socket.io client connected");

    socket.on("disconnect", () => {
      disconnectListener();
    });
});

function broadcastMessage(name:string,messageObj:any) {
    io.emit(name, messageObj);
}

const disconnectListenerSetter:Function = (listener: Function) => {
    disconnectListener = listener;
}

const socketapi = {
    io: io,
    broadcastMessage: broadcastMessage,
    setDisconnectListener: disconnectListenerSetter
};

export default socketapi;