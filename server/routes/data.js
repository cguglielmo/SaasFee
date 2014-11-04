var express = require('express');
var router = express.Router();
var path = require('path');
var rootPath = path.resolve(process.cwd(), '..');
var db = require('../data/database');

/* GET data listing. */
router
    .get('/reddits', function(req, res) {
        db.reddits.find({}, function (err, reddits) {
           res.send(reddits);
        });
    })
    .post('/reddits', function(req, res) {
        db.reddits.insert(req.body, function (err, reddit) {
            res.send(reddit._id);
        });
    })
    .get('/reddits/:reddit_id/comments', function(req, res) {
        db.comments.find({redditId: req.params.reddit_id}, function (err, comments) {
            res.send(comments);
        });
    })
    .post('/reddits/:reddit_id/comments', function(req, res) {
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
