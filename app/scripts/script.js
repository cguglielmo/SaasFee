jQuery.noConflict();
(function ($) {
    "use strict";

    var currentUser = 'anonymous';

    // Changing the category has no effect yet since the server will be responsible to return the correct reddits for the specified category.
    var currentCategory = 'Beliebt';

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
    initSmartCategoryChooser();



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
        if (!$newRedditBox) {
            $newRedditBox = $('#newRedditBox');
        }

        $newRedditBox.show();

        $('#newRedditButton')
            .text('Abbrechen')
            .removeClass('newRedditBoxHidden');
    }

    function hideNewRedditBox($newRedditBox) {
       if (!$newRedditBox) {
           $newRedditBox = $('#newRedditBox');
       }

       $newRedditBox.hide();

        $('#newRedditButton')
            .text('Neuer Reddit erfassen')
            .addClass('newRedditBoxHidden');
    }

    function initSmartCategoryChooser() {
        var $smartCategoryChooser = $('#smartCategoryChooser');
        var $smartCategoryBox = $('#smartCategoryBox');
        $smartCategoryChooser.on('click', toggleSmartCategoryBox);

        $smartCategoryChooser.text(currentCategory);
    }

    function toggleSmartCategoryBox() {
        var $smartCategoryBox = $('#smartCategoryBox');

        if ($smartCategoryBox.css('display') === 'none') {
            showSmartCategoryBox($smartCategoryBox);
        } else {
            hideSmartCategoryBox($smartCategoryBox);
        }
    }

    function hideSmartCategoryBox($smartCategoryBox) {
        if (!$smartCategoryBox) {
            $smartCategoryBox = $('#smartCategoryBox');
        }

        $smartCategoryBox.hide();
    }

    function showSmartCategoryBox($smartCategoryBox) {
        var $smartCategoryChooser = $('#smartCategoryChooser');
        if (!$smartCategoryBox) {
            $smartCategoryBox = $('#smartCategoryBox');
        }

        $smartCategoryBox.css('top', $smartCategoryChooser.offset().top + $smartCategoryChooser.outerHeight());
        $smartCategoryBox.show();
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

        hideNewRedditBox();
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
            content = nl2br(reddit.text);
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
        var $newCommentSpan = $(event.currentTarget).find('span').first();
        var $reddit = $newCommentSpan.closest('.reddit');
        var $comments = $reddit.find('.comments');

        if ($comments.css('display') === 'none') {
            showComments($newCommentSpan, $comments);
        } else {
            hideComments($newCommentSpan, $comments);
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

    function createNewComment(event) {
        var comment;
        var $commentButton = $(event.target);
        var $reddit = $commentButton.parents('.reddit');
        var reddit = $reddit.data('reddit');
        var $comments = $commentButton.closest('.comments');
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
        var commentHtml = commentTemplate.replace('$comment$', nl2br(comment.text));
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

})(jQuery);