//var color = (Math.random()*1000000).toString().substring(0,6);
//document.getElementsByTagName('body')[0].style.backgroundColor = '#'+color;
//rgb(82, 130, 104)

function newReddit() {
    var newRedditContent = document.getElementById('newRedditContent');
    newRedditContent.style.display = 'inline-block';

    /*jshint multistr: true */
    var redditHtml = '\
      <div class="rating">50</div>\
        <h1>Text-Only-Beitrag</h1>\
      <p class="text">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>\
      <div class="actionBar">\
        <span class="newComment">Kommentieren</span>\
        <span class="share">Teilen</span>\
      <span class="more">Mehr</span>\
      </div>\
      <div class="details">Submitted<br>3 hours ago<br>by bruno asdf asf asdfsdfasdf<br>to /r/subreddit</div>';

    var reddits = document.getElementById('reddits');

    var hr = document.createElement('div');
    hr.setAttribute('class', 'hr');
    reddits.appendChild(hr);

    var reddit = document.createElement('div');
    reddit.setAttribute('class', 'reddit');
    reddit.innerHTML = redditHtml;
    reddits.appendChild(reddit);
}