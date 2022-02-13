const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;
const app = express();

let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log("A new user just connected");
    socket.on('disconnect', () => {
        console.log('User was disconnected');
    })
})



server.listen(3000, () => console.log(`server is up on port ${port}`));

// console.log(path.join(__dirname, '/../public'));