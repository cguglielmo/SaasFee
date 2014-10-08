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
      .when('/', {
        templateUrl: 'views/reddits.html',
        controller: 'RedditsCtrl'
      })
      .when('/about', {
        templateUrl: 'views/newReddit.html',
        controller: 'NewRedditCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
