'use strict';

var connect = require('connect'),
	http = require('http'),
	open = require('open');

	var app = connect().use(connect.static('source')),
		server = http.createServer(app).listen(9000);

	server.on('listening', function() {
		open('http://localhost:9000');
	});
