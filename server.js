/*jshint node: true */
var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    io = require('socket.io');

var server = http.createServer(function (req, res) {
    'use strict';
    var filePath = '.' + req.url,
        contentType = 'text/html',
        extName;

    console.log('request starting...' + filePath);
    if (filePath === './') {
        filePath = './index.html';
    }
    extName = path.extname(filePath);
    switch (extName) {
    case '.js':
        contentType = 'text/javascript';
        break;
    case '.css':
        contentType = 'text/css';
        break;
    }

    path.exists(filePath, function (exists) {
        if (exists) {
            fs.readFile(filePath, function (error, content) {
                if (error) {
                    res.writeHead(500);
                    res.end();
                } else {
                    res.writeHead(200, {
                        'Content-Type': contentType
                    });
                    res.end(content, 'utf-8');
                }
            });
        } else {
            res.writeHead(404);
            res.end();
        }
    });
});

var socket = io.listen(server);

/*
0 - niewykonane
1 - wykonane
 */

var task = [
    {nazwa: "Wyslac FV", data: "2013-01-31", user: 'filip', status: 0},
    {nazwa: "17ta, sms szef", data: "2013-01-31", user: 'filip', status: 0},
    {nazwa: "Pion, odebrac dokumenty", data: "2013-01-31", user: 'monika', status: 0},
    {nazwa: "Bualoy visa", data: "2013-01-23", user: 'monika', status: 1},
    {nazwa: "Wyslac raport", data: "2013-01-31", user: 'monika', status: 0},
    {nazwa: "Poczta", data: "2013-01-25", user: 'monika', status: 1}
	{nazwa: "Nadac paczke", data: "2013-02-02", user: 'wszyscy', status: 0}
	{nazwa: "Podlac kwiatki", data: "2013-01-31", user: 'wszyscy', status: 0}
];

var users = [
    {nazwa: 'filip'},
    {nazwa: 'monika'}
];

socket.on('connection', function (client) {

});

server.listen(3030);
