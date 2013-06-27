// ** DEBUG
if (typeof console !== 'undefined') {
  postMessage = function(msg) {
    console.log(msg);
  };
  importScripts = function() {
    return;
  };
}
// for (var prop in this) {
//   postMessage(prop);
//   if (typeof console === 'undefined') {
//     postMessage(JSON.stringify(this[prop]));
//   }
// }
if (typeof console === 'undefined') {
  console = {};
  console.log = function(func,msg) {
    //first argument must be the method origin
    if (arguments.length === 1) {
      msg = func;
      func = '';
    }
    postMessage(func);
    postMessage(msg);
  };
}
// ** END DEBUG

//init
window = self;
importScripts('../components/indexedDBShim/dist/IndexedDBShim.min.js');
window = undefined;
importScripts('../components/q/q.min.js');
importScripts('../components/socket.io-client/dist/socket.io.min.js');
importScripts('indexedDb.js');
importScripts('workerInternalEvents.js');
var socket = io.connect('http://localhost:5000');
var db;

var attachSockets = function() {
  socket.on('users', function (data) {
    var array = JSON.parse(data);
    console.log('socket.on users', data);
    var i = array.length;
    var users = db.transaction(["users"], IDBTransaction.READ_WRITE)
                    .objectStore("users");
    users.onerror = function(e){
      console.log('attachSockets users.onerror','Error adding: '+e);
    };
    users.onsuccess = function(e){
      console.log('attachSockets users.onsuccess','Error adding: '+e);
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
    version:data.dbVersion,
    stores:[{name:'users',keys:{keyPath: 'uuid'}}]
  })
  .then(function(db) {
    db.onerror = function(event) {
      console.log('initDb', 'database error: ' + event.target.errorCode);
    };
    attachSockets();
  },function() {
    //show an alert to user!
  });
};

addEventListener('message', function(event) {
  var data = event.data;
  console.log('msgEventListen',data);
  if (data.uuid && data.registered) {
    this.uuid = data.uuid;
    this.registered = data.registered;
  }
  if (data.init) {
    //throw exception if no title or no version
    initDb(data);
  }
});

addMessageEvent(function(msg) {
  return msg === 'getUsers';
}, function(msg) {
  var users = [];
  db.transaction("users").objectStore("users").openCursor()
  .onsuccess = function(event) {
    var cursor = event.target.result;
    if (cursor) {
      customers.push(cursor.value);
      cursor.continue();
    }
    else {
      msg = {
        replyTo:msg,
        data:users
      };
      postMessage(msg);
    }
  };
});
