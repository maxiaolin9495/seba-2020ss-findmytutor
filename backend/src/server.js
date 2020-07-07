const app = require('./app');
const config = require('./config');
const sockets = require('./services/socketStore');
const emails = require('./services/socketIdForEmail');
const http = require('http').createServer(app);
const io = require('socket.io');

http.listen(config.port);

let wsServer = io.listen(http, {
    path: '/videoStream'
});

wsServer.on('connection', (socket) => {
    socket
        .on('init', (data)=> {
            sockets.create(socket, data.clientId);
            emails.create(data.clientId, socket.id);
            socket.emit('init', {clientId: data.clientId});
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
            console.log(emails.getAll());
            sockets.remove(emails.get(socket.id));
            console.log(emails.get(socket.id), 'disconnected');
            emails.remove(socket.id);
        });

});

console.log(`Listening on port ${config.port}`);