var express = require('express');
var router = express.Router();
var path = require('path');
var rootPath = path.resolve(process.cwd(), '..');

/* GET data listing. */
router
    .get('/reddits', function(req, res) {
        var dataPath = path.join(rootPath, 'source/data', 'reddits.json');
        res.sendfile(dataPath);
    })
    .get('/reddits/:reddit_id/comments', function(req, res) {
        var dataPath = path.join(rootPath, 'source/data', 'comments.json');
        res.sendfile(dataPath);
    })
/*
/reddits POST für NEU
/reddits/:reddit_id/rating?mode="up"/"down" PUT

/reddits/:reddit_id/comments POST für NEU
/reddits/:reddit_id/comments/:comment_id/rating?mode="up"/"down" PUT
 */
;

module.exports = router;
