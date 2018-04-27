//Import the necessary modules
var express =  require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

//Array of users and connection
users = [];
conn = [];

server.listen(process.env.PORT || 3000);
console.log("running...");

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
    conn.push(socket);
    console.log('Connected: %s sockets' + conn.length);

    socket.on('disconnect', function(data){
        
        users.splice(users.indexOf(socket.userName), 1);
        //update users
        io.sockets.emit('get users', users);

        conn.splice(conn.indexOf(socket), 1);
        console.log('Disconnected: Sockets Connected ' + conn.length);
    });

    //Sending messages
    socket.on('send message', function(data){
        console.log(data);
        io.sockets.emit('new message', {msg:data, user: socket.userName});
    });

    socket.on('new user', function(data, callback){
        callback(true);
        socket.userName = data;
        users.push(socket.userName);
        //update users
        io.sockets.emit('get users', users);
    });


});