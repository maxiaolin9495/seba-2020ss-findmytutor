const socket = require('socket.io');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./services/chatService');

const io = socket();
const sockets = require('./services/socketStore');
const emails = require('./services/socketIdForEmail');

const chatNamespace = io.of('/chat');

chatNamespace.on('connection', (socket) => {
    socket.on('join', ({ email, name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, email, name, room });

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
                email: user.email,
                id: socket.id,
                text: message.text,
                timestamp: message.timestamp
            });

        callback();
    });
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        sockets.remove(emails.get(socket.id));
        console.log(emails.get(socket.id), 'disconnected');
        emails.remove(socket.id);

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
    //these part are for video call
    socket
        .on('init', (data)=> {
            sockets.create(socket, data.clientId);
            emails.create(data.clientId, socket.id);
            socket.emit('init', {clientId: data.clientId});
        })
        .on('request', (data) => {
            const receiver = sockets.get(data.to);
            if (receiver) {
                receiver.emit('request', {from: data.from});
            }
        })
        .on('call', (data) => {
            const receiver = sockets.get(data.to);
            if (receiver) {
                receiver.emit('call', data);
            } else {
                socket.emit('failed');
            }
        })
        .on('end', (data) => {
            console.log('end', data);
            const receiver = sockets.get(data.to);
            if (receiver) {
                receiver.emit('end');
            }
        })

});

module.exports = io;