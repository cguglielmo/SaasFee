'use strict';

angular.module('saasFeeApp')
  .controller('HeaderCtrl', function ($scope, $routeParams, repository) {

    repository.loadReddits().sort();
  });
