angular.module('saasFeeApp')
    .controller('LoginCtrl', function ($scope, auth, $location) {
        'use strict';

        $scope.login = login;
        var loginFailed = $location.search().loginFailed;
        if (loginFailed) {
            $scope.error = auth.getErrorMessage();
        }

        function login(userIn) {
            var user = angular.copy(userIn);

            auth.login({email: user.email, password: user.password}, error);

            // reset form
            angular.copy({}, userIn);
        }

        function error(message) {
            $scope.error = message;
        }
    });