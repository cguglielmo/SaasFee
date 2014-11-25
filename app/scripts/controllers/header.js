'use strict';

angular.module('saasFeeApp')
  .controller('HeaderCtrl', function ($scope, auth, $location) {
        $scope.login = login;
        $scope.logout = auth.logout;
        $scope.changeCategory = changeCategory;

        $scope.$watch(auth.getCurrentUser, function(currentUser) {
            $scope.currentUser = currentUser;
        });

        $scope.$on('categoryChange', function(event ,message){
            $scope.category = message.categoryName;
        });

        function login(userIn) {
           var user = angular.copy(userIn);

           auth.login({email: user.email, password: user.password}, error);

           // reset form
           angular.copy({}, userIn);
        }

        function error(message) {
            auth.redirectToLogin(true);
        }

        function changeCategory(category) {
            if (category === 'top') {
                $location.path('reddits/top');
            } else {
                $location.path('reddits/newest');
            }
        }

  })
.directive("dropdown", function($document) {
        return {
            restrict: "A",
            scope: {
                dropdownOpen: '&'
            },
            link: function (scope, elem, attrs) {
                var $button = jQuery(elem);
                var $dropDownBox = $button.next('.dropdown-box');

                $button.bind('click', toggleDropDown);

                scope.$on('$locationChangeSuccess', function() {
                    hideDropDown();
                });

                function toggleDropDown() {
                    if ($dropDownBox.css('display') === 'none') {
                        showDropDown();
                    } else {
                        hideDropDown();
                    }
                }

                function hideDropDown() {
                    $document.unbind('click');
                    $dropDownBox.hide();
                }

                function showDropDown() {
                    $document.bind('click', onDocumentClick);

                    var offset = $button.position();
                    var buttonRight;

                    $dropDownBox.css('top', offset.top + $button.outerHeight() + parseInt($button.css('margin-top')));
                    if ($dropDownBox.hasClass('right')) {
                        buttonRight = offset.left + $button.outerWidth() + parseInt($button.css('margin-left'));
                        $dropDownBox.css('left', buttonRight - $dropDownBox.outerWidth());
                    } else {
                        $dropDownBox.css('left', offset.left);
                    }

                    $dropDownBox.show();
                }

                function onDocumentClick(event) {
                    //Don't close if button has been clicked. This will be handled by toggleDropDown handler
                    if ($button[0].contains(event.target) ) {
                        return;
                    }
                    hideDropDown();
                }
            }
        };
    });
