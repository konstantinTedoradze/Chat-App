let socket = io();

function scrollToBottom() {
    let messages = document.querySelector("#messages").lastElementChild;
    messages.scrollIntoView();
    console.log('kostaaa')
}

socket.on('connect', function() {
    console.log('Connect to server');
    let search = location.search.substring(1);
    let params = JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) { return key===""?value:decodeURIComponent(value) })

    socket.emit('join', params, function(err){
        if(err){
            alert(err);
            window.location.href = '/';
        }else {
            console.log('No Error');
        }
    })

})

socket.on('disconnect', function() {
    console.log('disconnect from server');
})

socket.on('newMessage', function(msg) {
    const formattedTime = moment(msg.createdAt).format('LT');
    const template = document.querySelector('#message-template').innerHTML;
    const html = mustache.render(template, {
        from: msg.from,
        text: msg.text,
        createdAt: formattedTime
    });
    
    const div = document.createElement('div');
    div.innerHTML = html;
    document.querySelector('#messages').append(div);
    scrollToBottom();
})

socket.on('newLocationMessage', function(msg) {
    const formattedTime = moment(msg.createdAt).format('LT');
    const template = document.querySelector('#location-message-template').innerHTML;
    const html = mustache.render(template, {
        from: msg.from,
        text: msg.url,
        createdAt: formattedTime
    });
    
    const div = document.createElement('div');
    div.innerHTML = html;
    document.querySelector('#messages').append(div);
})


document.querySelector('#submit-btn').addEventListener('click', function(e) {
    e.preventDefault();
    socket.emit('createMessage', {
        from: "User",
        text: document.querySelector('input[name="message"]').value
    }, function(msg) {
        console.log("Server got it.",msg);
    })
})

document.querySelector('#send-location').addEventListener('click', function() {
    if(!navigator.geolocation){
        return alert('Geolocation not supported on this browser');
    }

    navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position,'positionnnn');
        socket.emit('createLocationMessage', {
           lat: position.coords.latitude,
           lng: position.coords.longitude
        })
    }, function () {
        alert('Unable to fetch location');
    });
})