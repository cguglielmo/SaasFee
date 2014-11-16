'use strict';

angular.module('saasFeeApp')
  .controller('HeaderCtrl', function ($scope) {
  })
.directive("dropdown", function() {
        return {
            restrict: "A",
            link: function (scope, elem, attrs) {
                var $button = jQuery(elem);
                var $dropDownBox = $button.next('.dropdown-box');

                $button.on('click', toggleDropDown);

                function onCloseBox(event) {
                    hideDropDown();
                }

                function toggleDropDown() {
                    if ($dropDownBox.css('display') === 'none') {
                        showDropDown($dropDownBox);
                    } else {
                        hideDropDown($dropDownBox);
                    }
                }

                function hideDropDown($dropDownBox) {
                    $dropDownBox.hide();
                }

                function showDropDown($dropDownBox) {
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
            }
        };
    });
