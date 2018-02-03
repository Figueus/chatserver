var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');
var emoji = require('node-emoji')

var connection = mysql.createConnection({
  host: "<host>",
  port: <port>,
  user: "<user>",
  password: "<pass>",
  database: "<database>"
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
	
	socket.on('join room', function(room) {
		socket.join(room);
	});
	
	socket.on('new message', function(user, name, message, timestamp, room) {
		socket.broadcast.to(room).emit('new message', user, name, message, timestamp);
		
		var buf = Buffer.from(message, 'utf8');

		var sql = "INSERT INTO messages (user_id, user_name, message, time, room) VALUES ?";
		var values = [[user, name, buf, timestamp, room]];
		connection.query(sql, [values], function (err, result) {
			if (err) throw err;
		});
	})
});

http.listen(3000, function(){
  console.log('The Friendship Bench Chat Server is now listening on port 3000.');
});







