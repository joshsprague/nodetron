//Config
var cfg = {};
    cfg.HOST = 'localhost';
    cfg.PORT = '9000';
    cfg.ICE =  {'iceServers': [{ 'url': 'stun:stun.l.google.com:19302' }]};
    cfg.KEY = 'wb0m4xiao2sm7vi';
    cfg.meta =  {};
    cfg.id = null; //uuid from web worker


//Connection handler
var handleConn = function(conn){
  conn.on('data', function(data){
    console.log('Got data:', data);
  });

  conn.on('error', function(err){
    console.log('Got an error:', err);
  });
};


//Setup the new peer object
// var peer = new Peer( uuid, {host: cfg.HOST, key: cfg.KEY, port: cfg.PORT, metadata: cfg.meta,  config:cfg.ICE});

//For Testing with the peer.js server
var peer = new Peer(cfg.id, {key: cfg.KEY});

//Error handling on the peer level object
peer.on('error', function(err){
  console.log('Got an error:', err);
});

peer.on('open', function(id){
  console.log("Connection opened. User ID is: ", id);
});

//Listen for incoming connections (direct from the sample)
peer.on('connection', handleConn);


//Create a new connction (direct from the sample)
var conn = peer.connect('6o13uqntqls4te29');
conn.on('open', function() {
  conn.send('Hello world!');
});
