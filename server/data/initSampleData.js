var db = require('./database');

db.users.insert({
    "name": "Guglielmo",
    "prename": "Claudio",
    "email": "claudio.guglielmo@hsr.ch",
    "password": "cgu1234"
});

db.users.insert({
    "name": "Köferli",
    "prename": "Bruno",
    "email": "bruno.koeferli@hsr.ch",
    "password": "bko1234"
});

db.reddits.insert({
    "title": "Text-Only-Beitrag",
    "link": "",
    "text": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    "date": "2014-09-14T16:58:47.326Z",
    "author": "cgu",
    "rating": 1234,
    "commentCount": 2
}, function (err, reddit) {
    db.comments.insert({
        "redditId": reddit._id,
        "text": "Blab blalrledledle",
        "date": "2014-09-14T17:58:47.326Z",
        "author": "bko",
        "rating": 0
    });
    db.comments.insert({
        "redditId": reddit._id,
        "text": "Super Bild!",
        "date": "2014-09-14T17:59:47.326Z",
        "author": "cgu",
        "rating": 15
    });
});

db.reddits.insert({
    "title": "Link zu Video",
    "link": "//www.youtube.com/embed/C-y70ZOSzE0",
    "text": "",
    "date": "2014-09-15T16:58:47.326Z",
    "author": "bko",
    "rating": 1230,
    "commentCount": 2
}, function (err, reddit) {
    db.comments.insert({
        "redditId": reddit._id,
        "text": "Blab blalrledledle",
        "date": "2014-09-16T09:58:47.326Z",
        "author": "bko",
        "rating": 0
    });
    db.comments.insert({
        "redditId": reddit._id,
        "text": "Super Bild!",
        "date": "2014-09-24T16:58:47.326Z",
        "author": "cgu",
        "rating": 15
    });
});

db.reddits.insert({
    "title": "Link zu Bild",
    "link": "http://www.ticketcorner.ch/obj/media/CH-eventim/galery/222x222/s/sfv-tickets.gif",
    "text": "",
    "date": "2014-10-14T16:58:47.326Z",
    "author": "cgu",
    "rating": 13433,
    "commentCount": 1
}, function (err, reddit) {
    db.comments.insert({
        "redditId": reddit._id,
        "text": "Blab blalrledledle",
        "date": "2014-11-14T16:58:47.326Z",
        "author": "bko",
        "rating": 0
    });
});