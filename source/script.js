//var color = (Math.random()*1000000).toString().substring(0,6);
//document.getElementsByTagName('body')[0].style.backgroundColor = '#'+color;
//rgb(82, 130, 104)

initNewRedditButton();
$('.newComment').on('click', toogleComments);
$('.commentSubmit').on('click', createNewComment);

function showNewRedditBox() {
    var newRedditContent = document.getElementById('newRedditBox');
    newRedditBox.style.display = 'inline-block';

    var newRedditButton = document.getElementById('newRedditButton');
    newRedditButton.innerHTML = 'Abbrechen';
    newRedditButton.className = newRedditButton.className.replace(' newRedditBoxHidden', '');
    newRedditButton.onclick = hideNewRedditBox;
}

function hideNewRedditBox() {
    var newRedditBox = document.getElementById('newRedditBox');
    newRedditBox.style.display = 'none';

    initNewRedditButton();
}

function initNewRedditButton() {
    var newRedditButton = document.getElementById('newRedditButton');
    newRedditButton.innerHTML = 'Neuer Reddit erfassen';
    newRedditButton.className +=' newRedditBoxHidden';
    newRedditButton.onclick = showNewRedditBox;
}


/*jshint multistr: true */
var redditTemplate = '\
      <div class="redditContent">\
      <div class="rating">\
        <button class="ratingUp" onclick="rateUp()"></button>\
        <div class="ratingValue">$rating$</div>\
        <button class="ratingDown" onclick="rateDown()"></button>\
      </div>\
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

    var reddit = {
        title: titleField.value,
        link: linkField.value,
        text: textField.value,
        rating: 0
    };

    if (!reddit.title) {
       reddit.title = reddit.link;
    }

    showReddit(reddit);
}

function showReddit(reddit) {
    var content = '', title='';
    if (reddit.link) {
        var link = reddit.link;
        var url = parseLink(link);

        title = '<a href="' + url.fullUrl + '">' + reddit.title + '</a>';
        content = createContent(url);
    }
    content += '<p class="text">' + reddit.text.replace(new RegExp('\n', 'g'), '<br>') + '</p>';

    var reddits = document.getElementById('reddits');

    var hr = document.createElement('div');
    hr.setAttribute('class', 'hr');
    reddits.insertBefore(hr, reddits.firstChild);

    var redditHtml = redditTemplate.replace('$title$', title);
    redditHtml = redditHtml.replace('$content$', content);
    redditHtml = redditHtml.replace('$rating$', reddit.rating);

    var redditElement = document.createElement('div');
    redditElement.setAttribute('class', 'reddit');
    redditElement.innerHTML = redditHtml;
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

    return '';
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

function rateUp() {
   var ratingDiv = event.target.parentNode.querySelector('.ratingValue');
   var rating = ratingDiv.textContent;
   rating++;
   ratingDiv.textContent = rating;
}


function rateDown() {
    var ratingDiv = event.target.parentNode.querySelector('.ratingValue');
    var rating = ratingDiv.textContent;
    rating--;
    ratingDiv.textContent = rating;
}

function toogleComments(e) {
    var newCommentSpan = $(e.target);
    var reddit = newCommentSpan.closest('.reddit');
    var comments = reddit.find('.comments');

    if (comments.css('display') === 'none') {
        showComments(newCommentSpan, comments);
    } else {
        hideComments(newCommentSpan, comments);
    }
}

function showComments($newCommentElement, $commentsElement) {
    $commentsElement.css('display', 'inline-block');

    $newCommentElement.html('Ausblenden (2)');
}

function hideComments($newCommentElement, $commentsElement) {
    $commentsElement.css('display', 'none');

    $newCommentElement.html('Kommentare (2)');
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
function createNewComment(e) {
    var $comments = $(e.target).closest('.comments');
    var $commentField = $comments.find('.commentField');

    var profileName = 'claudio';
    var profileLink = 'profile/' + profileName;

    var comment = commentTemplate.replace('$comment$', $commentField.val());
    comment = comment.replace('$profileLink$', profileLink);
    comment = comment.replace('$profileName$', profileName);
    comment = comment.replace('$commentDate$', '21/06/2014');

    var $lastComment = $comments.children('.comment:first');

    var $commentElement = $('<div></div>').
        addClass('comment').
        html(comment);
    $lastComment.before($commentElement);

    var hr = document.createElement('div');
    hr.setAttribute('class', 'hr');
    $commentElement.after(hr);
}