// ** DEBUG
if (console) {
  var postMessage = function(msg) {
    console.log(msg);
  };
}
console = console || {};
console.log = console.log || function(msg) {
  postMessage(JSON.stringify(msg)||'');
};
var debug = function(msg) {
  postMessage(JSON.stringify({type:'debug',msg:msg}));
};
// ** END DEBUG

//init
importScripts('components/socket.io-client/dist/socket.io.min.js');
importScripts('indexed-db.js');
var socket = io.connect('http://localhost');
var db;

var attachSockets = function() {
  socket.on('users', function (data) {
    var array = JSON.parse(data);
    var i = array.length;
    var users = db.transaction(["users"], IDBTransaction.READ_WRITE)
                    .objectStore("users");
    users.onerror = function(e){
      console.log('Error adding: '+e);
    };
    users.onsuccess = function(e){
      //something
    };
    var obj,id;
    while(i--) {
      //put takes (value, key)
      obj = array[i];
      id = obj.uuid;
      delete obj.uuid;
      users.put(obj.uuid);
    }
  });
};

var initDb = function(data) {
  db = createDB({
    title:data.dbTitle,
    version:data.dbVersion
  })
  .then(function(db) {
    attachSockets();
    db.onerror = function(event) {
      console.log('database error: ' + event.target.errorCode);
    };
  },function() {
    //show an alert to user!
  });
};

//possible keys: uuid, registered, init, title, 
//possible strings: terminate
//handle requests from the main loop
this.addEventListener('message', function(event) {
  var data = event.data;
  console.log(data);
  if (data.uuid && data.registered) {
    this.uuid = data.uuid;
    this.registered = data.registered;
  }
  if (data.init) {
    //throw exception if no title or no version
    initDb(data);
  }
  if (data === 'terminate') {
    this.close();
  }
});

this.addEventListener('error', function(event) {
  console.log('Error!');
  console.log(JSON.stringify(event));
});
