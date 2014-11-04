var express = require('express');
var router = express.Router();
var path = require('path');
var rootPath = path.resolve(process.cwd(), '..');
var db = require('../source/data/database');

/* GET data listing. */
router
    .get('/reddits', function(req, res) {
        db.reddits.find({}, function (err, reddits) {
           res.send(reddits);
        });
    })
    .get('/reddits/:reddit_id/comments', function(req, res) {
        db.comments.find({redditId: req.params.reddit_id}, function (err, comments) {
            res.send(comments);
        });
    })
/*
/reddits POST für NEU
/reddits/:reddit_id/rating?mode="up"/"down" PUT

/reddits/:reddit_id/comments POST für NEU
/reddits/:reddit_id/comments/:comment_id/rating?mode="up"/"down" PUT
 */
;

module.exports = router;
