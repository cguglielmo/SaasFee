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
        var url = parseLink(link);

        title = '<a href="' + url.fullUrl + '">' + title + '</a>';

        content = createContent(url);
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

function parseLink(link) {
    var url = {}, index, length;
    if(link.indexOf('//') === 0) {
        url.scheme = '//';
        url.path = link.substr(2);
    }
    else if(link.indexOf('http://') === 0 || link.indexOf('https://') === 0) {
        index = link.indexOf(':');
        url.scheme = link.substr(0, index);
        url.path = link.substr(index + 3);
    }
    else {
        url.scheme = 'http';
        url.path = link;
        link = url.scheme +'://' + url.path;
    }

    var indexSlash = url.path.indexOf('/');
    if(indexSlash > 0) {
        url.domain = url.path.substr(0, indexSlash);
        url.path= url.path.substr(indexSlash+1);
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
    var linkType = computeLinkType(url);
    if (linkType === 'image') {
        var image = document.createElement('img');
        image.setAttribute('src', url.fullUrl);
        return image.outerHTML;
    } else if (linkType === 'youtube') {
        var src = url.fullUrl;
        if (src.indexOf('embed') < 0) {
            var path = url.path;
            if(path.indexOf('watch?v=') >= 0) {
                path = path.replace('watch?v=', '');
            }
            src = '//www.youtube.com/embed/' + path;
        }

        var iframe = document.createElement('iframe');
        iframe.setAttribute('src', src);
        iframe.setAttribute('class', 'youtube');
        return iframe.outerHTML;
    }
}

function computeLinkType(link) {
    if (link.domain.indexOf('youtu.be') === 0 || link.domain.indexOf('www.youtube.com') === 0) {
        return 'youtube';
    }

    var types = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tif'];
    if (checkExtension(link.extension, types)) {
        return 'image';
    }

    //extensions = ['mp4', 'm4v', 'mp4v', 'ogv', 'ogg', 'webm'];
    //if (checkExtension(link.extension, extensions)) {
    //    return 'video';
    //}
}

function checkExtension(extension, types) {
    for (var i = 0; i < types.length; i++) {
        if (extension === types[i]) {
            return true;
        }
    }
    return false;
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