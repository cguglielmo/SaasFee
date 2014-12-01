var Datastore = require('nedb');
var users = new Datastore({ filename: __dirname + '/nedb/users', autoload: true });
var reddits = new Datastore({ filename: __dirname + '/nedb/reddits', autoload: true });
var comments = new Datastore({ filename: __dirname + '/nedb/comments', autoload: true });
var ratings = new Datastore({ filename: __dirname + '/nedb/ratings', autoload: true });

module.exports = {
    users: users,
    reddits: reddits,
    comments: comments,
    ratings: ratings
};