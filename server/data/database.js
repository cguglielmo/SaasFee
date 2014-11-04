// Require the nedb module
var Datastore = require('nedb');
var reddits = new Datastore({ filename: __dirname + '/nedb/reddits', autoload: true });
var comments = new Datastore({ filename: __dirname + '/nedb/comments', autoload: true });

module.exports = {
    reddits: reddits,
    comments: comments
};