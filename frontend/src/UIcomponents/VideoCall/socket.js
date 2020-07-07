import io from 'socket.io-client';

const socket = io(  'ws://localhost:3000', {
    path: '/videoStream',
    transports: ['websocket']
} );

export default socket;
