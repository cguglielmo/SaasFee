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



    initSmartCategoryChooser();



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