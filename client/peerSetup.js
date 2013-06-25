//Config
var cfg = {};
cfg.HOST = 'localhost';
cfg.PORT = '9000';
cfg.ICE =  {'iceServers': [{ 'url': 'stun:stun.l.google.com:19302' }]};
cfg.KEY = 'wb0m4xiao2sm7vi';
//blank metadata for now
cfg.meta =  {};

//Setup the new peer object
var peer = new Peer( uuid, {host: cfg.HOST, key: cfg.KEY, port: cfg.PORT, metadata: cfg.meta,  config:cfg.ICE});

//Listen for incoming connections (direct from the sample)
peer.on('connection', handleConn);

//Error handling on the peer level object
peer.on('error', function(err){
  console.log('Got an error:', err);
});

//Create a new connction (direct from the sample)
var conn = peer.connect(uuid);
conn.on('open', function() {
  conn.send('Hello world!');
});

//connection handler
var handleConn = function(conn){
  conn.on('data', function(data){
    console.log('Got data:', data);
  });

  conn.on('error', function(err){
    console.log('Got an error:', err);
  });
};
