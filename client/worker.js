 var socket = io.connect('http://localhost');
  socket.on('users', function (data) {
    // socket.emit('my other event', { my: 'data' });
  });

//handle requests from the main loop
this.addEventListener('message', function(e) {
  this.postMessage(e.data);

}, false);

this.addEventListener('error', function(event) {
  console.log('Error!');
  console.log(event);
});

//this.close terminates the worker

