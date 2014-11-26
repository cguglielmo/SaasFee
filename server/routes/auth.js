var express = require('express');
var router = express.Router();
var path = require('path');
var rootPath = path.resolve(process.cwd(), '..');
var db = require('../data/database');
var secret = "VerySecureSecret_az342ckasfjio5128x";
var jwt = require('jsonwebtoken');

router
    .post('/', function (req, res) {
        var email = req.body.email;
        var password = req.body.password;

        if (!email || !password) {
            return res.send(401);
        }

        db.users.findOne({email: email}, function (err, user) {
            if (err) {
                console.log(err);
                return res.send(401);
            }
            if (!user || user.password !== password) {
                return res.send(401);
            }

            //No need to send password back
            delete user.password;

            var token = jwt.sign(user, secret, { expiresInMinutes: 60 });
            return res.json({token: token, user: user});
        });
    });

module.exports = router;
module.exports.secret = secret;