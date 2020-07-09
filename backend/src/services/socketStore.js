const sockets = {};

exports.create = (socket, id) => {
    sockets[id] = socket;
    return id;
};

exports.get = (id) => sockets[id];
exports.getAll = () => sockets;
exports.remove = (id) => delete sockets[id];