const socket = require('socket.io');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./services/chatService');

const io = socket();
const sockets = require('./services/socketStore');
const emails = require('./services/socketIdForEmail');

const chatNamespace = io.of('/chat');

chatNamespace.on('connection', (socket) => {
    socket.on('join', ({ name, room }, callback) => {
        console.log(`Hello ${name}, welcome to room ${room}`);
        const { error, user } = addUser({ id: socket.id, name, room });

        if (error) return callback({ error: 'error' });

        socket.join(user.room);

        socket.emit('notification', {
            user: 'Admin',
            text: `${user.name}, welcome to this tutorial.`,
            timestamp: +new Date()
        });
        socket.broadcast
            .to(user.room)
            .emit('notification', {
                user: 'Admin',
                text: `${user.name} has joined!`,
                timestamp: +new Date()
            });

        chatNamespace.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

        callback();
    });
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        chatNamespace.to(user.room).emit('message',
            {
                user: user.name,
                id: socket.id,
                text: message.text,
                timestamp: message.timestamp
            });

        callback();
    });
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            chatNamespace.to(user.room)
                .emit('notification',
                    {
                        user: 'Admin',
                        text: `${user.name} has left.`,
                        timestamp: +new Date()
                    });
            chatNamespace.to(user.room)
                .emit('roomData',
                    {
                        room: user.room,
                        users: getUsersInRoom(user.room)
                    });
        }
    });
    socket
        .on('init', (data)=> {
            console.log(1234);
            sockets.create(socket, data.clientId);
            emails.create(data.clientId, socket.id);
            socket.emit('init', {clientId: data.clientId});
        })
        .on('request', (data) => {
            console.log(data);
            const receiver = sockets.get(data.to);
            if (receiver) {
                receiver.emit('request', {from: data.from});
            }
        })
        .on('call', (data) => {
            console.log(data);
            const receiver = sockets.get(data.to);
            if (receiver) {
                receiver.emit('call', {data, from: data.from});
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
            sockets.remove(emails.get(socket.id));
            console.log(emails.get(socket.id), 'disconnected');
            emails.remove(socket.id);
        });

});

module.exports = io;