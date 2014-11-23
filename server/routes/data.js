var express = require('express');
var router = express.Router();
var path = require('path');
var rootPath = path.resolve(process.cwd(), '..');
var db = require('../data/database');
var expressJwt = require('express-jwt');
var auth = require('./auth');

/* GET data listing. */
router
    .post('/users', function(req, res) {
        var user = req.body;
        db.users.findOne({email: user.email}, function (err, userFound) {
            if (userFound) {
                var errors = []
                errors.push({
                    field: "email",
                    message: "Diese E-Mail wurde bereits registriert",
                    validationErrorKey: "emailAlreadyRegistered"
                });
              res.send({errors: errors});
            } else {
                db.users.insert(user, function (err, user) {
                    res.send(user._id);
                });
            }
        });
    })
    .get('/reddits', function(req, res) {
        db.reddits.find({}, function (err, reddits) {
           res.send(reddits);
        });
    })
    .post('/reddits', expressJwt({secret: auth.secret}), function(req, res) {
        db.reddits.insert(req.body, function (err, reddit) {
            res.send(reddit._id);
        });
    })
    .get('/reddits/:reddit_id/comments', function(req, res) {
        db.comments.find({redditId: req.params.reddit_id}, function (err, comments) {
            res.send(comments);
        });
    })
    .post('/reddits/:reddit_id/comments', expressJwt({secret: auth.secret}), function(req, res) {
        var reqComment = req.body;
        var redditId = req.params.reddit_id;
        reqComment.redditId = redditId;
        db.comments.insert(reqComment, function (err, comment) {
            db.reddits.update({_id: redditId}, { $inc: { commentCount: 1 } }, {}, function (err, reddit) {
                res.send(comment._id);
            });
        });
    })
/*
/reddits/:reddit_id/rating?mode="up"/"down" PUT

/reddits/:reddit_id/comments/:comment_id/rating?mode="up"/"down" PUT
 */
;

module.exports = router;
