const socketPairStore = {};

exports.create = (id1, id2) => {
    socketPairStore[id1] = id2;
    socketPairStore[id2] = id1;
};

exports.get = (id) => socketPairStore[id];
exports.getAll = () => socketPairStore;
exports.remove = (id) => delete socketPairStore[id];