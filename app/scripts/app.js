'use strict';

angular
  .module('saasFeeApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/reddits/:category', {
        templateUrl: 'views/reddits.html',
        controller: 'RedditsCtrl',
        resolve: { 'reddits': ['repository', function (repository) {
            return repository.loadReddits();
        }]
        }
      })
      .when('/about', {
        templateUrl: '../views/newReddit.html',
        controller: 'NewRedditCtrl'
      })
      .otherwise({
        redirectTo: '/reddits/newest'
      });
  });
