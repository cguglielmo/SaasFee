//var color = (Math.random()*1000000).toString().substring(0,6);
//document.getElementsByTagName('body')[0].style.backgroundColor = '#'+color;
//rgb(82, 130, 104)

function newReddit() {
    var newRedditContent = document.getElementById('newRedditContent');
    newRedditContent.style.display = 'inline-block';
}

/*jshint multistr: true */
var redditTemplate = '\
      <div class="redditContent">\
      <div class="rating">50</div>\
      <h1>$title$</h1>\
      $content$\
      <div class="actionBar">\
        <span class="newComment">Kommentieren</span>\
        <span class="share">Teilen</span>\
        <span class="more">Mehr</span>\
      </div>\
      <div class="details">Submitted<br>3 hours ago<br>by bruno asdf asf asdfsdfasdf<br>to /r/subreddit</div>\
      </div>';
function createNewReddit() {
    var titleField = document.getElementById('titleField');
    var linkField = document.getElementById('linkField');
    var textField = document.getElementById('textField');

    var title = titleField.value;
    var content;
    if (linkField.value) {
        var link = linkField.value;
        if (link.indexOf('http://') !== 0 || link.indexOf('https://') !== 0) {
            link = 'http://' + link;
        }
        title = '<a href="' + link + '">' + title + '</a>';
        content = '<video></video>';
    }
    content += '<p class="text">' + textField.value.replace(new RegExp('\n', 'g'), '<br>') + '</p>';

    var reddit = redditTemplate.replace('$title$', title);
    reddit = reddit.replace('$content$', content);

    var reddits = document.getElementById('reddits');

    var hr = document.createElement('div');
    hr.setAttribute('class', 'hr');
    reddits.insertBefore(hr, reddits.firstChild);

    var redditElement = document.createElement('div');
    redditElement.setAttribute('class', 'reddit');
    redditElement.innerHTML = reddit;
    reddits.insertBefore(redditElement, reddits.firstChild);
}

function showComments() {
    var comments = document.getElementsByClassName('comments')[0];
    comments.style.display = 'inline-block';

    var newCommentSpan = document.getElementsByClassName('newComment')[1];
    newCommentSpan.innerHTML = 'Ausblenden (2)';
    newCommentSpan.onclick = hideComments;
    newCommentSpan.scrollIntoView(true);
}

function hideComments() {
    var comments = document.getElementsByClassName('comments')[0];
    comments.style.display = 'none';

    var newCommentSpan = document.getElementsByClassName('newComment')[1];
    newCommentSpan.innerHTML = 'Kommentare (2)';
    newCommentSpan.onclick = showComments;
}

var commentTemplate = '\
        <div class="commentDetails"><a href="$profileLink$">$profileName$</a> $commentDate$</div>\
        <p>$comment$</p>\
        <div class="commentActionBar">\
            <div class="commentRating">\
                <span class="ratingDown"></span>\
                <span>1234</span>\
                <span class="ratingUp"></span>\
            </div>\
        </div>';
function createNewComment() {
    var commentField = document.getElementsByClassName('commentField')[0];
    var profileName = 'claudio';
    var profileLink = 'profile/' + profileName;

    var comment = commentTemplate.replace('$comment$', commentField.value);
    comment = comment.replace('$profileLink$', profileLink);
    comment = comment.replace('$profileName$', profileName);
    comment = comment.replace('$commentDate$', '2014/06/04');

    var comments = document.getElementsByClassName('comments')[0];
    var lastComment = comments.getElementsByClassName('comment')[0];

    var hr = document.createElement('div');
    hr.setAttribute('class', 'hr');
    comments.insertBefore(hr, lastComment);

    var commentElement = document.createElement('div');
    commentElement.setAttribute('class', 'comment');
    commentElement.innerHTML = comment;
    comments.insertBefore(commentElement, hr);
}