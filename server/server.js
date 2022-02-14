const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/isRealString');
const {Users} = require('./utils/user');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;
const app = express();

let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log("A new user just connected");

  
    socket.on('join',(params,callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)){
            callback('Name and room are required');
        }
        
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id,params.name,params.room);
        io.to(params.room).emit('updateUsersList', users.getUserList(params.room))

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'));
        socket.broadcast.emit('newMessage',generateMessage('Admin','New User Joined'));
        
        callback();
    })

    socket.on('createMessage', (msg,callback) => {
        let user = users.getUser(socket.id);

        if(user && isRealString(msg.text)){
          io.to(user.room).emit('newMessage', generateMessage(user.name,msg.text));
        }
        callback('This is Server!');

    });

    socket.on('createLocationMessage', coords => {
       
        let user = users.getUser(socket.id);

        if(user){
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name,
            coords.lat,coords.lng));
        }
        
    })


    socket.on('disconnect', () => {
        console.log('User was disconnected');
        let user = users.removeUser(socket.id);

        if(user){
            io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin',`${user.name} has left ${user.room} chat room.`))
        }
    })
})



server.listen(3000, () => console.log(`server is up on port ${port}`));

// console.log(path.join(__dirname, '/../public'));