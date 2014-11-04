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
        }

        var loadReddits = function() {
            var deferred = $q.defer();

            if(!reddits) {
                reddits = [];
                loadData('/data/reddits', function (data, status) {
                    var reddit;
                    for (var redditId in data) {
                        if (data.hasOwnProperty(redditId)) {
                            reddit = data[redditId];
                            reddit.id = redditId;
                            addReddit(reddit);
                        }
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
            if (reddit.link) {
                reddit.url = util.parseLink(reddit.link);
            }
            reddits.unshift(reddit);
        };

        var getComments = function(reddit) {
            if(!reddit.comments) {
                reddit.comments = [];
                loadData('/data/reddits/' + reddit.id + '/comments', function(data, status) {
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
        };

        return {
            getReddits: getReddits,
            loadReddits: loadReddits,
            addReddit: addReddit,
            getComments: getComments,
            addComment: addComment
        };
    });
