const socketio = require('socket.io');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./services/chatService');

const io = socketio();
const chatNamespace = io.of('/chat');
chatNamespace.on('connection', (socket) => {
    socket.on('join', ({ name, room }, callback) => {
        console.log(`Hello ${name}, welcome to room ${room}`);
        const { error, user } = addUser({ id: socket.id, name, room });

        if (error) return callback({ error: 'error' });

        socket.join(user.room);

        socket.emit('notification', {
            user: 'Admin',
            text: `${user.name}, welcome to room ${user.room}.`,
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
});
module.exports = io;