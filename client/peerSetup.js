//Config
var cfg = {};
cfg.host = 'localhost'; //development:'127.0.0.1', production:bsalazar91-server.jit.su
cfg.port = '5000'; //development: 5000, production:80
cfg.config =  {'iceServers': [{ 'url': 'stun:stun.l.google.com:19302' }]};
cfg.debug = true; //enable debugging by default
cfg.key = 'peerjs'; //lwjd5qra8257b9'; // their default key.   'wb0m4xiao2sm7vi' is Jake's Key
cfg.metadata =  {firstName:"Jake", lastName:"Seip", email:"jake.seip@gmail.com", city: "San Francisco", state: "CA",  country:"USA"};
// cfg.id = localStorage.getItem('_nodetron_uuid'); //uuid from web worker


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
var peer = new Peer(localStorage.getItem('_nodetron_uuid'), cfg);

//For Testing with the peer.js server
// var peer = new Peer(cfg.id, {key: cfg.KEY, debug:true});

// SocketIO for testing user interface data.
var socket = io.connect(cfg.HOST+':'+cfg.PORT);
socket.on('users', function (data) {
  console.log(data);
  socket.emit('acknowledge', {received: true, metadata:cfg.meta});
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

var initiatePeerConnection = function(peerID, options){
  var conn = peer.connect(peerID,{'metadata':options});
  conn.on('open', function() {
    conn.send('Hello world!');
    console.log("Connection Opened");
  });
  conn.on('error', function(err){
    console.log('Got DataChannel error:', err);
  });
  conn.on('close', function(data){
    console.log('Connection Closed', data);
  });
};