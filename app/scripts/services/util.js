angular.module('saasFeeApp')
    .factory('util', function () {
        'use strict';


        var parseLink = function parseLink(link) {
            var url = {}, index, indexSlash;
            if (link.indexOf('//') === 0) {
                url.scheme = '//';
                url.path = link.substr(2);
            }
            else if (link.indexOf('http://') === 0 || link.indexOf('https://') === 0) {
                index = link.indexOf(':');
                url.scheme = link.substr(0, index);
                url.path = link.substr(index + 3);
            }
            else {
                url.scheme = 'http';
                url.path = link;
                link = url.scheme + '://' + url.path;
            }

            indexSlash = url.path.indexOf('/');
            if (indexSlash > 0) {
                url.domain = url.path.substr(0, indexSlash);
                url.path = url.path.substr(indexSlash + 1);
            }
            else {
                url.domain = url.path;
                url.path = '';
            }

            url.extension = extractExtension(link);
            url.fullUrl = link;
            return url;
        };

        function extractExtension(link) {
            var extensionIndex;

            extensionIndex = link.lastIndexOf('.');
            if (extensionIndex < 0) {
                return;
            }

            return link.substr(extensionIndex + 1);
        }

        function nl2br(s) {
            if (!s) {
                return '';
            }
            return s.replace(/\n/g, '<br>');
        }

        return {
            parseLink: parseLink,
            nl2br: nl2br
        };
    });