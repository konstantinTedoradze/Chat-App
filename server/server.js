const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/isRealString');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;
const app = express();

let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log("A new user just connected");

  
    socket.on('join',(params,callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)){
            callback('Name and room are required');
        }
        
        socket.join(params.room);
        console.log(socket.id);
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'));
        socket.broadcast.emit('newMessage',generateMessage('Admin','New User Joined'));
        
        callback();
    })

    socket.on('createMessage', (msg,callback) => {
        console.log('createMessage',msg);
        io.emit('newMessage', generateMessage(msg.from,msg.text));
        callback('This is Server!');

    });

    socket.on('createLocationMessage', coords => {
        io.emit('newLocationMessage', generateLocationMessage('Admin',
         coords.lat,coords.lng));
    })

    socket.on('disconnect', () => {
        console.log('User was disconnected');
    })
})



server.listen(3000, () => console.log(`server is up on port ${port}`));

// console.log(path.join(__dirname, '/../public'));