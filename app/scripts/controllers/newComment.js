angular.module('saasFeeApp')
    .controller('NewCommentCtrl', function ($scope, repository) {
        'use strict';

        var currentUser = 'bko';
        $scope.submit = addComment;

        function addComment(reddit, commentIn) {
            var comment = angular.copy(commentIn);

            comment.date = new Date();
            comment.author = currentUser;
            comment.rating = 0;

            repository.addComment(reddit, comment);
            // reset form
            angular.copy({}, commentIn);
        }

        function toggleNewRedditBox() {
            $scope.creatingNewReddit = !$scope.creatingNewReddit;
        }
    });
