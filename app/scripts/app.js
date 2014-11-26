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
      .when('/login', {
        templateUrl: '../views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/register', {
        templateUrl: '../views/register.html',
        controller: 'RegisterUserCtrl'
      })
      .otherwise({
        redirectTo: '/reddits/newest'
      });
  })
  .filter('datetime', function ($filter) {
    return function(dateToFormat){
      return $filter('date')(dateToFormat, 'dd.MM.yyyy HH:mm');
    };
  });
