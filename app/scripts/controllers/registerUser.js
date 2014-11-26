angular.module('saasFeeApp')
    .controller('RegisterUserCtrl', function ($scope, repository) {
        'use strict';

        $scope.submit = registerUser;
        $scope.registrationSuccessful = false;
        $scope.errors = [];

        function registerUser(userIn) {
            var user = angular.copy(userIn);

            repository.registerUser(user, success, fail);

            function success(user) {
                $scope.registrationSuccessful = true;
                $scope.user = user;
            }

            function fail(errors) {
                var errorMsg = '';
                var error;

                for (var i = 0; i < errors.length; i++) {
                    error = errors[i];
                    if (error.field) {
                        $scope.form[error.field].$setValidity(error.validationErrorKey, false);
                    }
                }
                $scope.errors = errors;
            }
        }
    });