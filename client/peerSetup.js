//Config
var cfg = {};
cfg.HOST = 'localhost';
cfg.PORT = '9000';
cfg.ICE =  {'iceServers': [{ 'url': 'stun:stun.l.google.com:19302' }]};

//blank metadata for now
cfg.meta =  {};

//Setup the new peer object
var peer = new Peer( uuid, {host: cfg.HOST, port: cfg.PORT, metadata: cfg.meta,  config:cfg.ICE});

//Listen for incoming connections (direct from the sample)
peer.on('connection', function(conn){
  conn.on('data', function(data) {
    console.log('Got data:', data);
  });
});

//Create a new connction (direct from the sample)
var conn = peer.connect(uuid);
conn.on('open', function() {
  conn.send('Hello world!');
});
