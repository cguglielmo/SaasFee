var debug = require('debug')('reddit:socket');

var socket = function (io) {
    io.on('connection', function (socket) {
        debug('client connected');
        socket.on('reddit:new', function (data) {
            socket.broadcast.emit('reddit:new', { redditId: data.redditId });
        });
        socket.on('reddit:rating', function (data) {
            socket.broadcast.emit('reddit:rating', { redditId: data.redditId, value: data.value });
        });
        socket.on('comment:new', function (data) {
            socket.broadcast.emit('comment:new', { redditId: data.redditId, commentId: data.commentId });
        });
    });
};

module.exports = socket;