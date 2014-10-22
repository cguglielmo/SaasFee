'use strict';

angular.module('saasFeeApp')
    .controller('RedditsCtrl', function ($scope, repository) {
        $scope.reddits = repository.getReddits();

        $scope.rateUp = rateUp;
        $scope.rateDown = rateDown;

        function rateUp(reddit) {
          reddit.rating++;
        }

        function rateDown(reddit) {
          reddit.rating--;
        }
    })
    .directive('reddittitle', function($compile) {

        var getTemplate = function(reddit) {
            if (reddit.link) {
                return '<a href="' + reddit.url.fullUrl + '">' + reddit.title + '</a>';
            }
            return reddit.title;
        };

        var linker = function(scope, element, attrs) {
            element.html(getTemplate(scope.reddit)).show();
        };

        return {
            restrict: "A",
            rep1ace: true,
            link: linker,
            scope: {
                reddit:'=reddit'
            }
        };
    })
    .directive('redditcontent', function($compile) {

        function nl2br(s) {
            return s.replace(/\n/g, '<br>');
        }

        function createContent(url) {
            var image, src, path, iframe;
            var linkType = computeLinkType(url);
            if (linkType === 'image') {
                image = document.createElement('img');
                image.setAttribute('src', url.fullUrl);
                return image.outerHTML;
            } else if (linkType === 'youtube') {
                src = url.fullUrl;
                if (src.indexOf('embed') < 0) {
                    path = url.path;
                    if (path.indexOf('watch?v=') >= 0) {
                        path = path.replace('watch?v=', '');
                    }
                    src = '//www.youtube.com/embed/' + path;
                }

                iframe = document.createElement('iframe');
                iframe.setAttribute('src', src);
                iframe.setAttribute('class', 'youtube');
                return iframe.outerHTML;
            }

            return '';
        }

        function computeLinkType(link) {
            var types;
            if (link.domain.indexOf('youtu.be') === 0 || link.domain.indexOf('www.youtube.com') === 0) {
                return 'youtube';
            }

            types = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tif'];
            if (checkExtension(link.extension, types)) {
                return 'image';
            }
        }

        function checkExtension(extension, types) {
            for (var i = 0; i < types.length; i++) {
                if (extension === types[i]) {
                    return true;
                }
            }
            return false;
        }

        var getTemplate = function(reddit) {
            if (reddit.link) {
                return createContent(reddit.url);
            }
            return nl2br(reddit.text);
        };

        var linker = function(scope, element, attrs) {
            element.html(getTemplate(scope.reddit)).show();
        };

        return {
            restrict: "A",
            rep1ace: true,
            link: linker,
            scope: {
                reddit:'=reddit'
            }
        };
    });
