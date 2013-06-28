//Config
var cfg = {};
    cfg.HOST = '127.0.0.1'; //development: localhost, production:bsalazar91-server.jit.su
    cfg.PORT = '5000'; //development: 5000, production:80
    cfg.ICE =  {'iceServers': [{ 'url': 'stun:stun.l.google.com:19302' }]};
    cfg.DEBUG = true; //enable debugging by default
    cfg.KEY = 'peerjs' //lwjd5qra8257b9'; // their default key.   'wb0m4xiao2sm7vi' is Jake's Key
    cfg.meta =  {firstName:"Jake", lastName:"Seip", email:"jake.seip@gmail.com", city: "San Francisco", state: "CA",  country:"USA"};
    cfg.id = localStorage.getItem('_nodetron_uuid'); //uuid from web worker


//Connection handler
var handleConn = function(conn){
  conn.on('data', function(data){
    console.log('Got DataChannel data:', data);
  });

  conn.on('error', function(err){
    console.log('Got DataChannel error:', err);
  });
};

//Setup the new peer object
var peer = new Peer( cfg.id, {host: cfg.HOST, debug:cfg.DEBUG, key: cfg.KEY, port: cfg.PORT, metadata: cfg.meta,  config:cfg.ICE});

//For Testing with the peer.js server
// var peer = new Peer(cfg.id, {key: cfg.KEY, debug:true});


// SocketIO for testing user interface data.
var socket = io.connect(cfg.HOST+':'+cfg.PORT);
socket.on('users', function (data) {
  console.log(data);
  socket.emit('acknowledge', { received: true });
});


//Error handling on the peer level object
peer.on('error', function(err){
  console.log('Got an error:', err);
});

peer.on('close', function(err){
  console.log('Connection closed:', err);
});

peer.on('open', function(id){
  console.log("Connection opened. User ID is: ", id);
});

//Listen for incoming connections (direct from the sample)
peer.on('connection', handleConn);

// Create a new connection (direct from the sample)

var initiatePeerConnection = function(peerID){
  var conn = peer.connect(peerID);
  conn.on('open', function() {
    conn.send('Hello world!');
    console.log("Connection Opened");
  });
  conn.on('error', function(err){
    console.log('Got DataChannel error:', err);
  });
  conn.on('close', function(data){
    console.log('data');
  });
};