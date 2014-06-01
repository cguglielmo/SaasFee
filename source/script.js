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

var commentTemplate = '\
      <div class="rating">50</div>\
      <h1>$title$</h1>\
      $content$\
      <div class="actionBar">\
        <span class="newComment">Kommentieren</span>\
        <span class="share">Teilen</span>\
        <span class="more">Mehr</span>\
      </div>\
      <div class="details">Submitted<br>3 hours ago<br>by bruno asdf asf asdfsdfasdf<br>to /r/subreddit</div>';


function createNewComment() {

}