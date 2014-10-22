'use strict';

angular.module('saasFeeApp')
    .factory('repository', function ($http, $q) {

        var reddits;
        var currentUser = 'anonymous';

        function parseLink(link) {
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
        }

        function extractExtension(link) {
            var extensionIndex;

            extensionIndex = link.lastIndexOf('.');
            if (extensionIndex < 0) {
                return;
            }

            return link.substr(extensionIndex + 1);
        }

        /* temporary stuff (will be removed as soon as the reddit data is stored permanently) */
        function initSampleEntries() {
            var reddit, comments;
            var textLoremIpsum = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor\
            invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo\
            duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor\
            sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor\
            invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo\
            duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor\
            sit amet.';


            var ajaxRequest;
            var redditsHandler;
            var commentsHandler;

            ajaxRequest = function(url, successHandler) {
                jQuery.ajax(
                    url,
                    {
                        error: function(jqXhr, textStatus, errorText) {
                            console.log('request errored: ' + textStatus + ' / ' + errorText);
                        },
                        success: function(data, textStatus, jqXhr) {
                            console.log('request succeeded');
                            successHandler(data);
                        }
                    }
                );
            };


            redditsHandler = function(reddits) {
                commentsHandler = function(comments) {
                    initSampleEntry(reddits[0], comments);
                };
                ajaxRequest('/data/reddits/' + 1 + '/comments', commentsHandler);
            };
            ajaxRequest('/data/reddits', redditsHandler);

            // sample text entry
            reddit = {
                title: 'Text-Only-Beitrag',
                link: '',
                text: textLoremIpsum,
                date: new Date(),
                author: currentUser,
                rating: 1234,
                commentCount: 2
            };
            comments = [
                {
                    text: textLoremIpsum,
                    date: new Date(),
                    author: currentUser,
                    rating: 15
                },
                {
                    text: 'Bla bla bla',
                    date: new Date(),
                    author: currentUser,
                    rating: 1
                }
            ];
            initSampleEntry(reddit, comments);

            // sample video entry
            reddit = {
                title: 'Link zu Video',
                link: '//www.youtube.com/embed/C-y70ZOSzE0',
                text: '',
                date: new Date(),
                author: currentUser,
                rating: 1234,
                commentCount: 1
            };
            comments = [
                {
                    text: textLoremIpsum,
                    date: new Date(),
                    author: currentUser,
                    rating: 15
                }
            ];
            initSampleEntry(reddit, comments);

            // sample image entry
            reddit = {
                title: 'Link zu Bild',
                link: 'http://www.ticketcorner.ch/obj/media/CH-eventim/galery/222x222/s/sfv-tickets.gif',
                text: '',
                date: new Date(),
                author: currentUser,
                rating: 15000,
                commentCount: 3
            };
            comments = [
                {
                    text: textLoremIpsum,
                    date: new Date(),
                    author: currentUser,
                    rating: 0
                },
                {
                    text: 'Hopp Schwiiizzz...',
                    date: new Date(),
                    author: currentUser,
                    rating: 1
                },
                {
                    text: 'Super Bild!',
                    date: new Date(),
                    author: currentUser,
                    rating: 15
                }
            ];
            initSampleEntry(reddit, comments);
        }

        function initSampleEntry(reddit, comments) {
            /*var link, url;
             var content = '', title = '';
             if (reddit.link) {
             link = reddit.link;
             //url = parseLink(link);

             //reddit.title = '<a href="' + url.fullUrl + '">' + reddit.title + '</a>';
             reddit.content = createContent(url);
             }
             else {
             //reddit.title = reddit.title;
             reddit.content = nl2br(reddit.text);
             }*/
            addReddit(reddit);
        }


        var loadReddits = function() {
            var deferred = $q.defer();

            if(!reddits) {
                reddits = [];
                initSampleEntries();
                deferred.resolve(reddits);
                /*$http.get('/scripts/data/search.json').then(function (data) {
                    reddits = data.data;
                    deferred.resolve(reddits);
                });*/
            } else {
                deferred.resolve(reddits);
            }
            return deferred.promise;
        };

        var getReddits = function() {
            return reddits;
        };

        var addReddit = function(reddit) {
            if (reddit.link) {
                reddit.url = parseLink(reddit.link);
            }
            reddits.unshift(reddit);
        };

        return {
            getReddits: getReddits,
            loadReddits: loadReddits,
            addReddit: addReddit
        };
    });
