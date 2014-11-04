'use strict';

angular.module('saasFeeApp')
    .factory('repository', function ($http, $q, util) {
        var reddits;

        var loadData = function(url, success) {
            $http.get(url).
                success(function (data, status) {
                    console.log('request succeeded');
                    success(data, status);
                }).
                error(function(data, status) {
                    console.log('request errored: ' + status + ' / ' + data);
                });
        };
        var addData = function(url, data, success) {
            $http.post(url, data).
                success(function (data, status) {
                    console.log('request succeeded');
                    success(data, status);
                }).
                error(function(data, status) {
                    console.log('request errored: ' + status + ' / ' + data);
                });
        };

        function prepareReddit(reddit) {
            if (reddit.link && !reddit.url) {
                reddit.url = util.parseLink(reddit.link);
            }
        }

        var loadReddits = function() {
            var deferred = $q.defer();

            if(!reddits) {
                reddits = [];
                loadData('/data/reddits', function (data, status) {
                    var reddit;
                    for (var i in data) {
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

        var getReddits = function() {
            return reddits;
        };

        var addReddit = function(reddit) {
            prepareReddit(reddit);
            reddits.unshift(reddit);
            addData('/data/reddits', reddit, function(redditId, status) {
                reddit._id = redditId;
            });
        };

        var getComments = function(reddit) {
            if(!reddit.comments) {
                reddit.comments = [];
                loadData('/data/reddits/' + reddit._id + '/comments', function(data, status) {
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

        var addComment = function(reddit, comment) {
            reddit.commentCount++;
            reddit.comments.unshift(comment);
            addData('/data/reddits/' + reddit._id + '/comments', comment, function(commentId, status) {
                comment._id = commentId;
            });
        };

        return {
            getReddits: getReddits,
            loadReddits: loadReddits,
            addReddit: addReddit,
            getComments: getComments,
            addComment: addComment
        };
    });
