'use strict';

describe('Service: util', function () {
    var util;

    // load the service's module
    beforeEach(module('saasFeeApp'));

    // instantiate service
    beforeEach(inject(function (_util_) {
        util = _util_;
    }));

    it('should be instantiated', function () {
        expect(!!util).toBe(true);
    });

    describe('method parseLink', function () {
        var testParseLink = function (linkToTest, scheme, domain, path, extension) {
            it('should parse url: ' + linkToTest, function () {
                var url = util.parseLink(linkToTest);
                var expectedFullUrl = linkToTest;
                if (expectedFullUrl.search(/^\/\//) === 0) {
                    // special case for embeded youtube links: //www.youtube.com/embed/XfoobarX
                    expectedFullUrl = expectedFullUrl;
                }
                else if (expectedFullUrl.search(/^http[s]?\:\/\//) === -1) {
                    expectedFullUrl = 'http://' + expectedFullUrl;
                }
                expect(url.fullUrl).toBe(expectedFullUrl);
                expect(url.scheme).toBe(scheme);
                expect(url.domain).toBe(domain);
                expect(url.path).toBe(path);
                expect(url.extension).toBe(extension);
            });
        };

        testParseLink('http://www.hsr.ch', 'http', 'www.hsr.ch', '');
        testParseLink('http://www.hsr.ch/test', 'http', 'www.hsr.ch', 'test');
        testParseLink('http://www.hsr.ch/test/foo', 'http', 'www.hsr.ch', 'test/foo');
        testParseLink('http://www.hsr.ch/test/foo.png', 'http', 'www.hsr.ch', 'test/foo.png', 'png');
        testParseLink('https://www.hsr.ch', 'https', 'www.hsr.ch', '');

        testParseLink('www.hsr.ch', 'http', 'www.hsr.ch', '');
        testParseLink('//www.youtube.com/embed/C-y70ZOSzE0', '//', 'www.youtube.com', 'embed/C-y70ZOSzE0');
    });

    describe('method nl2br', function () {
        var testNl2br = function (text, expectedText) {
            it('should convert text: ' + text, function () {
                var processedText = util.nl2br(text);
                expect(processedText).toBe(expectedText);
            });
        };

        testNl2br('test', 'test');
        testNl2br('test\ntest', 'test<br>test');
        testNl2br('\ntest\n', '<br>test<br>');
        testNl2br('\n', '<br>');
        testNl2br('', '');
        testNl2br(undefined, '');
    });
});