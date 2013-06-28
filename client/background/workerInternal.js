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
    postMessage(typeof func === 'string' && func || JSON.stringify(func)||({}).toString.call(func));
    postMessage(typeof msg === 'string' && func || JSON.stringify(msg)||({}).toString.call(msg));
  };
}
// ** END DEBUG

//init
// importScripts('shims.js');
window = self;
importScripts('../components/indexedDBShim/dist/IndexedDBShim.min.js');
window = undefined;
importScripts('../components/q/q.min.js');
importScripts('../components/socket.io-client/dist/socket.io.min.js');
importScripts('indexedDb.js');
importScripts('workerInternalEvents.js');
importScripts('workerInternalResources.js');
var socket;
var db;
var storeNames;

var attachSockets = function() {
  /* JSON string looks like this:
  {"peerjs<apikey>":{
    "<some unique id>":{
      "token":"6njvsw6mgskmx6r",
      "ip":"127.0.0.1"
      }
    }
  }
  */
  socket.on('users', function (data) {
    var usersObj = JSON.parse(data);
    console.log('socket.on users', data);
    var users = db.transaction(["users"], IDBTransaction.READ_WRITE)
                    .objectStore("users");
    users.onerror = function(e){
      console.log('attachSockets users.onerror ',e);
    };
    users.onsuccess = function(e){
      console.log('attachSockets users.onsuccess ',e);
    };
    var apiKey,user,obj;
    for (var key in usersObj) {
      apiKey = key;
      break;
    }
    usersObj = usersObj[apiKey];
    for (key in usersObj) {
      user = usersObj[key];
      obj = {
        uuid: key,
        token:user.token,
        ip:user.ip
      };
      console.log('before user put', obj);
      users.put(obj,'uuid').onerror = function(e) {
        console.log('users put error',e);
      };
    }
  });
};

var initDb = function(data) {
  db = createDB({
    title:data.dbTitle,
    version:data.dbVersion,
    stores:[{name:'users',keysPath:'uuid'}]
  })
  .then(function(db) {
    db.onerror = function(event) {
      console.log('initDb', 'database error: ' + event.target.errorCode);
    };
    storeNames = db.objectStoreNames;
    attachSockets();
  },function() {
    //show an alert to user!
  });
};

addEventListener('message', function(event) {
  var data = event.data;
  console.log('msgEventListen',data);
  if (data.uuid) {
    this.uuid = data.uuid;
  }
  if (data.registered) {
    this.registered = data.registered;
  }
  if (data.serverUrl) {
    socket = io.connect(data.serverUrl);
  }
  if (data.init) {
    //throw exception if no title or no version
    initDb(data);
  }
});