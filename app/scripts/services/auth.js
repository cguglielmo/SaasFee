angular.module('saasFeeApp')
    .factory('auth', function ($http, $window, $location) {
        'use strict';

        var currentUser = loadCurrentUserFromSessionStorage();
        var errorMessage = 'Unbekannter Benutzername oder falsches Passwort.';

        var login = function (user, error) {
            $http.post('/auth', user)
                .success(function (data) {
                    $window.sessionStorage.token = data.token;
                    currentUser = data.user;
                    persistUserInSessionStorage(currentUser);

                    $location.path('/');
                })
                .error(function () {
                    error(errorMessage);
                });
        };

        var logout = function (user) {
            currentUser = null;
            removeCurrentUserFromSessionStorage();
        };

        var getCurrentUser = function () {
            return currentUser;
        };

        var isLoggedIn = function () {
            return !!currentUser;
        };

        var getErrorMessage = function () {
            return errorMessage;
        };

        var redirectToLogin = function (loginFailed) {
            if (loginFailed) {
                $location.path('login').search('loginFailed');
            } else {
                $location.path('login');
            }
        };

        var persistUserInSessionStorage = function (user) {
            $window.sessionStorage.currentUserEmail = user.email;
            $window.sessionStorage.currentUserName = user.name;
            $window.sessionStorage.currentUserPrename = user.prename;
        };

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

        var removeCurrentUserFromSessionStorage = function () {
            delete $window.sessionStorage.token;
            delete $window.sessionStorage.currentUserEmail;
            delete $window.sessionStorage.currentUserName;
            delete $window.sessionStorage.currentUserPrename;
        };

        return {
            login: login,
            logout: logout,
            isLoggedIn: isLoggedIn,
            redirectToLogin: redirectToLogin,
            getCurrentUser: getCurrentUser,
            getErrorMessage: getErrorMessage,
            removeCurrentUserFromSessionStorage: removeCurrentUserFromSessionStorage
        };
    })

    .factory('authInterceptor', function ($rootScope, $q, $window) {
        'use strict';

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
        'use strict';

        $httpProvider.interceptors.push('authInterceptor');
    });