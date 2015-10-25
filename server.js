var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var count = 0;
var port = process.env.PORT || 3000;
var users = [];

var USERNAME = "username";
var PHONE_NUMBER = "phoneNumber";
var MESSAGE = "message";
app.set('port', port);

app.get('/', function(req, res){
    res.end("Welcome")
});

io.on('connection', function(socket){

    console.log('a user connected ' + ++count + " " +socket.id);

    var disconnect_handler = function(){
        console.log('user disconnected');
    }
    var chat_message_handler = function(msg){
        console.log('message: ' + msg);
        io.emit('chat message return', "Sweet " + msg);
    }

    var find_or_add_user_handler = function(jsonObj) {
        console.log('a user add or find request received from ' + socket.id + JSON.stringify(jsonObj));
        var msg = "";
        var obj = {};
        var flag = false;

        for(var i = 0; i < users.length; i++)
        {
            if(users[i][USERNAME] == jsonObj[USERNAME])
            {
                flag = true;
                break;
            }
        }

        if (flag) {
            console.log("User not found")
            obj[USERNAME] = jsonObj[USERNAME];
            obj["socket"] = jsonObj[socket.id];
            //obj["socketId"] = socket.id();
            users.push(obj);
            msg = "Your username has been added";


        }
        else {
            console.log("user found")
            msg = "You were found in our database";
        }

        socket.emit("userAddedOrFound", {msg: msg});
    }

    var pong_handler = function(data){
        console.log("Pong received from client");
    }

    var send_message_handler = function(jsonObj) {
        var username = jsonObj[USERNAME];
        var message = jsonObj[MESSAGE];
        console.log("Message received " + message)

    }


    socket.on('disconnect', disconnect_handler)
        .on('chat message', chat_message_handler)
        .on('find or add user', find_or_add_user_handler)
        .on('pong', pong_handler)
        .on('send message', send_message_handler)

    setTimeout(sendHeartbeat, 25000);

    function sendHeartbeat(){
        setTimeout(sendHeartbeat, 25000);
        io.sockets.emit('ping', { beat : 1 });
        console.log("emitted ping")
    }


});


http.listen(port, function(){
    console.log('listening on *: ' + port);
});