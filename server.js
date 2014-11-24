var debug = require('debug')('reddit:server');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var socketIo = require('socket.io');

var data = require('./server/routes/data');
var auth = require('./server/routes/auth');
var jwt = require('jsonwebtoken');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'app')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));

app.use('/auth', auth);
app.use('/data', data);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    /*var err = new Error('Not Found');
    err.status = 404;
    next(err);*/
    res.send('Not Found');
});

/*
/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        console.log("bbbb");
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log("bbbb");
});

*/

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    debug('SassFee server listening on port ' + server.address().port);
});

var io = socketIo.listen(server);
require('./server/routes/socket')(io);

debug('Test');