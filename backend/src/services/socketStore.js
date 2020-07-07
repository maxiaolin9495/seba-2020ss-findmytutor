const sockets = {};

exports.create = async (socket, id) => {
    sockets[id] = socket;
    return id;
};

exports.get = (id) => sockets[id];

exports.remove = (id) => delete sockets[id];