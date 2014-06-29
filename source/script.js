jQuery.noConflict();
(function ($) {
    var currentUser = 'anonymous';

    var redditTemplate = '\
          <div class="redditContent">\
            <div class="rating">\
              <button class="ratingUp"></button>\
              <div class="ratingValue">$rating$</div>\
              <button class="ratingDown"></button>\
            </div>\
            <h1>$title$</h1>\
            <div class="details">$profile$ $date$</div>\
            <p>$content$</p>\
            <div class="actionBar">\
              <button class="newComment"><span>Kommentare</span><span class="commentCount">$commentCount$</span></button>\
              <button class="share"><span>Teilen</span></button>\
              <button class="more"><span>Mehr</span></button>\
            </div>\
          </div>\
          <div class="comments" style="display:none">\
            <div class="newCommentBox">\
              <textarea class="commentField" placeholder="Kommentar erfassen"></textarea><br>\
              <p>\
                <button class="commentSubmit">Erfassen</button>\
              </p>\
            </div>\
          </div>';

    var commentTemplate = '\
            <div class="commentDetails">$profile$ $commentDate$</div>\
            <p>$comment$</p>\
            <div class="commentActionBar">\
                <div class="commentRating">\
                    <button class="ratingUp"></button>\
                    <div class="ratingValue">$rating$</div>\
                    <button class="ratingDown"></button>\
                </div>\
            </div>';


    initNewRedditBox();

    String.prototype.nl2br = function () {
        return this.replace(/\n/g, "<br>");
    };

    function initNewRedditBox() {
        var $newRedditButton = $('#newRedditButton');
        var $newRedditBox = $('#newRedditBox');
        var $redditSubmit = $newRedditBox.find('#redditSubmit');

        hideNewRedditBox($newRedditBox);
        $newRedditButton.on('click', toggleNewRedditBox);
        $redditSubmit.on('click', createNewReddit);
    }

    function toggleNewRedditBox() {
        var $newRedditBox = $('#newRedditBox');

        if ($newRedditBox.css('display') === 'none') {
            showNewRedditBox($newRedditBox);
        } else {
            hideNewRedditBox($newRedditBox);
        }
    }

    function showNewRedditBox($newRedditBox) {
        $newRedditBox.show();

        $('#newRedditButton')
            .text('Abbrechen')
            .removeClass('newRedditBoxHidden');
    }

    function hideNewRedditBox($newRedditBox) {
       $newRedditBox.hide();

        $('#newRedditButton')
            .text('Neuer Reddit erfassen')
            .addClass('newRedditBoxHidden');
    }

    function createNewReddit() {
        var titleField = document.getElementById('titleField');
        var linkField = document.getElementById('linkField');
        var textField = document.getElementById('textField');

        var reddit = {
            title: titleField.value,
            link: linkField.value,
            text: textField.value,
            date: new Date(),
            author: currentUser,
            rating: 0,
            commentCount:  0
        };

        if (!reddit.title) {
            reddit.title = reddit.link;
        }

        showReddit(reddit);
    }

    function showReddit(reddit) {
        var $redditElement, redditHtml, hr, $reddits, link, url;
        var content = '', title = '';
        if (reddit.link) {
            link = reddit.link;
            url = parseLink(link);

            title = '<a href="' + url.fullUrl + '">' + reddit.title + '</a>';
            content = createContent(url);
        }
        else {
            title = reddit.title;
            content = reddit.text.nl2br();
        }

        $reddits = $('#reddits');

        hr = document.createElement('div');
        hr.setAttribute('class', 'hr');
        $reddits.prepend(hr);

        redditHtml = redditTemplate.replace('$title$', title);
        redditHtml = redditHtml.replace('$content$', content);
        redditHtml = redditHtml.replace('$rating$', reddit.rating);
        redditHtml = redditHtml.replace('$profile$', createProfileLinkTag(reddit.author));
        redditHtml = redditHtml.replace('$date$', reddit.date.toLocaleString());
        redditHtml = redditHtml.replace('$commentCount$', reddit.commentCount);

        $redditElement = $('<article>')
            .addClass('reddit')
            .html(redditHtml);
        $reddits.prepend($redditElement);

        $redditElement.find('.newComment').on('click', toggleComments);
        $redditElement.find('.commentSubmit').on('click', createNewComment);
        $redditElement.find('.ratingUp').on('click', rateUp);
        $redditElement.find('.ratingDown').on('click', rateDown);

        $redditElement.data('reddit', reddit);
    }

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

    function rateUp(event) {
        var ratingDiv = event.target.parentNode.querySelector('.ratingValue');
        var rating = ratingDiv.textContent;
        rating++;
        ratingDiv.textContent = rating;
    }


    function rateDown(event) {
        var ratingDiv = event.target.parentNode.querySelector('.ratingValue');
        var rating = ratingDiv.textContent;
        rating--;
        ratingDiv.textContent = rating;
    }

    function toggleComments(event) {
        var newCommentSpan = $(event.currentTarget).find('span').first();
        var reddit = newCommentSpan.closest('.reddit');
        var comments = reddit.find('.comments');

        if (comments.css('display') === 'none') {
            showComments(newCommentSpan, comments);
        } else {
            hideComments(newCommentSpan, comments);
        }
    }

    function showComments($newCommentElement, $commentsElement) {
        $commentsElement.show();

        $newCommentElement.html('Ausblenden');
    }

    function hideComments($newCommentElement, $commentsElement) {
        $commentsElement.hide();

        $newCommentElement.html('Kommentare');
    }

    function createNewComment(e) {
        var comment;
        var $reddit = $(e.target).parents('.reddit');
        var reddit = $reddit.data('reddit');
        var $comments = $(e.target).closest('.comments');
        var $commentField = $comments.find('.commentField');
        var $commentCount = $reddit.find('.commentCount');

        reddit.commentCount++;
        $commentCount.text(reddit.commentCount);

        comment = {
            author: currentUser,
            text: $commentField.val(),
            date: new Date(),
            rating: 0
        };

        showComment($comments, comment);
    }

    function createProfileLinkTag(profileName) {
        var tag = '<a href="$profileLink$">$profileName$</a>';
        var profileLink = 'profile/' + profileName;

        tag = tag.replace('$profileLink$', profileLink);
        tag = tag.replace('$profileName$', profileName);
        return tag;
    }

    function showComment($commentContainer, comment) {
        var $newCommentBox, $commentElement, $hr;
        var commentHtml = commentTemplate.replace('$comment$', comment.text.nl2br());
        commentHtml = commentHtml.replace('$profile$', createProfileLinkTag(comment.author));
        commentHtml = commentHtml.replace('$commentDate$', comment.date.toLocaleString());
        commentHtml = commentHtml.replace('$rating$', comment.rating);

        $newCommentBox = $commentContainer.children('.newCommentBox');

        if ($commentContainer.children('.comment').length > 0) {
            $hr = $('<div>')
                .addClass('hr');
            $newCommentBox.after($hr);
        }

        $commentElement = $('<div>')
            .addClass('comment')
            .html(commentHtml);
        $newCommentBox.after($commentElement);

        $commentElement.find('.ratingUp').on('click', rateUp);
        $commentElement.find('.ratingDown').on('click', rateDown);
    }

    /* temporary stuff (will be removed as soon as the reddit data is stored permanently) */
    initSampleEntries();
    function initSampleEntries() {
        var $commentContainer, comment;

        // sample text entry
        var reddit = {
            title: 'Text-Only-Beitrag',
            link: '',
            text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor\
                invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo\
                duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor\
                sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor\
                invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo\
                duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor\
                sit amet.',
            date: new Date(),
            author: currentUser,
            rating: 1234,
            commentCount: 2
        };
        showReddit(reddit);

        $commentContainer = $('.comments').first();
        comment = {
            profileName: 'claudio',
            text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor\
                invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo\
                duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor\
                sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor\
                invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo\
                duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor\
                sit amet.',
            date: new Date(),
            author: currentUser,
            rating: 15
        };
        showComment($commentContainer, comment);
        comment = {
            text: 'Bla bla bla',
            date: new Date(),
            author: currentUser,
            rating: 1
        };
        showComment($commentContainer, comment);

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
        showReddit(reddit);

        $commentContainer = $('.comments').first();
        comment = {
            text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor\
                invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo\
                duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor\
                sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor\
                invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo\
                duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor\
                sit amet.',
            date: new Date(),
            author: currentUser,
            rating: 15
        };
        showComment($commentContainer, comment);
    }

})(jQuery);