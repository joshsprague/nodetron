var db;
var dbRequest = window.indexedDB.open("nodetron", 1);
dbRequest.onerror = function(event) {
  console.log(event); //some sort of alert informing the user that they failed to grant permissions
  console.log(dbRequest.errorCode);
};
dbRequest.onsuccess = function(event) {
  db = dbRequest.result;
  db.onerror = function(event) {
    console.log('database error: ' + event.target.errorCode);
  };
};
dbRequest.onupgradeneeded = function(event) {
  var db = event.target.result;

  // Create an objectStore for this database
  var objectStore = db.createObjectStore("user", { connectInfo: "info" });
};

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

