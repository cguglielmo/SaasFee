var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var data = require('./routes/data');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'source')));

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

module.exports = app;