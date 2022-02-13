let socket = io();

socket.on('connect', function() {
    console.log('Connect to server');
})

socket.on('disconnect', function() {
    console.log('disconnect from server');
})

socket.on('newMessage', function(msg) {
    console.log('newMessage', msg);
})