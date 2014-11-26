var debug = require('debug')('reddit:socket');

var socket = function (io) {
    io.on('connection', function (socket) {
        debug('client connected');
        socket.on('reddit:new', function (data) {
            socket.broadcast.emit('reddit:new', { redditId: data.redditId });
        });
    });
};

module.exports = socket;