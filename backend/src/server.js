const app = require('./app');
const config = require('./config');
const sockets = require('./services/socketStore');
const http = require('http').createServer(app);
const io = require('socket.io');

http.listen(config.port);

let wsServer = io.listen(http, {
    path: '/videoStream'
});

wsServer.on('connection', (socket) => {
    console.log(socket.id);

    socket
        .on('init', async () => {
            id = await sockets.create(socket, socket.id);
            socket.emit('init', {id});
        })
        .on('request', (data) => {
            const receiver = sockets.get(data.to);
            if (receiver) {
                receiver.emit('request', {from: id});
            }
        })
        .on('call', (data) => {
            const receiver = sockets.get(data.to);
            if (receiver) {
                receiver.emit('call', {data, from: id});
            } else {
                socket.emit('failed');
            }
        })
        .on('end', (data) => {
            const receiver = sockets.get(data.to);
            if (receiver) {
                receiver.emit('end');
            }
        })
        .on('disconnect', () => {
            sockets.remove(socket.id);
            console.log(socket.id, 'disconnected');
        });

});

console.log(`Listening on port ${config.port}`);