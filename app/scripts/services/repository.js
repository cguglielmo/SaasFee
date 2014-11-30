angular.module('saasFeeApp')
    .factory('repository', function ($http, $q, socket, util, auth) {
        'use strict';

        var reddits;

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
            } else {
                deferred.resolve(reddits);
            }
            return deferred.promise;
        };

        var getReddits = function () {
            return reddits;
        };

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

        var getComments = function (reddit) {
            if (!reddit.comments) {
                reddit.comments = [];
                httpGet('/data/reddits/' + reddit._id + '/comments', function (data, status) {
                    var comment;
                    for (var commentId in data) {
                        if (data.hasOwnProperty(commentId)) {
                            comment = data[commentId];
                            comment.id = commentId;

                            reddit.comments.unshift(comment);
                        }
                    }
                });
            }
            return reddit.comments;
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
        // TODO: weitere socket.on --> comment:new, reddit:rating, comment:rating

        return {
            getReddits: getReddits,
            loadReddits: loadReddits,
            addReddit: addReddit,
            getComments: getComments,
            addComment: addComment,
            registerUser: registerUser
        };
    });
