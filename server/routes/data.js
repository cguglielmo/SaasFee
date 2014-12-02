var express = require('express');
var router = express.Router();
var path = require('path');
var db = require('../data/database');
var expressJwt = require('express-jwt');
var auth = require('./auth');
var debug = require('debug')('reddit:data');

router
    .post('/users', function (req, res) {
        var user = req.body;
        db.users.findOne({email: user.email}, function (err, userFound) {
            if (userFound) {
                var errors = [];
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
    .get('/reddits', function (req, res) {
        db.reddits.find({}, function (err, reddits) {
            res.send(reddits);
        });
    })
    .get('/ratings',  expressJwt({secret: auth.secret}), function (req, res) {
        var userId = req.user.email;
        db.ratings.find({userId: userId}, function (err, ratings) {
            res.send(ratings);
        });
    })
    .post('/reddits', expressJwt({secret: auth.secret}), function (req, res) {
        db.reddits.insert(req.body, function (err, reddit) {
            res.send(reddit._id);
        });
    })
    .get('/reddits/:reddit_id', function (req, res) {
        db.reddits.findOne({_id: req.params.reddit_id}, function (err, reddit) {
            res.send(reddit);
        });
    })
    .post('/reddits/:reddit_id', expressJwt({secret: auth.secret}), function (req, res) {
        var redditId = req.params.reddit_id;
        var userRating = req.body.userRating;
        var ratingValue = req.body.ratingValue;

        var userId = req.user.email;

        db.ratings.findOne({redditId: redditId, userId: userId}, function (err, rating) {
            if (rating !== null && rating.value === userRating) {
                //Already rated with the same value -> do nothing
                debug('already rated with same value. user: ' + userId);
                res.send(200);
                return;
            }
            if (rating === null) {
                rating = {
                    redditId: redditId,
                    userId: userId,
                    value: userRating
                };
                db.ratings.insert(rating, function (err, rating) {
                    debug('new rating inserted with value' + rating.value);
                });
            } else {
                db.ratings.update({_id: rating._id}, { $set: { value: userRating } }, {}, function (err) {
                    debug('rating with id ' + rating._id + ' updated with new rating: ' + userRating);
                });
            }
            db.reddits.update({_id: redditId}, { $inc: { rating: ratingValue } }, {}, function (err) {
                debug('rating of reddit with id ' + redditId + ' increased by: ' + ratingValue);
            });
            res.send(200);
        });
    })
    .get('/reddits/:reddit_id/comments', function (req, res) {
        db.comments.find({redditId: req.params.reddit_id}, function (err, comments) {
            res.send(comments);
        });
    })
    .post('/reddits/:reddit_id/comments', expressJwt({secret: auth.secret}), function (req, res) {
        var reqComment = req.body;
        var redditId = req.params.reddit_id;
        reqComment.redditId = redditId;
        db.comments.insert(reqComment, function (err, comment) {
            db.reddits.update({_id: redditId}, { $inc: { commentCount: 1 } }, {}, function (err, reddit) {
                res.send(comment._id);
            });
        });
    })
    .get('/reddits/:reddit_id/comments/:comment_id', function (req, res) {
        db.comments.findOne({_id: req.params.comment_id}, function (err, comment) {
            res.send(comment);
        });
    })
    /*
    TODO
     /reddits/:reddit_id/comments/:comment_id/rating?mode="up"/"down" PUT
     */
;

module.exports = router;
