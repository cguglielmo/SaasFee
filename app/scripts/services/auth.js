'use strict';

angular.module('saasFeeApp')
    .factory('auth', function ($http, $window) {
        var currentUser = loadCurrentUserFromSessionStorage();

        var login = function(user) {
            $http.post('/auth', user)
                .success(function (data, status, headers, config) {
                    $window.sessionStorage.token = data.token;
                    currentUser = data.user;
                    persistUserInSessionStorage(currentUser);

                    alert('Weclome');
                })
                .error(function (data, status, headers, config) {

                    alert('Unbekannter Benutzername oder falsches Passwort.');
                });
        };

        var logout = function(user) {
            currentUser = null;
            removeCurrentUserFromSessionStorage();
        };

        var getCurrentUser = function() {
           return currentUser;
        }

        var persistUserInSessionStorage = function(user) {
            $window.sessionStorage.currentUserEmail = user.email;
            $window.sessionStorage.currentUserName = user.name;
            $window.sessionStorage.currentUserPrename = user.prename;
        }

        function loadCurrentUserFromSessionStorage(user) {
            if (!$window.sessionStorage.currentUserEmail) {
                return;
            }

            return {
                email: $window.sessionStorage.currentUserEmail,
                name: $window.sessionStorage.currentUserName,
                prename: $window.sessionStorage.currentUserPrename
            };
        }

        var removeCurrentUserFromSessionStorage = function() {
            delete $window.sessionStorage.token;
            delete $window.sessionStorage.currentUserEmail;
            delete $window.sessionStorage.currentUserName;
            delete $window.sessionStorage.currentUserPrename;
        }

        return {
            login: login,
            logout: logout,
            getCurrentUser: getCurrentUser,
            removeCurrentUserFromSessionStorage: removeCurrentUserFromSessionStorage
        };
    })

    .factory('authInterceptor', function ($rootScope, $q, $window) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                var token = $window.sessionStorage.token;
                if (token) {
                    config.headers.Authorization = 'Bearer ' + token;
                }
                return config;
            },
            response: function (response) {
                if (response.status === 401) {
                    delete $window.sessionStorage.token;
                    delete $window.sessionStorage.currentUserEmail;
                    delete $window.sessionStorage.currentUserName;
                    delete $window.sessionStorage.currentUserPrename;
                }
                return response || $q.when(response);
            }
        };
    })

    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    });