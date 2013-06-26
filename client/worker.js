var debug = function(msg) {
  postMessage(JSON.stringify({type:'debug',msg:msg}));
};
console = {};
console.log = function(msg) {
  postMessage(JSON.stringify(msg)||'');
};


//initialization
importScripts('components/socket.io-client/dist/socket.io.min.js');
var socket = io.connect('http://localhost');

//IndexedDB
var db;
var users;
var dbRequest = indexedDB.open("nodetron", 1);
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
  users = db.createObjectStore("users", {keyPath: 'rtcId'});
};

socket.on('users', function (data) {
  var array = JSON.parse(data);
  var i = array.length;
  while(i--) {
    users.add(array[i]);
  }
});



//handle requests from the main loop
this.addEventListener('message', function(event) {
  var data = event.data;
  this.postMessage(data);
  if (data.uuid && data.registered) {
    this.uuid = data.uuid;
    this.registered = data.registered;
  }

}, false);

this.addEventListener('error', function(event) {
  console.log('Error!');
  console.log(JSON.stringify(event));
});
