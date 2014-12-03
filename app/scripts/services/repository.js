angular.module('saasFeeApp')
    .factory('repository', function ($http, $q, socket, util, auth, $rootScope) {
        'use strict';

        var reddits;
        var ratingsLoaded;
        var commentRatings = {};

        $rootScope.$on('login', function () {
            loadRatings();
            reloadComments();
        });

        $rootScope.$on('logout', function () {
            clearUserData();
        });

        var httpGet = function (url, success) {
            $http.get(url).
                success(function (data, status) {
                    console.log('request succeeded');
                    success(data, status);
                }).
                error(function (data, status) {
                    console.log('request errored: ' + status + ' / ' + data);
                });
        };
        var httpPost = function (url, data, success) {
            $http.post(url, data).
                success(function (data, status) {
                    console.log('request succeeded');
                    success(data, status);
                }).
                error(function (data, status) {
                    console.log('request errored: ' + status + ' / ' + data);
                });
        };

        function prepareReddit(reddit) {
            if (reddit.link && !reddit.url) {
                reddit.url = util.parseLink(reddit.link);
            }
        }

        var loadReddits = function () {
            var deferred = $q.defer();

            if (!reddits) {
                reddits = [];
                httpGet('/data/reddits', function (data, status) {
                    var reddit;
                    for (var i = 0; i < data.length; i++) {
                        reddit = data[i];
                        prepareReddit(reddit);
                        reddits.unshift(reddit);
                    }
                    deferred.resolve(reddits);
                });

                if (auth.isLoggedIn()) {
                    loadRatings();
                }
            } else {
                deferred.resolve(reddits);
            }
            return deferred.promise;
        };

        var getReddits = function () {
            return reddits;
        };

        function getRedditById(id) {
            for (var i = 0; i < reddits.length; i++) {
                if (reddits[i]._id === id) {
                    return reddits[i];
                }
            }
        }

        function getCommentById(reddit, commentId) {
            var comments = reddit.comments;
            for (var i = 0; i < comments.length; i++) {
                if (comments[i]._id === commentId) {
                    return comments[i];
                }
            }
        }

        var addReddit = function (reddit) {
            if (!auth.isLoggedIn()) {
                auth.redirectToLogin();
                return;
            }

            prepareReddit(reddit);
            reddits.unshift(reddit);
            httpPost('/data/reddits', reddit, function (redditId, status) {
                reddit._id = redditId;
                socket.emit('reddit:new', { redditId: redditId });
            });
        };

        var updateRedditRating = function (reddit, value) {
            if (!auth.isLoggedIn()) {
                auth.redirectToLogin();
                return;
            }
            if (reddit.userRating !== undefined && reddit.userRating === value) {
                // already rated
                return;
            }

            if (reddit.userRating !== undefined) {
                reddit.userRating += value;
            } else {
                reddit.userRating = value;
            }
            reddit.rating += value;

            httpPost('/data/reddits/' + reddit._id,
                {
                    userRating: reddit.userRating,
                    ratingValue: value
                },
                function (redditId, status) {
                    socket.emit('reddit:rating', { redditId: reddit._id, value: value });
                });
        };

        var updateCommentRating = function (reddit, comment, value) {
            if (!auth.isLoggedIn()) {
                auth.redirectToLogin();
                return;
            }
            if (comment.userRating !== undefined && comment.userRating === value) {
                // already rated
                return;
            }

            if (comment.userRating !== undefined) {
                comment.userRating += value;
            } else {
                comment.userRating = value;
            }
            comment.rating += value;

            httpPost('/data/reddits/' + reddit._id + '/comments/' + comment._id,
                {
                    userRating: comment.userRating,
                    ratingValue: value
                },
                function (redditId, status) {
                    socket.emit('comment:rating', { redditId: reddit._id, commentId: comment._id, value: value });
                });
        };

        var getComments = function (reddit) {
            if (!reddit.comments) {
                reddit.comments = [];
                httpGet('/data/reddits/' + reddit._id + '/comments', function (data, status) {
                    var comment, commentRating;
                    for (var commentId in data) {
                        if (data.hasOwnProperty(commentId)) {
                            comment = data[commentId];
                            comment.id = commentId;
                            commentRating = commentRatings[comment._id];
                            if (commentRating) {
                                comment.userRating = commentRating.value;
                            }
                            reddit.comments.unshift(comment);
                        }
                    }
                });
            }
            return reddit.comments;
        };

        var loadRatings = function () {
            if (ratingsLoaded) {
                return;
            }

            httpGet('/data/ratings', function (data, status) {
                var rating, reddit;

                for (var ratingId in data) {
                    if (data.hasOwnProperty(ratingId)) {
                        rating = data[ratingId];
                        reddit = getRedditById(rating.redditId);
                        if (rating.commentId) {
                            commentRatings[rating.commentId] = rating;
                        } else {
                            reddit.userRating = rating.value;
                        }
                    }
                }
                ratingsLoaded = true;
            });
        };

        var reloadComments = function () {
            for (var i = 0; i < reddits.length; i++) {
                if (reddits[i].comments && reddits[i].comments.length > 0) {
                    reddits[i].comments = null;
                    getComments(reddits[i]);
                }
            }
        };

        var clearUserData = function () {
            ratingsLoaded = false;
            if (!reddits) {
                return;
            }

            for (var i = 0; i < reddits.length; i++) {
                reddits[i].userRating = null;
                if (reddits[i].comments) {
                    for (var j = 0; j < reddits[i].comments.length; j++) {
                        reddits[i].comments[j].userRating = null;
                    }
                }
            }

        };

        var addComment = function (reddit, comment) {
            if (!auth.isLoggedIn()) {
                auth.redirectToLogin();
                return;
            }

            reddit.commentCount++;
            reddit.comments.unshift(comment);
            httpPost('/data/reddits/' + reddit._id + '/comments', comment, function (commentId, status) {
                comment._id = commentId;
                socket.emit('comment:new', { redditId: reddit._id, commentId: commentId });
            });
        };

        var registerUser = function (user, success, error) {
            httpPost('/data/users', user, function (response, status) {
                if (response.errors) {
                    error(response.errors);
                } else {
                    user._id = response;
                    success(user);
                }
            });
        };

        socket.on('reddit:new', function (data) {
            httpGet('/data/reddits/' + data.redditId, function (reddit, status) {
                prepareReddit(reddit);
                reddits.unshift(reddit);
            });
        });

        socket.on('reddit:rating', function (data) {
            var reddit = getRedditById(data.redditId);
            reddit.rating += data.value;
        });

        socket.on('comment:new', function (data) {
            httpGet('/data/reddits/' + data.redditId + '/comments/' + data.commentId, function (comment, status) {
                var reddit = getRedditById(data.redditId);
                reddit.commentCount++;
                reddit.comments.unshift(comment);
            });
        });

        socket.on('comment:rating', function (data) {
            var reddit = getRedditById(data.redditId);
            var comment = getCommentById(reddit, data.commentId);
            comment.rating += data.value;
        });

        return {
            getReddits: getReddits,
            loadReddits: loadReddits,
            addReddit: addReddit,
            updateRedditRating: updateRedditRating,
            updateCommentRating: updateCommentRating,
            getComments: getComments,
            addComment: addComment,
            registerUser: registerUser,
            clearUserData: clearUserData
        };
    });
