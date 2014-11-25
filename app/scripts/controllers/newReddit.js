'use strict';

angular.module('saasFeeApp')
  .controller('NewRedditCtrl', function ($scope, repository, auth, $location) {
    var currentUser = 'bko';
    $scope.url = 'views/newReddit.html';
    $scope.submit = addReddit;
    $scope.creatingNewReddit = false;
    $scope.toggleNewRedditBox = toggleNewRedditBox;

    function addReddit(redditIn) {
        var reddit = angular.copy(redditIn);

        reddit.date =  new Date();
        reddit.author = currentUser;
        reddit.rating = 0;
        reddit.commentCount =  0;

        if (!reddit.title) {
            reddit.title = reddit.link;
        }

        repository.addReddit(reddit);
        toggleNewRedditBox();
        // reset form
        angular.copy({}, redditIn);
    }

    function toggleNewRedditBox() {
        if (!auth.isLoggedIn()) {
            auth.redirectToLogin();
            return;
        }
        $scope.creatingNewReddit = !$scope.creatingNewReddit;
    }

  });
