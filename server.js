var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var count = 0;
var port = process.env.PORT || 3000;
app.set('port', port);

app.get('/', function(req, res){
    res.sendfile('index.html')
});

io.on('connection', function(socket){
    console.log('a user connected ' + ++count);
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        io.emit('chat message return', "Sweet " + msg);
    });
});

http.listen(port, function(){
    console.log('listening on *: ' + port);
});