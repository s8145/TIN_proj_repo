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
    {nazwa: "Wyslac FV", data: "2013-01-31", time: "15:00", user: 'Filip', status: 0},
    {nazwa: "17ta, sms szef", data: "2013-01-31", time: "13:30", user: 'Filip', status: 0},
    {nazwa: "Pion, odebrac dokumenty", data: "2013-01-31", time: "20:00", user: 'Monika', status: 0},
    {nazwa: "Bualoy visa", data: "2013-01-23", time: "", user: 'Gosia', status: 1},
    {nazwa: "Wyslac raport", data: "2013-01-31", time: "", user: 'Artur', status: 0},
    {nazwa: "Poczta", data: "2013-01-25", time: "18:00", user: 'Ewelina', status: 1},
	{nazwa: "Nadac paczke", data: "2013-02-02", time: "18:00", user: 'wszyscy', status: 0},
	{nazwa: "Podlac kwiatki", data: "2013-01-31", time: "", user: 'wszyscy', status: 0}
];

var users = [
    {nazwa: 'Filip'},
    {nazwa: 'Monika'},
	{nazwa: 'Marcin'},
	{nazwa: 'Artur'},
	{nazwa: 'Gosia'},
	{nazwa: 'Angelika'},
	{nazwa: 'Ewelina'}
];

var swch = 0;




	
socket.on('connection', function (client) {
    'use strict';
    swch = 0;

    client.on('setUser', function(data){//sprawdzanie czy logowany uzytkownik znajduje sie w tablicy
        for(var i=0; i<users.length; i++){
            if(users[i].nazwa===data){
                swch = 1;
            }
        }
        if(swch===1){
            client.emit('newTask', task);
        }else{
            client.emit('zlyLogin', "zła nazwa użytkownika");
        }
    }); 

    client.on('addTask', function (data){
        task.push(data);//dodaje do tablicy nowe zadanie
        client.broadcast.emit('newTask', task);
        client.emit('newTask', task);
    });

    client.on('change', function (data){
        if(task[data].status===0){
            task[data].status=1;
            client.emit('newTask', task);
           client.broadcast.emit('newTask', task);
        }else{
            task[data].status=0;
            client.emit('newTask', task);
           client.broadcast.emit('newTask', task);
        }
    });

    client.on('delete', function(data){
        task.splice(data, 1);
        client.emit('newTask', task);
        client.broadcast.emit('newTask', task);
    });
	
	
	function updateTime() {
		var teraz = new Date();
		var terazStr = teraz.getHours()+':'+teraz.getMinutes()+':'+teraz.getSeconds();
		client.emit('newTime', terazStr);
	}	
	setInterval(updateTime, 1000);
	


	
	
});

server.listen(3030);
