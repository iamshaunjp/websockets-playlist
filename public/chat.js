// Make connection
var socket = io.connect('http://localhost:4000');

let timer,
    timeoutVal = 1000; // time it takes to wait for user to stop typing in ms

// Query DOM
var message = document.getElementById('message'),
      handle = document.getElementById('handle'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback');

// Emit events
btn.addEventListener('click', function(){
    socket.emit('chat', {
        message: message.value,
        handle: handle.value
    });
    message.value = "";
});

message.addEventListener('keypress', function(){
    window.clearTimeout(timer);
    socket.emit('typing', handle.value);
});

message.addEventListener('keyup', function(){
    window.clearTimeout(timer); // prevent errant multiple timeouts from being generated
    timer = window.setTimeout(() => {
        socket.emit('typing-stop', handle.value);
    }, timeoutVal);
    
});

// Listen for events
socket.on('chat', function(data){
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});

socket.on('typing-stop', function(data){
    feedback.innerHTML = '';
});