angular.module('saasFeeApp')
    .controller('NewCommentCtrl', function ($scope, repository, auth) {
        'use strict';

        var currentUser = auth.getCurrentUser();
        $scope.submit = addComment;

        function addComment(reddit, commentIn) {
            var comment = angular.copy(commentIn);

            comment.date = new Date();
            comment.author = currentUser.prename;
            comment.rating = 0;

            repository.addComment(reddit, comment);
            // reset form
            angular.copy({}, commentIn);
        }

        function toggleNewRedditBox() {
            $scope.creatingNewReddit = !$scope.creatingNewReddit;
        }
    });
