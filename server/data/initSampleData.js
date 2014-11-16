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
    "email": "bruno.köferli@hsr.ch",
    "password": "bko1234"
});

db.reddits.insert({
    "title": "Text-Only-Beitrag",
    "link": "",
    "text": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    "date": "14.09.2014",
    "author": "cgu",
    "rating": 1234,
    "commentCount": 2
}, function(err, reddit) {
    db.comments.insert({
        "redditId": reddit._id,
        "text": "Blab blalrledledle",
        "date": "14.09.2014",
        "author": "bko",
        "rating": 0
    });
    db.comments.insert({
        "redditId": reddit._id,
        "text": "Super Bild!",
        "date": "15.09.2014",
        "author": "cgu",
        "rating": 15
    });
});

db.reddits.insert({
    "title": "Link zu Video",
    "link": "//www.youtube.com/embed/C-y70ZOSzE0",
    "text": "",
    "date": "15.09.2014",
    "author": "bko",
    "rating": 1230,
    "commentCount": 2
}, function(err, reddit) {
    db.comments.insert({
        "redditId": reddit._id,
        "text": "Blab blalrledledle",
        "date": "14.09.2014",
        "author": "bko",
        "rating": 0
    });
    db.comments.insert({
        "redditId": reddit._id,
        "text": "Super Bild!",
        "date": "15.09.2014",
        "author": "cgu",
        "rating": 15
    });
});

db.reddits.insert({
    "title": "Link zu Bild",
    "link": "http://www.ticketcorner.ch/obj/media/CH-eventim/galery/222x222/s/sfv-tickets.gif",
    "text": "",
    "date": "20.10.2014",
    "author": "cgu",
    "rating": 13433,
    "commentCount": 1
}, function(err, reddit) {
    db.comments.insert({
        "redditId": reddit._id,
        "text": "Blab blalrledledle",
        "date": "14.09.2014",
        "author": "bko",
        "rating": 0
    });
});