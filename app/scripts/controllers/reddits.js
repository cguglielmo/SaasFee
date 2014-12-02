angular.module('saasFeeApp')
    .controller('RedditsCtrl', function ($scope, $rootScope, $routeParams, repository, auth) {
        'use strict';

        $scope.reddits = repository.getReddits();

        if ($routeParams.category === 'newest') {
            $scope.predicate = 'date';
            $scope.reverse = true;
            $rootScope.$broadcast('categoryChange',
                {category: $routeParams.category, categoryName: 'Neuste'});
        } else if ($routeParams.category === 'top') {
            $scope.predicate = 'rating';
            $scope.reverse = true;
            $rootScope.$broadcast('categoryChange',
                {category: $routeParams.category, categoryName: 'Top'});
        }

        $scope.rateUp = rateUp;
        $scope.rateDown = rateDown;
        $scope.toggleComments = toggleComments;
        $scope.commentRateUp = commentRateUp;
        $scope.commentRateDown = commentRateDown;

        function rateUp(reddit) {
            repository.updateRedditRating(reddit, 1);
        }

        function rateDown(reddit) {
            repository.updateRedditRating(reddit, -1);
        }

        function commentRateUp(reddit, comment) {
            repository.updateCommentRating(reddit, comment, 1);
        }

        function commentRateDown(reddit, comment) {
            repository.updateCommentRating(reddit, comment, -1);
        }

        function toggleComments(reddit) {
            if (!auth.isLoggedIn()) {
                auth.redirectToLogin();
                return;
            }

            repository.getComments(reddit);
            reddit.displayingComments = !reddit.displayingComments;
        }
    })
    .directive('reddittitle', function ($compile) {
        'use strict';

        var getTemplate = function (reddit) {
            if (reddit.link) {
                return '<a href="' + reddit.url.fullUrl + '">' + reddit.title + '</a>';
            }
            return reddit.title;
        };

        var linker = function (scope, element, attrs) {
            element.html(getTemplate(scope.reddit)).show();
        };

        return {
            restrict: "A",
            rep1ace: true,
            link: linker,
            scope: {
                reddit: '=reddit'
            }
        };
    })
    .directive('redditcontent', function ($compile, util) {
        'use strict';

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

        var getTemplate = function (reddit) {
            if (reddit.link) {
                return createContent(reddit.url);
            }
            return util.nl2br(reddit.text);
        };

        var linker = function (scope, element, attrs) {
            element.html(getTemplate(scope.reddit)).show();
        };

        return {
            restrict: "A",
            rep1ace: true,
            link: linker,
            scope: {
                reddit: '=reddit'
            }
        };
    });
